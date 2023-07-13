"""Tool for searching the web."""

from langchain.agents import Tool
from steamship import Steamship
from steamship_langchain.tools import SteamshipSERP

NAME = "Search"

DESCRIPTION = """
Useful for when you need to answer questions about current events
"""


class SearchTool(Tool):
    """Tool used to search for information using SERP API."""

    client: Steamship

    def __init__(self, client: Steamship):
        super().__init__(
            name=NAME, func=self.run, description=DESCRIPTION, client=client
        )

    @property
    def is_single_input(self) -> bool:
        """Whether the tool only accepts a single input."""
        return True

    def run(self, prompt: str, **kwargs) -> str:
        """Respond to LLM prompts."""
        search = SteamshipSERP(client=self.client)
        return search.search(prompt)


if __name__ == "__main__":
    with Steamship.temporary_workspace() as client:
        my_tool = SearchTool(client)
        result = my_tool.run("What's the weather today?")
        print(result)
