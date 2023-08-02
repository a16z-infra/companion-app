import logging
import re
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
    Agent,
)
from steamship.agents.service.agent_service import AgentService
from steamship.invocable import Config

from utils import is_uuid, UUID_PATTERN, replace_markdown_with_uuid


class LangChainTelegramBot(AgentService):
    """Deployable Multimodal Agent that illustrates a character personality with voice.

    NOTE: To extend and deploy this agent, copy and paste the code into api.py.
    """

    USED_MIXIN_CLASSES = [TelegramTransport, SteamshipWidgetTransport]
    config: TelegramTransportConfig

    def __init__(self, **kwargs):

        super().__init__(**kwargs)

        # Add transport mixins
        self.add_mixin(
            SteamshipWidgetTransport(client=self.client, agent_service=self, agent=None)
        )
        self.add_mixin(
            TelegramTransport(
                client=self.client,
                config=self.config,
                agent_service=self,
                agent=None,
            ),
        )

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

    def format_response(self, response):
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

        response_blocks = []
        for response in response_messages:
            if is_uuid(response):
                b = Block.get(self.client, _id=response)
                b.set_public_data(True)
                b.url = b.raw_data_url
                response_blocks.append(b)
            else:
                response_blocks.append(Block(text=response))
        return response_blocks

    def run_agent(
            self,
            agent: Agent,
            context: AgentContext,
            name: Optional[str] = None,
    ):
        incoming_message = context.chat_history.last_user_message
        chat_id = context.metadata.get("chat_id") or incoming_message.chat_id

        if incoming_message.text == "/new":
            self.get_memory(chat_id).chat_memory.clear()
            return [Block(text="New conversation started.")]

        response = self.get_agent(chat_id, name).run(
            input=incoming_message.text,
            relevantHistory=self.get_relevant_history(incoming_message.text),
        )

        output_messages = self.format_response(response)

        for func in context.emit_funcs:
            logging.info(f"Emitting via function: {func.__name__}")
            func(output_messages, context.metadata)
