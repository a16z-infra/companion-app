# Companion App (based on AI Getting Started template)

<img width="1018" alt="Screen Shot 2023-06-21 at 10 14 33 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/a7abe450-755d-477d-8df2-dd6b4ca62737">

This is a starter project to demonstrate how to create a conversational AI using
both chatgpt and the Vicuna 13b model on Replicate. It uses a vector database to
store the character's backstory and it uses similarity search to retrieve and
prompt so the conversations have more depth. It also provide some conversational
memory by keeping the conversation in a queue and including it in the prompt.  

**Note** This project is purely inteded to be instructive. If you're interested
*in
what a production open source platform, check out
[https://www.steamship.com/](Steamship.ai). Or what the leading AI chat
platforms look like, check out [https://beta.character.ai/](Character.ai). 

## Stack

- Auth: [Clerk](https://clerk.com/)
- App logic: [Next.js](https://nextjs.org/)
- VectorDB: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- LLM Orchestration: [Langchain.js](https://js.langchain.com/docs/) 
- Text Model: [OpenAI](https://platform.openai.com/docs/models), [Replicate (Vicuna13b)](https://replicate.com/replicate/vicuna-13b)
- Text streaming: [ai sdk](https://github.com/vercel-labs/ai)
- Conversation history: [Upstash](https://upstash.com/)
- Deployment: [Fly](https://fly.io/)

## Quickstart 

The following instructions should get you up and running with a fully
functional, local deployment of 4 AIs to chat with. 

### 1. Fork and Clone repo

Fork the repo to your Github account, then run the following command to clone the repo: 
```
git clone git@github.com:[YOUR_GITHUB_ACCOUNT_NAME]/companion-app.git
```

### 2. Install dependencies 

```
cd companion-app
npm install 
```

### 3. Fill out secrets 

```
cp .env.local.example .env.local
```

a. **Clerk Secrets**

Go to https://dashboard.clerk.com/ -> "Add Application" -> Fill in Application name/select how your users should sign in -> Create Application
Now you should see both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` on the screen
<img width="1011" alt="clerk" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/6ce72263-4e83-406d-838e-08a95ea79023">


b. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key

c. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key

> **_NOTE:_**  By default, this template uses Pinecone as vector store, but you can turn on Supabase pgvector easily. This means you only need to fill out either Pinecone API key _or_ Supabase API key. 

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
- Create a Supabase instance [here](https://supabase.com/dashboard/projects); then go to Project Settings -> API 
- `SUPABASE_URL` is the URL value under "Project URL"
- `SUPABASE_PRIVATE_KEY` is the key starts with `ey` under Project API Keys
- Now, you should enable pgvector on Supabase and create a schema. You can do this easily by clicking on "SQL editor" on the left hand side on supabase UI and then clicking on "+New Query". Copy paste [this code snippet](https://github.com/a16z-infra/ai-getting-started/blob/main/pgvector.sql) in the SQL editor and click "Run".

### 4. Generate embeddings 

The `companions/` directory contains the "personalities" of the AIs in .txt files. To generate inbeddings and load them into the vector database to draw from during the chat, run the following command:

#### If using Pinecone
Run the following command to generate embeddings and store them in Pinecone: 
```bash
npm run generate-embeddings-pinecone
```
#### If using Supabase pgvector
In `QAModel.tsx`, replace `/api/qa-pinecone` with `/api/qa-pg-vector`. Then run the following command to generate embeddings and store them in Supabase pgvector:

```bash
npm run generate-embeddings-supabase
```

### 5. Run app locally

Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

You can connect to the project with your browser typically at http://localhost:3000/. 

### 6. Deploy the app

#### Deploy to fly.io
- Register an account on fly.io and then [install flyctl](https://fly.io/docs/hands-on/install-flyctl/)
- Run `fly launch` under project root -- this will generate a `fly.toml` that includes all the configurations you will need 
- Run `fly deploy -ha=false` to deploy the app -- the -ha flag makes sure fly only spins up one instance, which is included in the free plan. You also want to run `fly scale memory 512` to scale up the fly vm memory for this app. 
- For any other non-localhost environment, the existing Clerk development instance should continue to work. You can upload the secrets to Fly by running `cat .env.local | fly secrets import`
- If you are ready to deploy to production, you should create a prod environment under the [current Clerk instance](https://dashboard.clerk.com/). For more details on deploying a production app with Clerk, check out their documentation [here](https://clerk.com/docs/deployments/overview). **Note that you will likely need to manage your own domain and do domain verification as part of the process.**
- Create a new file `.env.prod` locally and fill in all the production-environment secrets. Remember to update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` by copying secrets from Clerk's production instance
-`cat .env.prod | fly secrets import` to upload secrets

#### Other deployment options
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)


## Adding/modifying characters

All character data is stored in the `companions/` directory. To add a companion,
simply add a description to the list in `companions.json`. Put image files in
`public/` in the root directory. Each character should have its own text file
name `charactername.txt`. The format of the text file is as follows:


```
The character's core description that is included with every prompt. Should only
be a few sentances

###ENDPREAMBLE###

Human: Say something here  
Character name: Write a response in their voice 
Human: Maybe another exchange 
Character:  More character dialog

###ENDSEEDCHAT###

Paragraphs of character backstory.

You can add as many as you want

They'll be stored in the vectordb

```

The **preamble** is used with every prompt so should be relatively short. The **seedchat** allows you to provide examples of the characters voice that the model can learn from. And the rest of the file is whatever additional background you want to provide which will be retrieved if relevant to the current discussion. 

## Shortcomings

Oh, there are so many. 
- Currently the UI only shows the current chat and response, loosing the history. 
- Vicuna has a cold start problem so can take a couple of minutes to get a
response for the initial chat
- Error reporting is total crap. Particularly when deployed. So if you have a timeout, or other back end isue, it typically dails silently. 
- The Upstash message history is never cleared. To clear it, you have to go to Upstash and manually delete

## How to contribute to this repo

### Code contribution workflow
You can fork this repo, make changes, and create a PR. Add **@ykhli or @timqian** as reviewers. 

If you are new to contributing on github, here is a step-by-step guide: 

1. Clcik on `Fork` on the top right of this page
2. Work on your change and push it to your forked repo. Now when you navigate to the forked repo's UI, you should see something like the following:
<img width="904" alt="pr-preview" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/631e5f45-39ec-4b54-b9d1-b963e279dcc6">


3. Click on "Contribute" -> "Open Pull Request".
4. Once you have a PR, you can add reviewers.

### Other contributions
Feel free to open feature requests, bug reports etc under Issues.

### How does this work? 
1. You describe the character's background story, name, etc in a README.md file
2. Create embeddings based on content in the [companion name].md file
3. Ask questions!


## Refs
- https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
- https://js.langchain.com/docs/modules/models/llms/integrations#replicate
- https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa

