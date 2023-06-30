# Python Local Companion 

This is a local python implementation of the CompanionAI stack. It is compatible with 
the TypeScript implementation and uses the same config files, data files and databases. 
This means if you use a supported LLM you can start a conversation via the TS web app 
and continue it via the local python client (or vice versa).

Specifically:
- Companion information is loaded from the companion directory
- Conversation history is stored in Upstash/Redis
- It uses OpenAI ChatGPT-turbo-3.5 to generate the chat messages

Right now, Vicuña (the OSS LLM) and Pinecone (for retrieving longer chat history and 
backstory), are not supported yet but will be added shortly.

## Installation

Make sure you have python 3.X. Install the necessary requirements with:

```
$ pip3 install -r requirements.txt
```

Next, get the necessary API keys as described in the Readme.md file for the main TS project.
You will need at least Upstash, OpenAI and Pinecone. You do not need Clerk (as we are local).
Add them to the .env.local file in the root directory as described in the top level README.
The python code will reads the API keys from the same .env.local file as the TS app.

Run the local client:

```
$ python3 localcompanion.py
```

This should bring up the list of companions, allow you to select a companion, and start chatting.

## Sharing a companion with the web app

Right now, if you want to share chat history with the web app, you need to specify the Clerk user
ID as it is used as part of the Upstash Redis key. Find it via the Clerk console,  add the following
to the .env.local in the root directory:

```
CLERK_USER_ID="user_***"
```
