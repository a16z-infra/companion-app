import logging
import re
import uuid
from abc import abstractmethod
from typing import List, Optional, Type

from langchain.agents import Tool, AgentExecutor
from langchain.memory.chat_memory import BaseChatMemory
from steamship import Block
from steamship.agents.mixins.transports.steamship_widget import SteamshipWidgetTransport
from steamship.agents.mixins.transports.telegram import (
    TelegramTransportConfig,
    TelegramTransport,
)
from steamship.agents.schema import (
    AgentContext,
    Metadata,
    Agent,
)
from steamship.agents.service.agent_service import AgentService
from steamship.invocable import post, Config, InvocationContext
from steamship.utils.kv_store import KeyValueStore

from utils import is_uuid, UUID_PATTERN, replace_markdown_with_uuid


class ExtendedTelegramTransport(TelegramTransport):
    def instance_init(self, config: Config, invocation_context: InvocationContext):
        if config.bot_token:
            self.api_root = f"{config.api_base}{config.bot_token}"
            super().instance_init(config=config, invocation_context=invocation_context)


class LangChainTelegramBot(AgentService):
    """Deployable Multimodal Agent that illustrates a character personality with voice.

    NOTE: To extend and deploy this agent, copy and paste the code into api.py.
    """

    USED_MIXIN_CLASSES = [ExtendedTelegramTransport, SteamshipWidgetTransport]
    config: TelegramTransportConfig

    def __init__(self, **kwargs):

        super().__init__(**kwargs)

        # Set up bot_token
        self.store = KeyValueStore(self.client, store_identifier="config")
        bot_token = self.store.get("bot_token")
        if bot_token:
            bot_token = bot_token.get("token")
        self.config.bot_token = bot_token or self.config.bot_token

        # Add transport mixins
        self.add_mixin(
            SteamshipWidgetTransport(client=self.client, agent_service=self, agent=None)
        )
        self.add_mixin(
            ExtendedTelegramTransport(
                client=self.client,
                config=self.config,
                agent_service=self,
                agent=None,
            ),
            permit_overwrite_of_existing_methods=True,
        )

    @post("connect_telegram", public=True)
    def connect_telegram(self, bot_token: str):
        self.store.set("bot_token", {"token": bot_token})
        self.config.bot_token = bot_token or self.config.bot_token

        try:
            self.instance_init()
            return "OK"
        except Exception as e:
            return f"Could not set webhook for bot. Exception: {e}"

    @classmethod
    def config_cls(cls) -> Type[Config]:
        return TelegramTransportConfig

    @abstractmethod
    def get_agent(self, chat_id: str, name: Optional[str] = None) -> AgentExecutor:
        raise NotImplementedError()

    @abstractmethod
    def get_memory(self, chat_id: str) -> BaseChatMemory:
        raise NotImplementedError()

    @abstractmethod
    def get_tools(self, chat_id: str) -> List[Tool]:
        raise NotImplementedError()

    @abstractmethod
    def get_relevant_history(self, prompt: str) -> str:
        raise NotImplementedError()

    def voice_tool(self) -> Optional[Tool]:
        return None

    def respond(
        self,
        incoming_message: Block,
        chat_id: str,
        context: AgentContext,
        name: Optional[str] = None,
    ) -> List[Block]:

        if incoming_message.text == "/new":
            self.get_memory(chat_id).chat_memory.clear()
            return [Block(text="New conversation started.")]

        response = self.get_agent(chat_id, name).run(
            input=incoming_message.text,
            relevantHistory=self.get_relevant_history(incoming_message.text),
        )

        response = replace_markdown_with_uuid(response)
        response = UUID_PATTERN.split(response)
        response = [re.sub(r"^\W+", "", el) for el in response]
        response = [el for el in response if el]
        if audio_tool := self.voice_tool():
            response_messages = []
            for message in response:
                response_messages.append(message)
                if not is_uuid(message):
                    audio_uuid = audio_tool.run(message)
                    response_messages.append(audio_uuid)
        else:
            response_messages = response

        return [
            Block.get(self.client, _id=response)
            if is_uuid(response)
            else Block(text=response)
            for response in response_messages
        ]

    def run_agent(
        self,
        agent: Agent,
        context: AgentContext,
        name: Optional[str] = None,
    ):
        chat_id = context.metadata.get("chat_id")

        incoming_message = context.chat_history.last_user_message
        output_messages = self.respond(
            incoming_message, chat_id or incoming_message.chat_id, context, name
        )
        for func in context.emit_funcs:
            logging.info(f"Emitting via function: {func.__name__}")
            func(output_messages, context.metadata)

    @post("prompt")
    def prompt(self, prompt: str, name: Optional[str] = None) -> str:
        """Run an agent with the provided text as the input."""
        # TODO: @ted do we need this prompt endpoint?

        context = AgentContext.get_or_create(self.client, {"id": str(uuid.uuid4())})
        context.chat_history.append_user_message(prompt)

        output = ""

        def sync_emit(blocks: List[Block], meta: Metadata):
            nonlocal output
            for block in blocks:
                if not block.is_text():
                    block.set_public_data(True)
                    output += f"({block.mime_type}: {block.raw_data_url})\n"
                else:
                    output += f"{block.text}\n"

        context.emit_funcs.append(sync_emit)
        self.run_agent(None, context, name)
        return output
