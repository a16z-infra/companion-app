#
# Compainion-App implemented as a local script, no web server required
#

import os
import json
import asyncio
from dotenv import load_dotenv
from api.upstash import MemoryManager
from api.chatgpt import LlmManager

from companion import Companion

# Location of the data files from the TS implementation
env_file = "../.env.local"
companion_dir = "../companions"
companions_file = "companions.json"

# This is the Clerk user ID. We don't use Clerk for the local client, but it is needed for the Redis key
user_id = "local"
user_name = "Human"

# load environment variables from the JavaScript .env file
config = load_dotenv(env_file)

async def main():

    # For compatibility with the TS implementation, user needs to specify the Clerk user ID
    if os.getenv('CLERK_USER_ID'):
        user_id = os.getenv('CLERK_USER_ID')

    # Read list of companions from JSON file
    i = 0
    companions = []
    with open(os.path.join(companion_dir, companions_file)) as f:
        companion_data = json.load(f)
        for c in companion_data:
            companion = Companion(c)
            print(f' #{i+1}: {companion}')
            companions.append(companion)
            i += 1

    # Ask user to pick a companion and load it
    print(f'Who do you want to chat with 1-{i}?')
    selection = int(input())
    companion = companions[selection-1]
    print('')
    print(f'Connecting you to {companion.name}...')

    # load the companion's backstory, initialize prompts
    l = companion.load_prompt(os.path.join(companion_dir, f'{companion.name}.txt'))
    print(f'Loaded {l} characters of backstory.')

    # Initialize memory. Initialize if empty.
    companion.memory = MemoryManager(companion.name, user_id, companion.llm_name)
    h = await companion.memory.read_latest_history()
    if not h:
        print(f'Chat history empty, initializing.')
        await companion.memory.seed_chat_history(companion.seed_chat, '\n\n')
    else:
        print(f'Loaded {len(h)} characters of chat history.')

    # Initialize LLM
    companion.llm = LlmManager(companion.prompt_template)

    # Start chatting
    print('')
    print(f'You are now chatting with {companion.name}. Type "quit" to exit.')
    while True:
        user_input = input("Human> ")
        if user_input == "quit":
            break
        reply = await companion.chat(user_input, user_name)
        print(f'{companion.name}: {reply}')    

if __name__ == "__main__":
    asyncio.run(main())

