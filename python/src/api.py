import re
from enum import Enum
from typing import List, Type, Optional, Union

from langchain.agents import Tool, initialize_agent, AgentType, AgentExecutor
from langchain.document_loaders import PyPDFLoader, YoutubeLoader
from langchain.memory import ConversationBufferMemory
from langchain.prompts import MessagesPlaceholder, SystemMessagePromptTemplate
from langchain.schema import SystemMessage, Document, BaseChatMessageHistory
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import VectorStore
from pydantic import Field, AnyUrl
from steamship import File, Tag, Block, SteamshipError
from steamship.invocable import Config, post
from steamship.utils.file_tags import update_file_status
from steamship_langchain.chat_models import ChatOpenAI
from steamship_langchain.memory import ChatMessageHistory
from steamship_langchain.vectorstores import SteamshipVectorStore

from base import LangChainTelegramBot, TelegramTransportConfig

# noinspection PyUnresolvedReferences
from tools import (
    GenerateImageTool,
    SearchTool,
    GenerateSpeechTool,
    VideoMessageTool,
)
from utils import convert_to_handle

TEMPERATURE = 0.2
VERBOSE = True
MODEL_NAME = "gpt-3.5-turbo"


class CompanionConfig(TelegramTransportConfig):
    name: str = Field(description="The name of your companion")
    preamble: str = Field(description="The preamble of your companion")
    seed_chat: str = Field(description="The seed chat of your companion")
    bot_token: str = Field(
        default="", description="The secret token for your Telegram bot"
    )
    generate_voice_responses: bool = Field(
        default=True, description="Enable voice responses"
    )
    elevenlabs_api_key: str = Field(
        default="", description="Optional API KEY for ElevenLabs Voice Bot"
    )
    elevenlabs_voice_id: Optional[str] = Field(
        default="", description="Optional voice_id for ElevenLabs Voice Bot"
    )


class FileType(str, Enum):
    YOUTUBE = "YOUTUBE"
    PDF = "PDF"
    WEB = "WEB"
    TEXT = "TEXT"


FILE_LOADERS = {
    FileType.YOUTUBE: lambda content_or_url: YoutubeLoader.from_youtube_url(
        content_or_url, add_video_info=True
    ).load(),
    FileType.PDF: lambda content_or_url: PyPDFLoader(content_or_url).load(),
    FileType.TEXT: lambda content_or_url: [
        Document(page_content=content_or_url, metadata={})
    ],
}

SYSTEM_MESSAGE_TEMPLATE = """
You are {companion_name}.

{preamble}

You reply with answers that range from one sentence to one paragraph and with some details. 
"""


class MyCompanion(LangChainTelegramBot):
    config: CompanionConfig

    @post("index_content", public=True)
    def index_content(
        self,
        content: Union[str, AnyUrl],
        file_type: FileType,
        metadata: Optional[dict] = None,
        index_handle: Optional[str] = None,
        mime_type: Optional[str] = None,
    ) -> str:
        loaded_documents = FILE_LOADERS[file_type](content)
        metadata = metadata or {}
        for document in loaded_documents:
            try:
                document.metadata = {**document.metadata, **metadata}
                # TODO @Ted can I re-use methods from the indexer pipeline here?
                f = File.create(
                    client=self.client,
                    handle=convert_to_handle(document.metadata["title"]),
                    blocks=[
                        Block(
                            text=document.page_content,
                            tags=[
                                Tag(kind=k, name=v)
                                for k, v in document.metadata.items()
                            ],
                        )
                    ],
                    tags=[Tag(kind="type", name="youtube_video")],
                )
                update_file_status(self.client, f, "Importing")
                chunks = RecursiveCharacterTextSplitter(
                    chunk_size=1_000, chunk_overlap=500
                ).split_documents([document])
                update_file_status(self.client, f, "Indexing")
                self.get_vectorstore().add_documents(chunks)
                update_file_status(self.client, f, "Indexed")
            except SteamshipError as e:
                if e.code == "ObjectExists":
                    return "Failed. Resource already added."
                return e
        return "Added."

    def get_agent(self, chat_id: str, name: Optional[str] = None) -> AgentExecutor:
        llm = ChatOpenAI(
            client=self.client,
            model_name=MODEL_NAME,
            temperature=TEMPERATURE,
            verbose=VERBOSE,
        )

        tools = self.get_tools(chat_id=chat_id)

        memory = self.get_memory(chat_id=chat_id)

        return initialize_agent(
            tools,
            llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            verbose=VERBOSE,
            memory=memory,
            agent_kwargs={
                "system_message": SystemMessage(
                    content=SYSTEM_MESSAGE_TEMPLATE.format(
                        companion_name=self.config.name, preamble=self.config.preamble
                    )
                ),
                "extra_prompt_messages": [
                    SystemMessagePromptTemplate.from_template(
                        template="Relevant details about your past: {relevantHistory} Use these details to answer questions when relevant."
                    ),
                    MessagesPlaceholder(variable_name="memory"),
                ],
            },
        )

    def get_vectorstore(self) -> VectorStore:
        return SteamshipVectorStore(
            client=self.client,
            embedding="text-embedding-ada-002",
            index_name=convert_to_handle(self.config.name),
        )

    def add_seed_chat(self, chat_memory: BaseChatMessageHistory):
        pattern = r"### (.*?):(.*?)(?=###|$)"

        # Find all matches
        matches = re.findall(pattern, self.config.seed_chat, re.DOTALL)

        # Process matches and create list of JSON objects
        for m in matches:
            role = m[0].strip().lower()
            content = m[1].replace("\\n\\n", "").strip()
            if content:
                if role == "human":
                    chat_memory.add_user_message(message=content)
                else:
                    chat_memory.add_ai_message(message=content)

    def get_memory(self, chat_id: str):
        memory = ConversationBufferMemory(
            memory_key="memory",
            chat_memory=ChatMessageHistory(
                client=self.client, key=f"history-{chat_id or 'default'}"
            ),
            return_messages=True,
            input_key="input",
        )

        if len(memory.chat_memory.messages) == 0:
            self.add_seed_chat(memory.chat_memory)
        return memory

    def get_relevant_history(self, prompt: str):
        relevant_docs = self.get_vectorstore().similarity_search(prompt, k=3)
        return "\n".join(
            [relevant_docs.page_content for relevant_docs in relevant_docs]
        )

    def get_tools(self, chat_id: str) -> List[Tool]:
        return [
            GenerateImageTool(self.client),
            VideoMessageTool(self.client, voice_tool=self.voice_tool()),
        ]

    def voice_tool(self) -> Optional[Tool]:
        """Return tool to generate spoken version of output text."""
        # return None
        return GenerateSpeechTool(
            client=self.client,
            voice_id=self.config.elevenlabs_voice_id,
            elevenlabs_api_key=self.config.elevenlabs_api_key,
        )

    @classmethod
    def config_cls(cls) -> Type[Config]:
        return CompanionConfig
