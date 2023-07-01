# Python Local Companion 

This is a local python implementation of the CompanionAI stack. It is compatible with 
the TypeScript implementation and uses the same config files, data files and databases. 
This means if you use a supported LLM you can start a conversation via the TS web app 
and continue it via the local python client (or vice versa).

![image](https://github.com/a16z-infra/companion-app/assets/286029/f7382ef9-4948-40f8-acc1-27396b864037)

Specifically:
- Companion information is loaded from the companion directory
- Conversation history is stored in Upstash/Redis
- It uses OpenAI ChatGPT-turbo-3.5 to generate the chat messages

Right now, Vicuña (the OSS LLM) is not supported. It also doesn't use Pinecone for the
backstory but unless you have a very long (> 4000 word) backstory there should be no
difference.

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

## Sharing a companion with the web app

If you want to chat with the same companion using both the TypeScript web server and the local 
app, the local app needs your Clerk User ID. It will try to discover this automatically by looking
for a specific Redis key. If for any reason this doesn't work, you may need to go to the Clerk
console, find your Clerk User ID and add it to the .env.local file. It should look something
like this:

```
CLERK_USER_ID="user_***"
```
