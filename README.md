# Open Mind

Open source self deployable knowledge base with AI powered search and chat.

Names
- brainhub
- openmind
- openbrain
- newbrain
- anotherbrain
- thirdbrain
- brainx
- memory
- openmind.site	

keywords
- mind
- brain
- 
- knowledge
- memory
- info
- doc, link, too narrow
- 
- ama
- 
- open
- base
- hub
- x
- hunt


What problem does this project solve?

- I want to have a knowledge base that I can search with AI
- I want to self deploy the knowledge base

## competitors
https://www.privategpt.io/

### Stack

Auth: Clerk
App logic: next.js
VectorDB: Pinecone
LLM Orchestration: Langchain.js
Models + inference: Replicate
Deployment: Fly

chatbase/chatpdf


## Operations:
### 1. Init a nextjs app https://nextjs.org/docs/getting-started/installation
### 2. Signup and create app on https://clerk.com. Steps to use in nextjs: https://clerk.com/docs/nextjs/get-started-with-nextjs
### 3. Signup on fly and deploy app: https://fly.io/docs/languages-and-frameworks/nextjs/ 
### 4. Install langchain.js: https://js.langchain.com/docs/getting-started/install
### 5. https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone
### 6. https://js.langchain.com/docs/modules/models/llms/integrations#replicate


## How does the chat feature work
1. Get content from a link (puppeteer)
2. Split content to smaller chunks if necessary
2. Compute the embeddings of the content
3. Store the embeddings in Pinecone

Q&A example: https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa

