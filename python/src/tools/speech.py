"""Tool for generating speech."""
import json
import logging
from typing import Optional

from langchain.agents import Tool
from langchain.tools import BaseTool
from steamship import Steamship
from steamship.base.error import SteamshipError

NAME = "GenerateSpokenAudio"

DESCRIPTION = (
    "Used to generate spoken audio from text prompts. Only use if the user has asked directly for a "
    "an audio version of output. When using this tool, the input should be a plain text string containing the "
    "content to be spoken."
)

PLUGIN_HANDLE = "elevenlabs"


class GenerateSpeechTool(Tool):
    """Tool used to generate images from a text-prompt."""

    client: Steamship
    voice_id: Optional[
        str
    ] = "21m00Tcm4TlvDq8ikWAM"  # Voice ID to use. Defaults to Rachel
    elevenlabs_api_key: Optional[str] = ""  # API key to use for Elevenlabs.
    name: Optional[str] = NAME
    description: Optional[str] = DESCRIPTION

    def __init__(
        self,
        client: Steamship,
        voice_id: Optional[str] = "21m00Tcm4TlvDq8ikWAM",
        elevenlabs_api_key: Optional[str] = "",
    ):
        super().__init__(
            name=NAME,
            func=self.run,
            description=DESCRIPTION,
            client=client,
            voice_id=voice_id,
            elevenlabs_api_key=elevenlabs_api_key,
        )

    @property
    def is_single_input(self) -> bool:
        """Whether the tool only accepts a single input."""
        return True

    def run(self, prompt: str, **kwargs) -> str:
        """Respond to LLM prompt."""
        logging.info(f"[{self.name}] {prompt}")
        voice_generator = self.client.use_plugin(
            plugin_handle=PLUGIN_HANDLE,
            config={
                "voice_id": self.voice_id,
                "elevenlabs_api_key": self.elevenlabs_api_key,
            },
        )

        if not isinstance(prompt, str):
            prompt = json.dumps(prompt)

        task = voice_generator.generate(text=prompt, append_output_to_file=True)
        task.wait()
        blocks = task.output.blocks
        logging.info(f"[{self.name}] got back {len(blocks)} blocks")
        if len(blocks) > 0:
            logging.info(f"[{self.name}] audio size: {len(blocks[0].raw())}")
            return blocks[0].id
        raise SteamshipError(f"[{self.name}] Tool unable to generate audio!")
