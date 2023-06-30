#
#  API to OpenAI's ChatGPT via LangChain
#

from langchain import LLMChain
from langchain.chat_models import ChatOpenAI

class LlmManager:

    verbose = False

    def __init__(self, prompt_template):
        self.model = ChatOpenAI(model="gpt-3.5-turbo-16k")
        self.chain = LLMChain(llm=self.model, prompt=prompt_template, verbose=self.verbose)
        return