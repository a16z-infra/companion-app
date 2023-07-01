#
# Compainion-App implemented as a local script, no web server required
#

import os
import asyncio
from dotenv import load_dotenv
from api.upstash import MemoryManager
from api.chatgpt import LlmManager

from companion import load_companions

# Location of the data files from the TS implementation
env_file = "../.env.local"

# This is the default user ID and name. 
def_user_id = "local"
def_user_name = "Human"

# load environment variables from the JavaScript .env file
config = load_dotenv(env_file)

# Find the Clerk user ID, from environment variable or Redis key name
# or default to "local"

async def guess_clerk_user_id(companion):
    if os.getenv('CLERK_USER_ID'):
        return os.getenv('CLERK_USER_ID')
    else:
        id = await companion.memory.find_clerk_user_id()
        return id or def_user_id

async def main():

    # Read list of companions from JSON file
    companions = load_companions()
    for i in range(len(companions)):
        print(f' #{i+1}: {companions[i]}')

    # Ask user to pick a companion and load it
    print(f'Who do you want to chat with 1-{i}?')
    selection = int(input())
    companion = companions[selection-1]
    print('')
    print(f'Connecting you to {companion.name}...')

    # Initialize the companion
    companion.memory = MemoryManager(companion.name, companion.llm_name)
    companion.memory.user_id = await guess_clerk_user_id(companion)
    await companion.load()
    companion.llm = LlmManager(companion.prompt_template)

    # Start chatting
    print('')
    print(f'You are now chatting with {companion.name}. Type "quit" to exit.')
    while True:
        user_input = input("Human> ")
        if user_input == "quit":
            break
        reply = await companion.chat(user_input, def_user_name)
        print(f'{companion.name}: {reply}')    

if __name__ == "__main__":
    asyncio.run(main())

