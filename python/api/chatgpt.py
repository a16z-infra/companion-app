#
#  API to OpenAI's ChatGPT via LangChain
#

import os
import json
import openai
import asyncio

class LlmManager:

    async def post(user_str):
        return