import json
import sys
from pathlib import Path

from steamship.cli.cli import deploy

sys.path.append(str((Path(__file__) / ".." / "src").resolve()))
import click
from steamship import Steamship
from steamship.cli.create_instance import load_manifest

from python.src.api import FileType


@click.command()
@click.pass_context
def init_companions(ctx):
    companions_dir = (Path(__file__) / ".." / ".." / "companions").resolve()

    if click.confirm("Do you want to deploy a new version of your companion?", default=True):
        ctx.invoke(deploy)

    new_companions = {}
    for companion in companions_dir.iterdir():
        if companion.suffix == ".txt":
            companion_file = companion.open().read()
            preamble, rest = companion_file.split('###ENDPREAMBLE###', 1)
            seed_chat, backstory = rest.split('###ENDSEEDCHAT###', 1)

            # Create instances for your companion
            print(f"Creating an instance for {companion.stem}")
            client = Steamship(workspace=companion.stem.lower())
            manifest = load_manifest()
            instance = client.use(manifest.handle,
                                  version=manifest.version,
                                  config={
                                      "companion_name": companion.stem,
                                      "companion_preamble": preamble,
                                  })

            instance.invoke("index_content",
                            content=backstory,
                            file_type=FileType.TEXT,
                            metadata={"title": "backstory"})

            new_companions[companion.stem] = {
                "name": companion.stem,
                "llm": "steamship",
                "generateEndpoint": "https://a16z.steamship.run/a16z/rick-b1578149038e664bacae7fc083683565/answer",

            }

    if click.confirm("Do you want to update the companions.json file?", default=True):
        companions = json.load((companions_dir / "companions.json").open())
        name_to_companion = {companion["name"]: companion for companion in companions}

        for name, companion in new_companions.items():
            old_companion = name_to_companion.get(name, {})
            name_to_companion[name] = {
                **old_companion,
                **companion
            }

        json.dump(list(name_to_companion.values()), (companions_dir / "companions_new.json").open("w"))


if __name__ == "__main__":
    init_companions()
