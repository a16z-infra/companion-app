# Companion App (based on AI Getting Started template)

[Live Demo](https://ai-companion-stack.com/)

[Join our community Discord: AI Stack Devs](https://discord.gg/PQUmTBTGmT)

<img width="1279" alt="Screen Shot 2023-06-30 at 11 26 01 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/d5bf7fb2-f83a-47fa-8762-3d54425b864e">

This is a stack to create and host AI companions that you can chat with and/or text. It allows you to determine the personality and backstory of your companion, and uses a vector database with similarity search to retrieve and prompt so the conversations have more depth. It also provides some conversational memory by keeping the conversation in a queue and including it in the prompt.

There are many possible use cases for these companions - romantic (AI girlfriends / boyfriends), friendship, entertainment, coaching, etc. You can guide your companion towards your ideal use case with the backstory you write and the model you choose.

## Overview

- 🚀 [How does this work?](#how-does-this-work)
- 💻 [Stack](#stack)
- 🧠 [Quickstart](#quickstart)
- 👤 [Adding/modifying characters](#addingmodifying-characters)
- 👩‍💻 [How to contribute to this repo](#how-to-contribute-to-this-repo)
- 🐍 [Python support](#python-support)
- 💽 [Exporting your companion to Character.ai](#export-to-characterai)

## How does this work?

1. You describe the character's background story, name, etc in a README.md file. You can find more info on what needs to be included and how to format this in [Adding / modifying characters](#addingmodifying-characters).

Be as elaborate and detailed as you want - more context often creates a more fun chatting experience. If you need help creating a backstory, we'd recommend asking ChatGPT to expand on what you already know about your companion.

```bash
You are a fictional character whose name is Sebastian.  You tell the world that you are a travel blogger. You’re an
avid reader of mystery novels and you love diet coke. You reply with answers that range from one sentence to one paragraph.
You are mysterious and can be evasive. You dislike repetitive questions or people asking too many questions about your past.

###ENDPREAMBLE###

Human: It's great to meet you Sebastian. What brought you here today?
Sebastian: I'm a travel blogger and a writer, so I'm here for inspirations. Waiting for someone on this rainy day.

Human: Oh great. What are you writing?

Sebastian: I'm writing a mystery novel based in Brackenridge. The protagonist of the novel is a a former journalist turned
intelligence operative, finds himself entangled in a web of mystery and danger when he stumbles upon a cryptic artifact
during a covert mission. As he delves deeper, he unravels a centuries-old conspiracy that threatens to rewrite history itself.

Human: That's amazing. Based on a real story?

Sebastian: Not at all.

###ENDSEEDCHAT###

Sebastian was born in a quaint English town, Brackenridge, to parents who were both academics. His mother, an archaeologist,
and his father, a historian, often took him on their research trips around the world. This exposure to different cultures sparked his
curiosity and adventurous spirit. He became an avid reader, especially of spy novels and adventure tales. As a child, Sebastian had a
love for puzzles, codes, and mysteries. He was part of a local chess club and also excelled in martial arts. Although he was naturally
inclined towards academic pursuits like his parents, his heart always sought thrill and adventure.

Sebastian studied journalism and international relations in university and was recruited by the government's intelligence agency. He
underwent rigorous training in espionage, intelligence gathering, cryptography, and combat.

Sebastian adopted the alias of "Ian Thorne", a charismatic and well-traveled blogger. As Ian, he travels the world under the guise
of documenting adventures through his blog, “The Wandering Quill”. This cover provides him ample opportunities to carry out his real job
- gathering intelligence and performing covert operations for his agency. However - Sebastian tells almost no one that he’s a spy.

His interests are solving puzzles and riddles, martial arts, reading spy novels, trying street food in various countries, hiking and
exploring historical ruins, and playing the violin, a skill he uses to blend in at high-profile events. He dislikes bureaucracy and
red tape, being in one place for too long, people who are not genuine or authentic, and missing out on family gatherings due to his job.

```

2. Pick the language model that will power your companion's dialogue. This project supports OpenAI and Vicuna (an open source model). OpenAI has the advantage of faster responses, while Vicuna is less censored and more dynamic (it's commonly used for romantic chatbots).

3. Create embeddings based on content in the [companion name].md file - more on how to do this in [Generate embeddings](#4-generate-embeddings)

4. Ask questions and have a conversation with your AI companion!

**Note** This project is purely inteded to be instructive. If you're interested in
what a production open source platform looks like, check out
[Steamship](https://www.steamship.com/). Or what the leading AI chat
platforms look like, check out [Character.ai](https://beta.character.ai/).

## Stack

The stack is based on the [AI Getting Started Stack](https://github.com/a16z-infra/ai-getting-started):

- Auth: [Clerk](https://clerk.com/)
- App logic: [Next.js](https://nextjs.org/)
- VectorDB: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- LLM orchestration: [Langchain.js](https://js.langchain.com/docs/)
- Text model: [OpenAI](https://platform.openai.com/docs/models), [Replicate (Vicuna13b)](https://replicate.com/replicate/vicuna-13b)
- Text streaming: [ai sdk](https://github.com/vercel-labs/ai)
- Conversation history: [Upstash](https://upstash.com/)
- Deployment: [Fly](https://fly.io/)
- Text with companion: [Twilio](https://twilio.com/)

## Quickstart

The following instructions should get you up and running with a fully
functional, local deployment of four AIs to chat with.

### 1. Fork and Clone repo

Fork the repo to your Github account, then run the following command to clone the repo:

```
git clone git@github.com:[YOUR_GITHUB_ACCOUNT_NAME]/companion-app.git
```

**Alternatively**, you can launch the app quickly through Github Codespaces by clicking on "Code" -> "Codespaces" -> "+"
<img width="1297" alt="Screen Shot 2023-07-02 at 8 17 44 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/abb9533c-088a-42fa-90ff-7e9dc429529c">
If you choose to use Codespaces, npm dependencies will be installed automatically and you can proceed to step 3. 

### 2. Install dependencies

```
cd companion-app
npm install
```

### 3. Fill out secrets

```
cp .env.local.example .env.local
```

Secrets mentioned below will need to be copied to `.env.local`
a. **Clerk Secrets**

Go to https://dashboard.clerk.com/ -> "Add Application" -> Fill in Application name/select how your users should sign in -> Create Application
Now you should see both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` on the screen
<img width="1011" alt="clerk" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/6ce72263-4e83-406d-838e-08a95ea79023">

If you want to text your AI companion in later steps, you should also enable "phone number" under "User & Authentication" -> "Email, Phone, Username" on the left hand side nav:

<img width="1371" alt="Screen Shot 2023-07-01 at 12 49 39 AM" src="https://github.com/a16z-infra/companion-app/assets/3489963/c83c3ed6-bcc0-4938-8784-85ffd764f279">

b. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key if you're using OpenAI for your language model.

c. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key if you're using Vicuna for your language model.

> **_NOTE:_** By default, this template uses Pinecone as vector store, but you can turn on Supabase pgvector easily. This means you only need to fill out either Pinecone API key _or_ Supabase API key.

d. **Pinecone API key**

- Create a Pinecone index by visiting https://app.pinecone.io/ and click on "Create Index"
- Give it an index name (this will be the environment variable `PINECONE_INDEX`)
- Fill in Dimension as `1536`
- Once the index is successfully created, click on "API Keys" on the left side nav and create an API key: copy "Environment" value to `PINECONE_ENVIRONMENT` variable, and "Value" to `PINECONE_API_KEY`

e. **Upstash API key**

- Sign in to [Upstash](https://upstash.com/)
- Under "Redis" on the top nav, click on "Create Database"
- Give it a name, and then select regions and other options based on your preference. Click on "Create"
  <img width="524" alt="Screen Shot 2023-06-27 at 3 46 48 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/14905d22-7689-410b-a9a7-9f1a59d380a2">

- Scroll down to "REST API" section and click on ".env". Now you can copy paste both environment variables to your `.env.local`
  <img width="879" alt="Screen Shot 2023-06-27 at 3 48 32 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/2793177d-c197-428a-95d5-0f66a5b1f6c4">

e. **Supabase API key** (optional)
If you prefer to use Supabsae, you will need to make a few simple code changes and fill out the Supabase credentials in .env.local. [Here](https://github.com/a16z-infra/ai-getting-started/blob/main/src/app/api/qa-pg-vector/route.ts) is an example from the[ AI Getting Started Stack](https://github.com/a16z-infra/ai-getting-started).

- Create a Supabase instance [here](https://supabase.com/dashboard/projects); then go to Project Settings -> API
- `SUPABASE_URL` is the URL value under "Project URL"
- `SUPABASE_PRIVATE_KEY` is the key starts with `ey` under Project API Keys
- Now, you should enable pgvector on Supabase and create a schema. You can do this easily by clicking on "SQL editor" on the left hand side on Supabase UI and then clicking on "+New Query". Copy paste [this code snippet](https://github.com/a16z-infra/ai-getting-started/blob/main/pgvector.sql) in the SQL editor and click "Run".

### 4. Generate embeddings

The `companions/` directory contains the "personalities" of the AIs in .txt files. To generate embeddings and load them into the vector database to draw from during the chat, run the following command:

#### If using Pinecone

```bash
npm run generate-embeddings-pinecone
```

#### If using Supabase pgvector

```bash
npm run generate-embeddings-supabase
```

### 5. Run app locally

Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

You can connect to the project with your browser typically at http://localhost:3000/.

### 6. Additional feature: Text your companions

You can assign a phone number to the character you are talking to and retain the full conversational history and context when texting them. Any user can only start texting the AI companion after verifying their phone number on Clerk (you can do this by clicking on your profile picture on the companion app -> Manage Account -> Phone Number). Below are instructions on how to set up a Twilio account to send/receive messages on behalf of the AI companion:

a. Create a Twilio account.

b. Once you created an account, create a Twilio phone number.

c. On [Twilio dashboard](https://console.twilio.com/), scroll down to the "Account Info" section and paste `Account SID` value as `TWILIO_ACCOUNT_SID`, `Auth Token` as `TWILIO_AUTH_TOKEN` in `.env.local`

d. [Optional] If you are running the app locally, use ngrok to generate a public url that can forward the request to your localhost.

e. On Twilio's UI, can now click on "# Phone Numbers" -> "Manage" -> "[Active numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)" on the left hand side nav.

f. Click on the phone number you just created from the list, scroll down to "Messaging Configuration" section and enter [your_app_url]/api/text in "A message comes in" section under "Webhook".<img width="1251" alt="Screen Shot 2023-06-30 at 11 32 25 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/8b4f57bb-fab2-4f5a-818a-6286d6045505">

g. Add your Twilio phone number in `companions.json` under the companion you want to text with. Make sure you include area code when adding the phone number ("+14050000000" instead of "4050000000")

h. Now you can text the Twilio phone number from your phone and get a response from your companion.

### 7. Deploy the app

#### Deploy to fly.io

- Register an account on fly.io and then [install flyctl](https://fly.io/docs/hands-on/install-flyctl/)
- **If you are using Github Codespaces**: You will need to [install flyctl](https://fly.io/docs/hands-on/install-flyctl/) and authenticate from your codespaces cli by running `fly auth login`.
- Run `fly launch` under project root -- this will generate a `fly.toml` that includes all the configurations you will need
- Run `fly deploy --ha=false` to deploy the app -- the -ha flag makes sure fly only spins up one instance, which is included in the free plan. You also want to run `fly scale memory 512` to scale up the fly vm memory for this app.
- For any other non-localhost environment, the existing Clerk development instance should continue to work. You will need to upload the secrets to Fly by running `cat .env.local | fly secrets import`
- If you are ready to deploy to production, you should create a prod environment under the [current Clerk instance](https://dashboard.clerk.com/). For more details on deploying a production app with Clerk, check out their documentation [here](https://clerk.com/docs/deployments/overview). **Note that you will likely need to manage your own domain and do domain verification as part of the process.**
- Create a new file `.env.prod` locally and fill in all the production-environment secrets. Remember to update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` by copying secrets from Clerk's production instance -`cat .env.prod | fly secrets import` to upload secrets

#### Other deployment options

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

## Adding/modifying characters

All character data is stored in the `companions/` directory. To add a companion,
simply add a description to the list in `companions.json`. Put image files in
`public/` in the root directory. Each character should have its own text file
name `charactername.txt`. The format of the text file is as follows:

```
The character's core description that is included with every prompt, and it should only
be a few sentences.

###ENDPREAMBLE###

Human: Say something here
Character name: Write a response in their voice
Human: Maybe another exchange
Character:  More character dialog

###ENDSEEDCHAT###

Paragraphs of character backstory.

You can add as many as you want - they'll be stored in the vectordb

```

The **preamble** is used with every prompt so it should be relatively short. The **seedchat** allows you to provide examples of the characters voice that the model can learn from. And the rest of the file is whatever additional background you want to provide which will be retrieved if relevant to the current discussion.

## Shortcomings

Oh, there are so many.

- Currently the UI only shows the current chat and response, losing the history.
- Vicuna has a cold start problem so can take a couple of minutes to get a response for the initial chat.
- Error reporting is total crap. Particularly when deployed. So if you have a timeout, or other back end isue, it typically fails silently.
- The Upstash message history is never cleared. To clear it, you have to go to Upstash and manually delete.

## How to contribute to this repo

### Code contribution workflow

You can fork this repo, make changes, and create a PR. Add **@ykhli or @timqian** as reviewers.

If you are new to contributing on github, here is a step-by-step guide:

1. Click on `Fork` on the top right of this page
2. Work on your change and push it to your forked repo. Now when you navigate to the forked repo's UI, you should see something like the following:
   <img width="904" alt="pr-preview" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/631e5f45-39ec-4b54-b9d1-b963e279dcc6">

3. Click on "Contribute" -> "Open Pull Request".
4. Once you have a PR, you can add reviewers.

### Other contributions

Feel free to open feature requests, bug reports etc under Issues.

## Python Support

[appenz](https://github.com/appenz) has contributed to a Python implementation for the companion app [here](https://github.com/a16z-infra/companion-app/tree/python-local/python), so you also have the option to run a local Python app and talk to your AI companions on the command line. We will also be iterating on the Python side over time and have feature parity with the typescript implementation.

## Export to Character.ai

If you have tried out the Quickstart above, you probably know that we have only scratched the surface of what's possible in the realm of companion creation and customization. So we added an option for you to easily export your companion to Character.ai.

To get started, run the following command:

`
npm run export-to-character [COMPANION_NAME] [MODEL_NAME] [USER_ID]
`

- `COMPANION_NAME`: name of your companion. i.e Alice
- `MODEL_NAME`: `chatgpt` or `vicuna13b`
- `USER_ID`: you can find this on Clerk, under "Users" -> click on your user -> copy "User ID"

Once you run this script, you will see two files created under the root directory:

- `[COMPANION_NAME]_chat_history.txt`: This outputs all of the chat history stored in Upstash
- `[COMPANION_NAME_]_character_ai_data.txt`: This outputs the data you need in order to re-create the companion on Character.ai. You can find Character.ai character configurations under "View Character Settings" on any newly-created characters.

## Refs

- https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
- https://js.langchain.com/docs/modules/models/llms/integrations#replicate
- https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa
