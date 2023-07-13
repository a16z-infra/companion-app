# Python Local Companion 

This is a local python implementation of the CompanionAI stack. It includes:

  1. A local python client that you can use to chat with a companion without starting a web server
  2. An api layer you can use if you want to read or modify companion data from python

The python stack is compatible with the TypeScript implementation and uses the same config files, 
data files, database schemas and databases. Below an example of the python chat client running
locally from the command line.

![image](https://github.com/a16z-infra/companion-app/assets/286029/f7382ef9-4948-40f8-acc1-27396b864037)

When running the python client it will:
- Load companion information from the top level /companions directory.
- Read/write conversation history to Upstash/Redis
- Use OpenAI ChatGPT-turbo-3.5 to generate the chat messages

Right now, Vicuña is not supported. Instead of using Pinecone for the backstory it inserts it directly.
Unless you have a very long (> 5000 word) backstory there should be no noticable difference.

## Installation

Make sure you have python 3.X. Install the necessary requirements with:

```
$ pip3 install -r requirements.txt
```

Next, get the necessary API keys as described in the Readme.md file for the main TS project.
You will need at least Upstash and OpenAI. You do not need Clerk, Pinecone/Supabase.
Add them to the .env.local file in the root directory as described in the top level README.
The python code will read the API keys from the same .env.local file as the TS app.

Run the local client:
```
$ python3 companion_app.py
```

This should bring up the list of companions, allow you to select a companion, and start chatting.

## Using the Python stack as an API Layer

Accessing the companion-ai-stack data via the python API layer is fairly straightforward and below is an example.
After reading the env file with credentials, we load available companions and pick one. Next we attach a 
memory manager to the companion. This creates a connection to a serverless Redis instance on Upstash. As we
don't use Clerk for authentication we now need to find the user ID for the user (more on that below). Once the 
companion is loaded, we can access companion data. In this case, we print the companion's recent chat history.

```
import asyncio
from dotenv import load_dotenv
from api.upstash import MemoryManager
from companion import load_companions
from companion_app import guess_clerk_user_id

config = load_dotenv("../.env.local")

async def main():
    companion = load_companions()[1]
    companion.memory = MemoryManager(companion.name, companion.llm_name)
    companion.memory.user_id = await guess_clerk_user_id(companion)
    await companion.load()

    i = 0
    for c in ( await companion.memory.read_latest_history() ).split("\n"):
        if len(c.strip()) > 0:
            i += 1
            print(f'{i:2} {c.strip()}')

if __name__ == "__main__":
    asyncio.run(main())
```

## Clerk user IDs

If you want to chat with the same companion using both the TypeScript web server and the local 
app, the local app needs your Clerk User ID. If you first start using the TypeScript web server
the python stack should discover the correct Clerk User ID automatically by looking
for a specific Redis key. However if you have multiple users using the web server it can't tell
which one is the correct one. If this happens, go to the Clerk console, find your Clerk User ID 
and add it to the .env.local file. It should look something like this:

```
CLERK_USER_ID="user_***"
```

Once this is done, the python stack will always read/write chat history for this user.