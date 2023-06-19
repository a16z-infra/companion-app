# AI Getting Started

<img width="1346" alt="Screen Shot 2023-06-16 at 10 37 51 PM" src="https://github.com/a16z/ai-getting-started/assets/3489963/f09753fc-daf1-4176-904e-b320d2c68fd1">


## Stack

- Auth: [Clerk](https://clerk.com/)
- App logic: [Next.js](https://nextjs.org/)
- VectorDB: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- LLM Orchestration: [Langchain.js](https://js.langchain.com/docs/) 
- Image Model: [Replicate](https://replicate.com/)
- Text Model: [OpenAI](https://platform.openai.com/docs/models)
- Deployment: [Fly](https://fly.io/)

## Quickstart 
The simplest way to try out this stack is to test it out locally and traverse through code files to understand how each component work. Here are the steps to get started. 

### 1. Clone repo

```
git clone git@github.com:a16z/ai-getting-started.git
```

### 2. Install dependencies 

```
cd ai-getting-started
npm install 
```

### 3. Fill out secrets 

```
cp .env.local.example .env.local
```

a. **Clerk Secrets**

Go to https://dashboard.clerk.com/ -> "Add Application" -> Fill in Application name/select how your users should sign in -> Create Application
Now you should see both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` on the screen

<img width="1011" alt="Screen Shot 2023-06-16 at 10 23 56 PM" src="https://github.com/a16z/ai-getting-started/assets/3489963/d816b8a7-9bd6-451c-8e26-becd2a1c819a">

b. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key

c. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key

> **_NOTE:_**  By default, this template uses Pinecone as vector store, but you can turn on Supabase pgvector easily. This means you only need to fill out either Pinecone API key _or_ Supabase API key. 

d. **Pinecone API key**
- Create a Pinecone index by visiting https://app.pinecone.io/ and click on "Create Index"
- Give it an index name (this will be `PINECONE_INDEX`)
- Fill in Dimension as `1536`
- Once the index is successfully created, click on "API Keys" on the left side nav and create an API key: copy "Environment" value to `PINECONE_ENVIRONMENT` variable, and "Value" to `PINECONE_API_KEY`

e. **Supabase API key**
- Create a Supabase instance [here](https://supabase.com/dashboard/projects); then go to Project Settings -> API 
- `SUPABASE_URL` is the URL value under "Project URL"
- `SUPABASE_PRIVATE_KEY` is the key starts with `ey` under Project API Keys
- Now, you should enable pgvector on Supabase and create a schema. You can do this easily by clicking on "SQL editor" on the left hand side on supabase UI and then clicking on "+New Query". Copy paste [this code snippet](https://github.com/a16z/ai-getting-started/blob/main/pgvector.sql) in the SQL editor and click "Run".

### 4. Generate embeddings 

There are a few markdown files under `/blogs` directory as examples so you can do Q&A on it. To generate embeddings and store them in the vector database for future queries, you can run the following command: 

#### If using Pinecone
```bash
npm run generate
```
#### If using Supabase pgvector
In `QAModel.tsx`, replace `/api/qa-pinecone` with `api/qa-pg-vector`.

```bash
node src/scripts/indexBlogPGVector.mjs
```


### 5. Run app locally

Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

### 6. Deploy the app

You can deploy the app easily on many platforms: Fly, Netlify, Vercel, Render, Railway.... here are the steps to deploy to a few common platforms. 

#### Deploy to fly.io

- Run `fly launch` -- this will generate a `fly.toml` that includes all the configurations you will need 
- Run `fly deploy` to deploy the app. You may also want to run `fly scale memory 512` to scale up the fly vm memory for this app. 
- Now you are ready to create a new production environment under the [current Clerk setup](https://dashboard.clerk.com/). For more details on deploying a production app with Clerk, check out their documentation [here](https://clerk.com/docs/deployments/overview)
- Create a new file `.env.prod` locally and fill in all the production-environment secrets. Remember to update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` by copying secrets from Clerk's production instance
-`cat .env.prod | fly secrets import` to upload secrets


## Refs
- https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
- https://js.langchain.com/docs/modules/models/llms/integrations#replicate
- https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa

