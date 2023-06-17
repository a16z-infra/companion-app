# AI Getting Started

<img width="1346" alt="Screen Shot 2023-06-16 at 10 37 51 PM" src="https://github.com/a16z/ai-getting-started/assets/3489963/f09753fc-daf1-4176-904e-b320d2c68fd1">


## Stack

- Auth: Clerk
- App logic: Next.js
- VectorDB: Pinecone
- LLM Orchestration: Langchain.js 
- Image Model: Replicate
- Text Model: OpenAI
- Deployment: Fly

## Quickstart 
The simplest way to try out this stack is to test it out locally and traverse throgh code files to understand how each component work. Here are the steps to get started. 

1. Fork repo 

```git clone git@github.com:a16z/ai-getting-started.git```

2. Install dependencies 

```
cd ai-getting-started
npm install 
```

3. Fill out secrets 

```
cp .env.local copy.example .env.local
```

a. **Clerk Secrets**

Go to https://dashboard.clerk.com/ -> "Add Application" -> Fill in Application name/select how your users should sign in -> Create Application
Now you should see both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` on the screen

<img width="1011" alt="Screen Shot 2023-06-16 at 10 23 56 PM" src="https://github.com/a16z/ai-getting-started/assets/3489963/d816b8a7-9bd6-451c-8e26-becd2a1c819a">

b. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key

c. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key

d. **Pinecone API key**
- Create a Pinecone index by visiting https://app.pinecone.io/ and click on "Create Index"
- Give it an index name (this will be `PINECONE_INDEX`)
- Fill in Dimension as `1536`
- Once the index is successfully created, click on "API Keys" on the left side nav and create an API key: copy "Environment" value to `PINECONE_ENVIRONMENT` variable, and "Value" to `PINECONE_API_KEY`

4. Generate embeddings 
There are a few markdown files under `/blogs` directory as examples so you can do Q&A on it. To generate embeddings and store them in the vector database for future queries, you can run the following command: 

```bash
node src/scripts/indexBlogs.mjs
```

5. Run app locally
Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

6. Deploy the app
You can deploy the app in many platforms: Fly, Netlify, Vercel, Render, Railway.... 
If you want to deploy the app on fly, simply run `fly launch` and then `fly deploy`; you may also want to run `fly scale memory 512` to scale up the fly vm memory for this app. (TODO - fly secrets)

## Refs
- https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
- https://js.langchain.com/docs/modules/models/llms/integrations#replicate
- https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa

