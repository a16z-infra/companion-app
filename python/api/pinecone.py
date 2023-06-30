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
        # relevant_history = "\n".join(doc.page_content for doc in similar_docs)