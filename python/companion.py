#
# Class that represents a companion
#

import asyncio
from langchain import LLMChain, PromptTemplate

class Companion:

    # --- Prompt template ---

    prompt_template_str = """You are ${name} and are currently talking to ${user_name}.

    ${preamble}

    You reply with answers that range from one sentence to one paragraph and with some details. ${replyLimit}

    Below are relevant details about ${name}'s past:

    ${relevantHistory}
    
    Below is a relevant conversation history:

    ${recentChatHistory}"""

    # Constructor for the class, takes a JSON object as an input
    def __init__(self, cdata):
        self.name = cdata["name"]
        self.title = cdata["title"]
        self.imagePath = cdata["imageUrl"]
        self.llm_name = cdata["llm"]

    def load_prompt(self, file_path):
        # Load backstory
        with open(file_path , 'r', encoding='utf-8') as file:
            data = file.read()
            self.preamble, rest = data.split('###ENDPREAMBLE###', 1)
            self.seed_chat, _ = rest.split('###ENDSEEDCHAT###', 1)

        self.prompt_template = PromptTemplate.from_template(self.prompt_template_str)

        return len(self.preamble) + len(self.seed_chat)
    


    def __str__(self):
        return f'Companion: {self.name}, {self.title} (using {self.llm_name})'

    async def chat(self, user_input, user_name, max_reply_length=0):

        # Read chat history
        recent_chat_history = asyncio.run(self.memory.read_latest_history())

        #client = PineconeClient(api_key=os.getenv('PINECONE_API_KEY'),
        #                        environment=os.getenv('PINECONE_ENVIRONMENT'))
        #index_name = os.getenv('PINECONE_INDEX')
        #pinecone_index = client.get_index(index_name)

        # TODO: Implement PineconeStore and OpenAIEmbeddings in Python.
        # vector_store = PineconeStore.from_existing_index(
        #    OpenAIEmbeddings(api_key=os.getenv('OPENAI_API_KEY')),
        #    pinecone_index
        #)

        #try:
        #    similar_docs = vector_store.similarity_search(recent_chat_history, 3, file_name=companion_file_name)
        #except Exception as e:
        #    print(f"WARNING: failed to get vector search results. {str(e)}")
        #    similar_docs = []

        similar_docs = [self.backstory]
        relevant_history = "\n".join(doc.page_content for doc in similar_docs)

        # Create the prompt and invoke the LLM
        reply_limit = f'You reply within {max_reply_length} characters.' if max_reply_length else ""
        
            name=self.name, user_name=user_name, preamble=self.preamble, replyLimit=reply_limit,
            relevantHistory=relevant_history, recentChatHistory=recent_chat_history)
        
        print("Prompt:")
        print(chain_prompt)

        chain = LLMChain(llm=self.llm.model, prompt=self.prompt_template)

        try:
            result = await chain.call(relevant_history=relevant_history, recent_chat_history=recent_chat_history)
        except Exception as e:
            print(str(e))
            result = None

        print("result", result)
        
        self.memory.write_to_history(f"Human: {user_input}\n")
        self.memory.write_to_history(result.text + "\n")
        print("chatHistoryRecord", chat_history_record)

        if is_text:
            return jsonify(result.text)
        return web.StreamResponse(stream)