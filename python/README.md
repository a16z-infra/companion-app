# AI Companion App - Python

The following instructions should get you up and running with a fully functional, deployed version of your AI
companions.

It currently contains a companion connected to ChatGPT that can run Tools such as Image Generation and Video Generation.
The companions also have to option to return voice messages via [ElevenLabs]()

## Quick start

### 1. Set up your environment

```commandline
pip install -r requirements.txt
```

### 2. Authenticate with steamship

```commandline
ship login
```

### 3. Initialize your companions

```commandline
python init_companions.py
```

This will read the companion descriptions in the `companions` folder and create instances for them.
The front-end will be calling these instances after deployment.
Make sure to override the companions.json file in the final step of the script.

### 4. Fill out secrets

```
cp .env.local.example .env.local
```

Secrets mentioned below will need to be copied to `.env.local`

**Note:** By default you can stick to using Steamship as a provider for your memory (short-term and long-term), llms,
and hosting.

a. **Clerk Secrets**

Go to https://dashboard.clerk.com/ -> "Add Application" -> Fill in Application name/select how your users should sign in
-> Create Application
Now you should see both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` on the screen
<img width="1398" alt="Screen Shot 2023-07-10 at 11 04 57 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/449c40f1-2fc2-48bb-88e1-d2adf10a034e">

If you want to text your AI companion in later steps, you should also enable "phone number" under "User &
Authentication" -> "Email, Phone, Username" on the left hand side nav:

<img width="1013" alt="Screen Shot 2023-07-10 at 11 05 42 PM" src="https://github.com/a16z-infra/companion-app/assets/3489963/4435c759-f33e-4e38-a276-1be6d538df28">

b. **Steamship API key**

- Sign in to [Steamship](https://www.steamship.com/account/api)
- Copy the API key from your account settings page
- Add it as the `STEAMSHIP_API_KEY` variable

### 5. Install front-end dependencies

```
cd companion-app
npm install
```

### 6. Run app locally

Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

You can connect to the project with your browser typically at http://localhost:3000/.

## Stack

The stack is based on the [AI Getting Started Stack](https://github.com/a16z-infra/ai-getting-started):

- VectorDB: [Steamship](https://www.steamship.com/)
- LLM orchestration: [Langchain](https://langchain.com/docs/)
- Text model: [OpenAI](https://platform.openai.com/docs/models)
- Conversation history: [Steamship](https://www.steamship.com/)
- Deployment: [Steamship](https://www.steamship.com/)
- Text with companion: [Telegram](https://telegram.org/)

## Upgrades

### Modifying your companion logic

You can modify your companion by editing the `src/api.py`. Here are a few interesting ideas:

* Add tools
* Modify the logic of your agent
* Add endpoints
* Add webhooks

This is a separate step from adding personality and backstory -- those are done elsewhere.

### Connecting to Telegram

You can connect your chatbot to Telegram by providing a bot
token. [This guide](https://github.com/steamship-packages/langchain-production-starter/blob/f51a3ecc8a15ced84dca5845fd1a18bc3f015418/docs/register-telegram-bot.md)
will show you how. will show you how.