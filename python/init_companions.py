import json
import re
import sys
from pathlib import Path

sys.path.append(str((Path(__file__) / ".." / "src").resolve()))
import click
from steamship import Steamship
from steamship.cli.create_instance import load_manifest


@click.command()
@click.pass_context
def init_companions(ctx):
    companions_dir = (Path(__file__) / ".." / ".." / "companions").resolve()

    new_companions = {}
    for companion in companions_dir.iterdir():
        if companion.suffix == ".txt":
            companion_file = companion.open().read()
            preamble, rest = companion_file.split("###ENDPREAMBLE###", 1)
            seed_chat, backstory = rest.split("###ENDSEEDCHAT###", 1)

            pattern = r"### (.*?):(.*?)(?=###|$)"

            # Find all matches
            matches = re.findall(pattern, seed_chat, re.DOTALL)
            if matches:
                seed_chat = []
                for match in matches:
                    user = match[0]
                    message = match[1].strip().replace("\\n\\n", "")
                    seed_chat.append(f"{user}:{message}")
                seed_chat = "\n".join(seed_chat)
            # Create instances for your companion
            print(f"Creating an instance for {companion.stem}")
            client = Steamship(workspace=companion.stem.lower())
            manifest = load_manifest()
            instance = client.use(
                "ai-companion",
                config={
                    "name": companion.stem,
                    "preamble": preamble.strip(),
                    "seed_chat": seed_chat.strip(),
                },
            )

            instance.invoke(
                "index_content",
                content=backstory.strip(),
                file_type="TEXT",
                metadata={"title": "backstory"},
            )

            new_companions[companion.stem] = {
                "name": companion.stem,
                "llm": "steamship",
                "generateEndpoint": f"{instance.invocation_url}answer",
            }

    if click.confirm("Do you want to update the companions.json file?", default=True):
        companions = json.load((companions_dir / "companions.json").open())
        name_to_companion = {companion["name"]: companion for companion in companions}

        for name, companion in new_companions.items():
            old_companion = name_to_companion.get(name, {})
            name_to_companion[name] = {**old_companion, **companion}

        json.dump(
            list(name_to_companion.values()),
            (companions_dir / "companions.json").open("w"),
        )


if __name__ == "__main__":
    init_companions()
