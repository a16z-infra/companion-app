# AI Companion App (based on AI Getting Started template)

[Live Demo](https://ai-companion-stack.com/)

[Join our community Discord: AI Stack Devs](https://discord.gg/PQUmTBTGmT)

![Screenshot](https://github.com/a16z-infra/companion-app/assets/3489963/e4cc8042-e091-4c8b-851f-e361ca5b5814)

The AI Companion App is a tutorial stack that allows you to create and host AI companions that you can chat with on a browser or via SMS text. It provides the ability to define the personality and backstory of your companion and utilizes a vector database with similarity search for more in-depth conversations. The app also includes conversational memory by keeping the conversation history in a queue and incorporating it into the prompts.

The app currently features companions powered by both ChatGPT and Vicuna models hosted on [Replicate](https://replicate.com/).

There are various use cases for these companions, including romantic relationships (AI girlfriends/boyfriends), friendship, entertainment, coaching, and more. You can guide your companion to suit your desired use case by providing a backstory and choosing the appropriate model.

**Note:** This project is intended as a developer tutorial and starter stack for understanding how chatbots are built. For a production open-source platform, check out [Steamship](https://www.steamship.com/). For leading AI chat platforms, see [Character.ai](https://beta.character.ai/).

## Overview

- 💻 [Stack](#stack)
- 🧠 [Quickstart](#quickstart)
- 🚀 [How does this work?](#how-does-this-work)
- 👤 [Adding/modifying characters](#addingmodifying-characters)
- 👩‍💻 [How to contribute to this repo](#how-to-contribute-to-this-repo)
- 🐍 [Python support](#python-support)
- 💽 [Exporting your companion to Character.ai](#export-to-characterai)

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

The following instructions will guide you in setting up a local deployment of the AI Companion App with four AI companions that you can chat with. Please note that companions running on Vicuna (Rosie and Lucky) may take some time to respond due to the cold start problem.

### 1. Fork and Clone repo

Start by forking the repo to your GitHub account, and then clone the repo using the following command:

git clone git@github.com:[YOUR_GITHUB_ACCOUNT_NAME]/companion-app.git

Alternatively, you can launch the app quickly through Github Codespaces by clicking on "Code" -> "Codespaces" -> "+"

### 2. Install dependencies

Navigate to the `companion-app` directory and install the required dependencies:

cd companion-app
npm install

### 3. Fill out secrets

Copy the example environment file and fill in the necessary secrets:

cp .env.local.example .env.local

The secrets you need to fill in are mentioned in the file `.env.local`.

a. **Clerk Secrets**

To obtain Clerk secrets, go to https://dashboard.clerk.com/, click on "Add Application," and fill in the application details. Once created, you will see the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` values on the screen.

b. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key if you're using OpenAI for your language model.

c. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key if you're using Vicuna for your language model.

d. **Pinecone API key**

Create a Pinecone index by visiting https://app.pinecone.io/. After creating the index, click on "API Keys" on the left side navigation and create an API key. Copy the "Environment" value to `PINECONE_ENVIRONMENT` and the "Value" to `PINECONE_API_KEY` in `.env.local`.

e. **Upstash API key**

Sign in to [Upstash](https://upstash.com/), create a new database under "Redis," and copy the corresponding environment variables to `.env.local`.

f. **Supabase API key** (optional)

If you prefer to use Supabase instead of Pinecone, uncomment `VECTOR_DB=supabase` in `.env.local` and fill out the Supabase credentials.

### 4. Generate embeddings

To generate embeddings for the companion's content and load them into the vector database, run the following command:

#### If using Pinecone

```bash
npm run generate-embeddings-pinecone

If using Supabase pgvector

npm run generate-embeddings-supabase

5. Run the app locally

You are now ready to test the app locally. Run the following command:

npm run dev

You can access the app through your browser at http://localhost:3000/.

6. Additional feature: Text your companions
You can assign a phone number to the character you are chatting with and retain the full conversation history and context via SMS. To set this up, you need to follow these steps:

a. Create a Twilio account.

b. Create a Twilio phone number.

c. Copy the "Account SID" value as TWILIO_ACCOUNT_SID and the "Auth Token" as TWILIO_AUTH_TOKEN in .env.local.

d. [Optional] If you are running the app locally, use ngrok to generate a public URL that can forward requests to your localhost.

e. On the Twilio dashboard, go to the phone number you created and set the webhook for "A message comes in" to [your_app_url]/api/text.

f. Add the Twilio phone number in companions.json under the companion you want to chat with. Make sure to include the area code when adding the phone number (e.g., "+14050000000" instead of "4050000000").

g. You can now text the Twilio phone number from your phone and receive a response from your companion.

7. Deploy the app
To deploy the app, follow these steps:

Deploy to fly.io
Register an account on fly.io and install flyctl.
Run fly launch in the project root directory to generate a fly.toml file with the necessary configurations.
Scale up the fly VM memory by running fly scale memory 512.
Deploy the app by running fly deploy --ha=false. The --ha flag ensures that only one instance is spun up, which is included in the free plan.
If you are using a non-localhost environment, upload the secrets to Fly by running cat .env.local | fly secrets import.
For production deployment, create a prod environment in the Clerk instance. Refer to the Clerk documentation for deploying a production app.
Create a new .env.prod file and fill in the production environment secrets. Then run cat .env.prod | fly secrets import to upload the secrets.
How does this work?
You describe the character's background story, name, etc. in a README.md file. For more information on the required format and content, refer to Adding/modifying characters.

Select the language model that will power your companion's dialogue. The app supports OpenAI and Vicuna models. OpenAI provides faster responses, while Vicuna is less censored and offers more dynamic interactions (often used for romantic chatbots).

Create embeddings based on the content in the companion's .txt file. Refer to Generate embeddings for instructions.

Start a conversation with your AI companion by asking questions and chatting with them!

Adding/modifying characters
All character data is stored in the companions/ directory. To add a companion, simply add a description to the list in companions.json. You can specify the model to be used in the "llm" section (use "chatgpt" for OpenAI or "vicuna13b" for Vicuna). Place image files in the public/ directory in the root of the project. Each character should have their own .txt file named charactername.txt. The format of the text file is as follows:

The character's core description that is included with every prompt, limited to a few sentences.

###ENDPREAMBLE###

Human: Say something here
Character name: Write a response in their voice
Human: Maybe another exchange
Character: More character dialog

###ENDSEEDCHAT###

Paragraphs of character backstory.

You can add as many paragraphs as you want, and they will be stored in the vector database.

The preamble is a short description included with every prompt. The seedchat allows you to provide examples of the character's voice for the model to learn from. The rest of the file can include any additional background information relevant to the conversation.

Shortcomings
Some limitations of the app include:

The UI only shows the current chat and response, without retaining the history.
Vicuna may experience a cold start problem, resulting in longer response times for initial chats.
Error reporting can be inadequate, especially when deployed, as failures may occur silently.
The Upstash message history is never cleared; manual deletion is required.
How to contribute to this repo
Code contribution workflow
To contribute code changes, you can fork this repo, make your modifications, and create a pull request. Assign @ykhli or @timqian as reviewers.

If you are new to contributing on GitHub, follow these steps:

Click on "Fork" in the top right corner of this page.

Make your changes and push them to your forked repo. You should see something like this on your forked repo's UI:

https://github.com/a16z-infra/ai-getting-started/assets/3489963/631e5f45-39ec-4b54-b9d1-b963e279dcc6

Click on "Contribute" -> "Open Pull Request".

Once you have a pull request, you can add reviewers.

Other contributions
Feel free to open feature requests, bug reports, or any other relevant issues under "Issues".

Python Support
appenz has contributed a Python implementation for the companion app here. This allows you to run a local Python app and interact with your AI companions through the command line. The Python implementation will continue to evolve to match the TypeScript version's features.

Export to Character.ai
If you want to explore further customization options beyond what is offered in the app, you can easily export your companion to Character.ai. To do this, run the following command:

npm run export-to-character [COMPANION_NAME] [MODEL_NAME] [USER_ID]

COMPANION_NAME: The name of your companion, such as "Alice".
MODEL_NAME: Choose either chatgpt or vicuna13b.
USER_ID: You can find this on Clerk by going to "Users" -> click on your user -> copy the "User ID".
After running this command, you will find two files created in the root directory:

[COMPANION_NAME]_chat_history.txt: This file contains all the chat history stored in Upstash.
[COMPANION_NAME_]_character_ai_data.txt: This file provides the data required to recreate the companion on Character.ai. You can find Character.ai character configurations under "View Character Settings" for any newly-created characters.
References
Pinecone
Langchain.js
Langchain.js Retrieval QA
