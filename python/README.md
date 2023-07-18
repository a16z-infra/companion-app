# AI Companion App - Python

The following instructions should get you up and running with a fully functional, deployed version of your AI
companions.

It currently contains a companion connected to ChatGPT that can run Tools such as Image Generation and Video Generation.
The companions also have to option to return voice messages via [ElevenLabs](https://beta.elevenlabs.io/)

## Quick start

### 1. Set up your environment

```commandline
pip install -r requirements.txt
```

### 2. Authenticate with Steamship

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

The front-end requires a few secrets to be filled before connecting to third-party services.

```
# Run in the Root directory of this repo
cp .env.local.example .env.local
```

Secrets mentioned below will need to be copied to `.env.local`

**Note:** By default you can stick to using Steamship as a provider for your memory (short-term and long-term), llms,
and hosting.

a. **Clerk Secrets**

Clerk is used to authorize users of your application. Without completing this setup, you will not be able to access your companions via the supplied frontend

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
# Run in the Root directory of this repo
npm install
```

### 6. Run app locally

Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

You can connect to the project with your browser typically at http://localhost:3000/.

## Stack

The AI companions are hosted on [Steamship](https://www.steamship.com/). You can personalize their personality 
by adding or changing your companions in the `companions` folder.