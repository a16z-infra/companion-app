"""Tool for generating images."""
import logging
import uuid
from typing import Optional

from langchain.agents import Tool
from steamship import Steamship, Block, SteamshipError
from steamship.data.workspace import SignedUrl
from steamship.utils.signed_urls import upload_to_signed_url

NAME = "VideoMessage"

DESCRIPTION = (
    "Useful for when you want to send a video message."
    "Input: The message you want to say in a video."
    "Output: the UUID of the generated video message with your message."
)

PLUGIN_HANDLE = "did-video-generator"


class VideoMessageTool(Tool):
    """Tool used to generate images from a text-prompt."""

    client: Steamship
    voice_tool: Optional[Tool]

    def __init__(self, client: Steamship, voice_tool: Optional[Tool] = None):
        super().__init__(
            name=NAME,
            func=self.run,
            description=DESCRIPTION,
            client=client,
            return_direct=True,
            voice_tool=voice_tool,
        )

    @property
    def is_single_input(self) -> bool:
        """Whether the tool only accepts a single input."""
        return True

    def run(self, prompt: str, **kwargs) -> str:
        """Generate a video."""
        video_generator = self.client.use_plugin(PLUGIN_HANDLE)

        audio_url = None
        if self.voice_tool:
            block_uuid = self.voice_tool.run(prompt)
            audio_url = make_block_public(
                self.client, Block.get(self.client, _id=block_uuid)
            )

        task = video_generator.generate(
            text="" if audio_url else prompt,
            append_output_to_file=True,
            options={
                "source_url": "https://i.redd.it/m65t9q5cwuk91.png",
                "audio_url": audio_url,
                "provider": None,
                "expressions": [
                    {"start_frame": 0, "expression": "surprise", "intensity": 1.0},
                    {"start_frame": 50, "expression": "happy", "intensity": 1.0},
                    {"start_frame": 100, "expression": "serious", "intensity": 0.6},
                    {"start_frame": 150, "expression": "neutral", "intensity": 1.0},
                ],
                "transition_frames": 20,
            },
        )
        task.wait(retry_delay_s=3)
        blocks = task.output.blocks
        logging.info(f"[{self.name}] got back {len(blocks)} blocks")
        if len(blocks) > 0:
            logging.info(f"[{self.name}] video size: {len(blocks[0].raw())}")
            return blocks[0].id
        raise SteamshipError(f"[{self.name}] Tool unable to generate video!")


def make_block_public(client, block):
    filepath = f"{uuid.uuid4()}.{block.mime_type.split('/')[1].lower()}"
    signed_url = (
        client.get_workspace()
        .create_signed_url(
            SignedUrl.Request(
                bucket=SignedUrl.Bucket.PLUGIN_DATA,
                filepath=filepath,
                operation=SignedUrl.Operation.WRITE,
            )
        )
        .signed_url
    )
    read_signed_url = (
        client.get_workspace()
        .create_signed_url(
            SignedUrl.Request(
                bucket=SignedUrl.Bucket.PLUGIN_DATA,
                filepath=filepath,
                operation=SignedUrl.Operation.READ,
            )
        )
        .signed_url
    )
    upload_to_signed_url(signed_url, block.raw())
    return read_signed_url
