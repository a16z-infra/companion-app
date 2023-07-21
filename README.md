# AI Companion App (based on AI Getting Started template)

[Live Demo](https://ai-companion-stack.com/)

[Join our community Discord: AI Stack Devs](https://discord.gg/PQUmTBTGmT)

![App Screenshot](https://github.com/a16z-infra/companion-app/assets/3489963/e4cc8042-e091-4c8b-851f-e361ca5b5814)

Welcome to the AI Companion App, a tutorial stack that allows you to create and host AI companions that you can chat with on a browser or via text messages (SMS). This platform empowers you to shape the personality and backstory of your companion, leveraging a vector database for similarity-based conversations and a conversation queue for memory retention.

Currently, our platform features companions powered by both ChatGPT and Vicuna, hosted on [Replicate](https://replicate.com/). You can use these companions for various purposes, including romantic relationships, friendships, entertainment, coaching, and more. With the flexibility to craft backstories and select the AI model, you can guide your companion towards your ideal use case.

**Note:** This project serves as a developer tutorial and starter stack for those interested in building chatbots. For a production-ready open-source platform, check out [Steamship](https://www.steamship.com/). If you're interested in exploring leading AI chat platforms, take a look at [Character.ai](https://beta.character.ai/).

## Overview

- 💻 [Stack](#stack)
- 🧠 [Quickstart](#quickstart)
- 🚀 [How does this work?](#how-does-this-work)
- 👤 [Adding/modifying characters](#addingmodifying-characters)
- 👩‍💻 [How to contribute to this repo](#how-to-contribute-to-this-repo)
- 🐍 [Python support](#python-support)
- 💽 [Exporting your companion to Character.ai](#export-to-characterai)

## Stack

The AI Companion App is built on the [AI Getting Started Stack](https://github.com/a16z-infra/ai-getting-started) and utilizes various technologies for different functionalities:

- Authentication: [Clerk](https://clerk.com/)
- Application Logic: [Next.js](https://nextjs.org/)
- Vector Database: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- LLM Orchestration: [Langchain.js](https://js.langchain.com/docs/)
- Text Models: [OpenAI](https://platform.openai.com/docs/models), [Replicate (Vicuna13b)](https://replicate.com/replicate/vicuna-13b)
- Text Streaming: [AI SDK](https://github.com/vercel-labs/ai)
- Conversation History: [Upstash](https://upstash.com/)
- Deployment: [Fly](https://fly.io/)
- Text with Companion: [Twilio](https://twilio.com/)

## Quickstart

Let's get you up and running with four AIs you can chat with locally. Please note that companions running on Vicuna (Rosie and Lucky) may take some time to respond due to the cold start problem. So, a bit of patience may be required :)

### 1. Fork and Clone the Repo

To get started, fork the repository to your Github account and clone it locally using the following command:

```bash
git clone git@github.com:[YOUR_GITHUB_ACCOUNT_NAME]/companion-app.git
```

Alternatively, if you're using Github Codespaces, you can launch the app quickly by clicking on "Code" -> "Codespaces" -> "+"

If you opt for Codespaces, npm dependencies will be installed automatically, and you can proceed to step 3.

### 2. Install Dependencies

Next, navigate to the cloned directory:

```bash
cd companion-app
npm install
```

### 3. Fill out Secrets

Copy the example environment file and fill in the required secrets:

```bash
cp .env.local.example .env.local
```

The following secrets need to be added:

a. **Clerk Secrets**

- Go to https://dashboard.clerk.com/ and create a new application, providing an application name and specifying how users should sign in.
- Retrieve the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from the dashboard.

If you wish to text your AI companion later, enable "phone number" under "User & Authentication" -> "Email, Phone, Username" in the Clerk dashboard.

b. **OpenAI API key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key if you're using OpenAI for your language model.

c. **Replicate API key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key if you're using Vicuna for your language model.

❗ **_NOTE:_** By default, this template uses Pinecone as the vector store. However, you can switch to Supabase pgvector by uncommenting `VECTOR_DB=supabase` in `.env.local`. In that case, you will need either a Pinecone API key or a Supabase API key.

d. **Pinecone API key**

- Create a Pinecone index by visiting https://app.pinecone.io/ and clicking on "Create Index."
- Provide a name for the index (`PINECONE_INDEX`), set the dimension as `1536`, and create the index.
- Under "API Keys," create an API key and copy the "Environment" value to `PINECONE_ENVIRONMENT` and the "Value" to `PINECONE_API_KEY`.

e. **Upstash API key**

- Sign in to [Upstash](https://upstash.com/).
- Under "Redis" on the top nav, click on "Create Database," and configure your database.
- Retrieve the REST API environment variables and paste them in `.env.local`.

e. **Supabase API key** (optional)

If you prefer to use Supabase, uncomment `VECTOR_DB=supabase` and provide the Supabase credentials in `.env.local`.

- Create a Supabase instance [here](https://supabase.com/dashboard/projects) and go to Project Settings -> API.
- Set `SUPABASE_URL` to the URL value under "Project URL" and `SUPABASE_PRIVATE_KEY` to the key starting with `ey` under Project API Keys.
- Enable pgvector on Supabase and create a schema by clicking on "SQL editor" in the Supabase UI and then clicking on "+New Query." Copy-paste [this code snippet](https://github.com/a16z-infra/ai-getting-started/blob/main/pgvector.sql) into the SQL editor and click "Run."

### 4. Generate Embeddings

The `companions/` directory contains personality descriptions for the AIs in .txt files. To generate embeddings and load them into the vector database for conversations, run the following command:

#### If using Pinecone

```bash
npm run generate-embeddings-pinecone
```

#### If using Supabase pgvector

```bash
npm

 run generate-embeddings-supabase
```

### 5. Run the App Locally

Now you are ready to test out the app locally! Simply run the following command in the project root:

```bash
npm run dev
```

You can access the app through your browser at http://localhost:3000/.

### 6. Additional Feature: Text Your Companions

You can assign a phone number to the character you are talking to and retain the full conversational history and context when texting them. Any user can only start texting the AI companion after verifying their phone number on Clerk. To enable texting, follow these steps:

a. Create a Twilio account.

b. Once you have an account, create a Twilio phone number.

c. On [Twilio dashboard](https://console.twilio.com/), retrieve the "Account SID" value as `TWILIO_ACCOUNT_SID` and the "Auth Token" as `TWILIO_AUTH_TOKEN` in `.env.local`.

d. If you're running the app locally, use [ngrok](https://ngrok.com/docs/getting-started/#step-2-install-the-ngrok-agent) to generate a public URL that forwards requests to your localhost.

e. On Twilio's UI, click on "# Phone Numbers" -> "Manage" -> "[Active numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)" on the left-hand side nav.

f. Click on the phone number you just created, scroll down to "Messaging Configuration" and enter `[your_app_url]/api/text` in the "A message comes in" section under "Webhook."

g. Add your Twilio phone number in `companions.json` under the companion you want to text with. Make sure to include the area code when adding the phone number (e.g., "+14050000000" instead of "4050000000").

h. Now you can text the Twilio phone number from your phone and get a response from your companion.

### 7. Deploy the App

#### Deploy to fly.io

- Register an account on fly.io and [install flyctl](https://fly.io/docs/hands-on/install-flyctl/).
- If you're using Github Codespaces, [install flyctl](https://fly.io/docs/hands-on/install-flyctl/) and authenticate from your Codespaces CLI by running `fly auth login`.

- Run `fly launch` in the project root. This will generate a `fly.toml` file with all the necessary configurations.
- Scale up the fly VM memory for this app by running `fly scale memory 512`.
- Deploy the app by running `fly deploy --ha=false`. The `--ha` flag ensures that fly only spins up one instance, which is included in the free plan.
- For any other non-localhost environment, the existing Clerk development instance should continue to work. You can upload the secrets to Fly by running `cat .env.local | fly secrets import`.
- For production deployment, create a prod environment under the [current Clerk instance](https://dashboard.clerk.com/). For more details on deploying a production app with Clerk, refer to their documentation [here](https://clerk.com/docs/deployments/overview). Note that you may need to manage your own domain and perform domain verification as part of the process.
- Create a new file `.env.prod` locally and fill in all the production-environment secrets. Remember to update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` by copying the secrets from Clerk's production instance - `cat .env.prod | fly secrets import` to upload the secrets.

## How Does This Work?

1. Describe the character's background story, name, etc. in a README.md file (e.g., [charactername].md). This information, along with the AI model you select, will shape your companion's responses.

2. Pick the language model that will power your companion's dialogue. This project supports OpenAI and Vicuna (an open-source model). OpenAI offers faster responses, while Vicuna is less censored and more dynamic, often used for romantic chatbots.

3. Create embeddings based on the content in the [charactername].md file (more details in [Generate embeddings](#4-generate-embeddings)).

4. Engage in a conversation with your AI companion!

## Adding/Modifying Characters

All character data is stored in the `companions/` directory. To add a companion, simply add a description to the list in `companions.json`. You can control the model used in the "llm" section - use "chatgpt" for OpenAI or "vicuna13b" for Vicuna. Put image files in `public/` in the root directory. Each character should have its text file named `charactername.txt`. The format of the text file is as follows:

```
The character's core description that is included with every prompt, and it should only
be a few sentences.

###ENDPREAMBLE###

Human: Say something here
Character name: Write a response in their voice
Human: Maybe another exchange
Character: More character dialog

###ENDSEEDCHAT###

Paragraphs of character backstory.

You can add as many as you want - they'll be stored in the vectordb
```

The **preamble** is used with every prompt, so it should be relatively short. The **seedchat** section allows you to provide examples of the character's voice that the model can learn from. The rest of the file contains additional background information that will be retrieved if relevant to the

current conversation.

## Shortcomings

There are some known shortcomings with this project:

- The UI currently shows only the current chat and response, losing the history.
- Vicuna has a cold start problem and may take a couple of minutes to get an initial response.
- Error reporting is limited, especially when deployed, and may fail silently in case of a timeout or other backend issues.
- The Upstash message history is never cleared. To clear it, you have to go to Upstash and manually delete the history.

## How to Contribute to This Repo

### Code Contribution Workflow

If you wish to contribute code, you can fork this repo, make changes, and create a pull request (PR). Add **@ykhli or @timqian** as reviewers.

If you're new to contributing on GitHub, follow these steps:

1. Click on `Fork` on the top right of this page.
2. Work on your change and push it to your forked repo. Now when you navigate to the forked repo's UI, you should see something like the following:
   <img width="904" alt="pr-preview" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/631e5f45-39ec-4b54-b9d1-b963e279dcc6">

3. Click on "Contribute" -> "Open Pull Request."
4. Once you have a PR, you can add reviewers.

### Other Contributions

Feel free to open feature requests, bug reports, etc., under Issues.

## Python Support

[appenz](https://github.com/appenz) has contributed to a Python implementation for the companion app [here](https://github.com/a16z-infra/companion-app/tree/python-local/python), providing an option to run a local Python app and talk to AI companions via the command line. The Python side will continue to be improved over time and aim for feature parity with the TypeScript implementation.

## Export to Character.ai

If you have tried out the Quickstart above, you probably know that we have only scratched the surface of what's possible in the realm of companion creation and customization. For those interested in more advanced features, we've added an option to export your companion to Character.ai.

To get started, run the following command:

```bash
npm run export-to-character [COMPANION_NAME] [MODEL_NAME] [USER_ID]
```

- `COMPANION_NAME`: the name of your companion, e.g., "Alice."
- `MODEL_NAME`: use "chatgpt" or "vicuna13b."
- `USER_ID`: you can find this on Clerk, under "Users" -> click on your user -> copy "User ID."

Once you run this script, two files will be created in the root directory:

- `[COMPANION_NAME]_chat_history.txt`: This file contains all of the chat history stored in Upstash.
- `[COMPANION_NAME_]_character_ai_data.txt`: This file provides the data needed to re-create the companion on Character.ai. You can find Character.ai character configurations under "View Character Settings" on any newly-created characters.

## References

- [Langchain.js Pinecone Integration](https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone)
- [Langchain.js LLM Replicate Integration](https://js.langchain.com/docs/modules/models/llms/integrations#replicate)
- [Langchain.js Retrieval QA](https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa)

II. Review of the Existing README File

A. The original README file provided a detailed tutorial and overview of the AI Companion App. The content is well-organized and easy to follow.

B. There are a few minor improvements that can be made to enhance clarity and readability.

III. Organizational Structure

A. The existing organizational structure is already well-defined and provides clear sections for different aspects of the AI Companion App.

B. No changes are needed in this regard.

IV. Introduction Section

A. The introduction section effectively explains the purpose of the project as a tutorial stack for creating AI companions.

B. No changes are needed in this section.

V. Detailed Description Section

A. The detailed description section provides a comprehensive overview of the project, explaining its functionalities, stack components, and potential use cases.

B. Minor improvements can be made in sentence structures to enhance readability. For example, instead of "The stack is based on the AI Getting Started Stack," it can be rephrased as "The stack is built upon the AI Getting Started Stack."

VI. Quickstart Section

A. The quickstart section provides step-by-step instructions to set up the AI Companion App locally.

B. Some reordering of the steps and additional sub-sections can make it easier to follow. For example, the "Join our community Discord: AI Stack Devs" link can be moved to a separate section for "Community Support."

VII. Export to Character.ai Section

A. The "Export to Character.ai" section provides a useful feature for more advanced users to export companions to Character.ai.

B. It could benefit from a clearer explanation of what Character.ai is and why users might want to export their companions there.

VIII. Additional Feature: Text Your Companions

A. This section explains how to enable texting with AI companions through Twilio.

B. It could include some example conversations to demonstrate how the feature works.

IX. How Does This Work? Section

A. This section outlines the process of creating AI companions and the role of the language model.

B. No significant changes are needed in this section.

X. Adding/Modifying Characters Section

A. This section explains how to add and modify character data, providing clear instructions.

B. No changes are needed in this section.

XI. Shortcomings Section

A. The "Shortcomings" section honestly lists some limitations of the project.

B. It could include suggestions or potential improvements to address these shortcomings.

XII. How to Contribute to This Repo Section

A. This section explains the process of contributing to the project.

B. No changes are needed in this section.

XIII. Python Support Section

A. The "Python Support" section informs users of an alternative Python implementation for the companion app.

B. No changes are needed in this section.

XIV. Refs Section

A. The "Refs" section provides references to relevant documentation.

B. It could benefit from reformatting to make it more visually organized.

XV. Updated README File

Below is the updated version of the README file:

````markdown
# AI Companion App (Based on AI Getting Started Template)

[Live Demo](https://ai-companion-stack.com/)

## Table of Contents

1. [Introduction](#introduction)
2. [Detailed Description](#detailed-description)
3. [Quickstart](#quickstart)
4. [Export to Character.ai](#export-to-characterai)
5. [Additional Feature: Text Your Companions](#additional-feature-text-your-companions)
6. [How Does This Work?](#how-does-this-work)
7. [Adding/Modifying Characters](#addingmodifying-characters)
8. [Shortcomings](#shortcomings)
9. [How to Contribute to This Repo](#how-to-contribute-to-this-repo)
10. [Python

Support](#python-support) 11. [References](#references)

## Introduction

Welcome to the AI Companion App, a tutorial stack that enables you to create and host AI companions you can chat with on a browser or via text messages (SMS). This platform empowers you to shape the personality and backstory of your companion, leveraging a vector database for similarity-based conversations and a conversation queue for memory retention.

## Detailed Description

The AI Companion App is built on the [AI Getting Started Stack](https://github.com/a16z-infra/ai-getting-started) and utilizes various technologies for different functionalities:

- Authentication: [Clerk](https://clerk.com/)
- Application Logic: [Next.js](https://nextjs.org/)
- Vector Database: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- LLM Orchestration: [Langchain.js](https://js.langchain.com/docs/)
- Text Models: [OpenAI](https://platform.openai.com/docs/models), [Replicate (Vicuna13b)](https://replicate.com/replicate/vicuna-13b)
- Text Streaming: [AI SDK](https://github.com/vercel-labs/ai)
- Conversation History: [Upstash](https://upstash.com/)
- Deployment: [Fly](https://fly.io/)
- Text with Companion: [Twilio](https://twilio.com/)

## Quickstart

Let's get you up and running with four AI companions you can chat with locally. Please note that companions running on Vicuna (Rosie and Lucky) may take some time to respond due to the cold start problem. So, a bit of patience may be required :)

### 1. Fork and Clone the Repo

To get started, fork the repository to your Github account and clone it locally using the following command:

```bash
git clone git@github.com:[YOUR_GITHUB_ACCOUNT_NAME]/companion-app.git
```
````

Alternatively, if you're using Github Codespaces, you can launch the app quickly by clicking on "Code" -> "Codespaces" -> "+"

If you opt for Codespaces, npm dependencies will be installed automatically, and you can proceed to step 3.

### 2. Install Dependencies

Next, navigate to the cloned directory:

```bash
cd companion-app
npm install
```

### 3. Fill Out Secrets

Copy the example environment file and fill in the required secrets:

```bash
cp .env.local.example .env.local
```

The following secrets need to be added:

a. **Clerk Secrets**

- Go to https://dashboard.clerk.com/ and create a new application, providing an application name and specifying how users should sign in.
- Retrieve the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from the dashboard.

If you wish to text your AI companion later, enable "phone number" under "User & Authentication" -> "Email, Phone, Username" in the Clerk dashboard.

b. **OpenAI API Key**

Visit https://platform.openai.com/account/api-keys to get your OpenAI API key if you're using OpenAI for your language model.

c. **Replicate API Key**

Visit https://replicate.com/account/api-tokens to get your Replicate API key if you're using Vicuna for your language model.

❗ **_NOTE:_** By default, this template uses Pinecone as the vector store. However, you can switch to Supabase pgvector by uncommenting `VECTOR_DB=supabase` in `.env.local`. In that case, you will need either a Pinecone API key or a Supabase API key.

d. **Pinecone API Key**

- Create a Pinecone index by visiting https://app.pinecone.io/ and clicking on "Create Index."
- Provide a name for the index (`PINECONE_INDEX`), set the dimension as `1536`, and create the index.
- Under "API Keys," create an API key and copy the "Environment" value to `PINECONE_ENVIRONMENT` and the "Value" to `PINECONE_API_KEY`.

e. **Upstash API Key**

- Sign in to [Upstash](https://upstash.com/).
- Under "Redis" on the top nav, click on "Create Database," and configure your database.
- Retrieve the REST API environment variables and paste them in `.env.local`.

e. **Supabase API Key** (optional)

If you prefer to use Supabase, uncomment `VECTOR_DB=supabase` and provide the Supabase credentials in `.env.local`.

- Create a Supabase instance [here](https://supabase.com/dashboard/projects) and go to Project Settings -> API.
- Set `SUPABASE_URL` to the URL value under "Project URL" and `SUPABASE_PRIVATE_KEY` to the key starting with `ey` under Project API Keys.
- Enable pgvector on Supabase and create a schema by clicking on "SQL editor" in the Supabase UI and then clicking on "+New Query." Copy-paste [this code snippet](https://github.com/a16z-infra/ai-getting-started/blob/main/pgvector.sql) into the SQL editor and click "Run."

### 4. Generate Embeddings

The `companions/` directory contains personality descriptions for the AIs in .txt files. To generate embeddings and load them into the vector database for conversations, run the following command:

#### If using Pinecone

```bash
npm run generate-embeddings-pinecone
```

#### If using Supabase pgvector

```bash
npm run generate-embeddings-supabase
```

### 5. Run the App Locally

Now you are ready to test out the app locally! Simply run the following command in the project root:

```bash
npm run dev
```

You can access the app through your browser at http://localhost:3000/.

### 6. Additional Feature: Text Your Companions

You can assign a phone number to the character you are talking to and retain the full conversational history and context when texting them. Any user can only start texting the AI companion after verifying their phone number on Clerk. To enable texting, follow these steps:

a. Create a Twilio account.

b. Once you have an account, create a Twilio phone number.

c. On [Twilio dashboard](https://console.twilio.com/), retrieve the "Account SID" value as `TWILIO_ACCOUNT_SID` and the "Auth Token" as `TWILIO_AUTH_TOKEN` in `.env.local`.

d. If you're running the app locally, use [ngrok](https://ngrok.com/docs/getting-started/#step-2-install-the-ngrok-agent) to generate a public URL that forwards requests to your localhost.

e. On Twilio's UI, click on "# Phone Numbers" -> "Manage" -> "[Active numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)" on the left-hand side nav.

f. Click on the phone number you just created, scroll down to "Messaging Configuration" and enter `[your_app_url]/api/text` in the "A message comes in"

section under "Webhook."

g. Add your Twilio phone number in `companions.json` under the companion you want to text with. Make sure to include the area code when adding the phone number (e.g., "+14050000000" instead of "4050000000").

h. Now you can text the Twilio phone number from your phone and get a response from your companion.

### 7. How Does This Work?

The AI Companion App works as follows:

1. Describe the character's background story, name, etc. in a README.md file (e.g., [charactername].md). This information, along with the AI model you select, will shape your companion's responses.

2. Pick the language model that will power your companion's dialogue. This project supports OpenAI and Vicuna (an open-source model). OpenAI offers faster responses, while Vicuna is less censored and more dynamic, often used for romantic chatbots.

3. Create embeddings based on the content in the [charactername].md file (more details in [Generate embeddings](#4-generate-embeddings)).

4. Engage in a conversation with your AI companion!

## Adding/Modifying Characters

All character data is stored in the `companions/` directory. To add a companion, simply add a description to the list in `companions.json`. You can control the model used in the "llm" section - use "chatgpt" for OpenAI or "vicuna13b" for Vicuna. Put image files in `public/` in the root directory. Each character should have its text file named `charactername.txt`. The format of the text file is as follows:

```
The character's core description that is included with every prompt, and it should only
be a few sentences.

###ENDPREAMBLE###

Human: Say something here
Character name: Write a response in their voice
Human: Maybe another exchange
Character: More character dialog

###ENDSEEDCHAT###

Paragraphs of character backstory.

You can add as many as you want - they'll be stored in the vectordb
```

The **preamble** is used with every prompt, so it should be relatively short. The **seedchat** section allows you to provide examples of the character's voice that the model can learn from. The rest of the file contains additional background information that will be retrieved if relevant to the current conversation.

## Shortcomings

There are some known shortcomings with this project:

- The UI currently shows only the current chat and response, losing the history.
- Vicuna has a cold start problem and may take a couple of minutes to get an initial response.
- Error reporting is limited, especially when deployed, and may fail silently in case of a timeout or other backend issues.
- The Upstash message history is never cleared. To clear it, you have to go to Upstash and manually delete the history.

## How to Contribute to This Repo

### Code Contribution Workflow

If you wish to contribute code, you can fork this repo, make changes, and create a pull request (PR). Add **@ykhli or @timqian** as reviewers.

If you're new to contributing on GitHub, follow these steps:

1. Click on `Fork` on the top right of this page.
2. Work on your change and push it to your forked repo. Now when you navigate to the forked repo's UI, you should see something like the following:
   <img width="904" alt="pr-preview" src="https://github.com/a16z-infra/ai-getting-started/assets/3489963/631e5f45-39ec-4b54-b9d1-b963e279dcc6">

3. Click on "Contribute" -> "Open Pull Request."
4. Once you have a PR, you can add reviewers.

### Other Contributions

Feel free to open feature requests, bug reports, etc., under Issues.

## Python Support

[appenz](https://github.com/appenz) has contributed to a Python implementation for the companion app [here](https://github.com/a16z-infra/companion-app/tree/python-local/python), providing an option to run a local Python app and talk to AI companions via the command line. The Python side will continue to be improved over time and aim for feature parity with the TypeScript implementation.

## Export to Character.ai

If you have tried out the Quickstart above, you probably know that we have only scratched the surface of what's possible in the realm of companion creation and customization. For those interested in more advanced features, we've added an option to export your companion to Character.ai.

To get started, run the following command:

```bash
npm run export-to-character [COMPANION_NAME] [MODEL_NAME] [USER_ID]
```

- `COMPANION_NAME`: the name of your companion, e.g., "Alice."
- `MODEL_NAME`: use "chatgpt" or "vicuna13b."
- `USER_ID`: you can find this on Clerk, under "Users" -> click on your user -> copy "User ID."

Once you run this script, two files will be created in the root directory:

- `[COMPANION_NAME]_chat_history.txt`: This file contains all of the chat history stored in Upstash.
- `[COMPANION_NAME_]_character_ai_data.txt`: This file provides the data needed to re-create the companion on Character.ai. You can find Character.ai character configurations under "View Character Settings" on any newly-created characters.

## References

- [Langchain.js Pinecone Integration](https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/pinecone)
- [Langchain.js LLM Replicate Integration](https://js.langchain.com/docs/modules/models/llms/integrations#replicate)
- [Langchain.js Retrieval QA](https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa)
