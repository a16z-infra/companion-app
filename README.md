# AI Getting Started

[Live Demo (deployed on fly.io)](https://ai-getting-started.com/)



<img width="1305" alt="Screen Shot 2023-06-20 at 1 30 56 PM" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/bcc762d2-68f5-4c4e-8c49-14602bee4995">


## Stack

- Auth: [Clerk](https://clerk.com/)
- App logic: [Next.js](https://nextjs.org/)
- VectorDB: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- LLM Orchestration: [Langchain.js](https://js.langchain.com/docs/) 
- Image Model: [Replicate](https://replicate.com/)
- Text Model: [OpenAI](https://platform.openai.com/docs/models)
- Text streamming: [ai sdk](https://github.com/vercel-labs/ai)
- Deployment: [Fly](https://fly.io/)

## Overview
- 🚀 [Quickstart](#quickstart)
- 💻 [Contribute to this repo](#how-to-contribute-to-this-repo)

## Quickstart 
The simplest way to try out this stack is to test it out locally and traverse through code files to understand how each component work. Here are the steps to get started. 

### 1. Fork and Clone repo

Fork the repo to your Github account, then run the following command to clone the repo: 
```
git clone git@github.com:[YOUR_GITHUB_ACCOUNT_NAME]/ai-getting-started.git
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

e. **Supabase API key**
- Create a Supabase instance [here](https://supabase.com/dashboard/projects); then go to Project Settings -> API 
- `SUPABASE_URL` is the URL value under "Project URL"
- `SUPABASE_PRIVATE_KEY` is the key starts with `ey` under Project API Keys
- Now, you should enable pgvector on Supabase and create a schema. You can do this easily by clicking on "SQL editor" on the left hand side on supabase UI and then clicking on "+New Query". Copy paste [this code snippet](https://github.com/a16z-infra/ai-getting-started/blob/main/pgvector.sql) in the SQL editor and click "Run".

### 4. Generate embeddings 

There are a few markdown files under `/blogs` directory as examples so you can do Q&A on them. To generate embeddings and store them in the vector database for future queries, you can run the following command: 

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

## Refs
- https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
- https://js.langchain.com/docs/modules/models/llms/integrations#replicate
- https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa

