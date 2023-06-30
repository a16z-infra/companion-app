#
# Class that represents a companion
#

class Companion:

    # Constructor for the class, takes a JSON object as an input
    def __init__(self, cdata):
        self.name = cdata["name"]
        self.title = cdata["title"]
        self.imagePath = cdata["imageUrl"]
        self.llm_name = cdata["llm"]

    def load_backstory(self, file_path):
        # Load backstory
        with open(file_path , 'r', encoding='utf-8') as file:
            data = file.read()
            self.preamble, rest = data.split('###ENDPREAMBLE###', 1)
            self.seed_chat, _ = rest.split('###ENDSEEDCHAT###', 1)
        return len(self.preamble) + len(self.seed_chat)
    
    def __str__(self):
        return f'Companion: {self.name}, {self.title} (using {self.llm_name})'

