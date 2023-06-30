#
# Persistent memory for companions
#

import os
import json
import time

from upstash_redis.client import Redis

class MemoryManager:
    instance = None

    def __init__(self, companion_name, user_id, model_name):
        self.history = Redis.from_env()
        self.user_id = user_id
        self.companion_name = companion_name
        self.model_name = model_name

    def get_companion_key(self):
        return f"{self.model_name}-{self.companion_name}-{self.user_id}"

    async def write_to_history(self, text):
        if self.user_id is None:
            print("No user id")
            return ""

        key = self.get_companion_key()
        async with self.history:
            result = self.history.zadd(key, {text: int(time.time())})

        return result

    async def read_latest_history(self):
        if self.user_id is None:
            print("No user id")
            return ""

        key = self.get_companion_key()
        async with self.history:
            now = int(time.time()*1000)
            result = await self.history.zrange(key, 1, now, range_method="byscore")
            print(f'Found {len(result)} chat messages in history.')
        result = list(reversed(result[-30:]))
        recent_chats = "\n".join(result)
        return recent_chats

    async def seed_chat_history(self, seed_content, delimiter="\n"):
        key = self.get_companion_key()
        if self.history.exists(key):
            print("User already has chat history")
            return

        content = seed_content.split(delimiter)
        for index, line in enumerate(content):
            self.history.zadd(key, {line: index})
