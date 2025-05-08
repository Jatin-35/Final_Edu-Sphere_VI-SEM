import cohere  # Import the Cohere library for AI service
from rich import print  # Import the rich library to enhance terminal output
from dotenv import dotenv_values  # Import dotenv to load environment variables from a .env file

# Load the environment variables from the .env file
env_vars = dotenv_values(".env")

# Retrieve API Key
CohereAPIKey = env_vars.get("CohereAPIKey")

# Check if the API key is loaded correctly, raise an error if not
if not CohereAPIKey:
    raise ValueError("Cohere API key not found in .env file. Please set 'CohereAPIKey' in the .env file.")

# Create a Cohere client using the API key
co = cohere.Client(api_key=CohereAPIKey)

# Define a list of recognized keyword functions for task categorization
funcs = [
    "lovely farewell", "general", "realtime", "system", "content", "google search"
]

# Initialize an empty list to store user messages
messages = []

# Define a preamble that guides the AI model on how to categorize queries
preamble = """
You are a very accurate Decision-Making Model, which decides what kind of a query is given to you.
You will decide whether a query is a 'general' query, or a 'realtime' query
-> Respond with 'general ( query )' if a query can be answered by a llm model (conversational ai chatbot) and doesn't require any up to date information like if the query is 'who was akbar?' respond with 'general who was akbar?', if the query is 'how can i study more effectively?' respond with 'general how can i study more effectively?', if the query is 'can you help me with this math problem?' respond with 'general can you help me with this math problem?', if the query is 'Thanks, i really liked it.' respond with 'general thanks, i really liked it.' , if the query is 'what is python programming language?' respond with 'general what is python programming language?', etc. Respond with 'general (query)' if a query doesn't have a proper noun or is incomplete like if the query is 'who is he?' respond with 'general who is he?', if the query is 'what's his networth?' respond with 'general what's his networth?', if the query is 'tell me more about him.' respond with 'general tell me more about him.', and so on even if it require up-to-date information to answer. Respond with 'general (query)' if the query is asking about time, day, date, month, year, etc like if the query is 'what's the time?' respond with 'general what's the time?'.
-> Respond with 'realtime ( query )' if a query can not be answered by a llm model (because they don't have realtime data) and requires up to date information like if the query is 'who is indian prime minister' respond with 'realtime who is indian prime minister', if the query is 'tell me about facebook's recent update.' respond with 'realtime tell me about facebook's recent update.', if the query is 'tell me news about coronavirus.' respond with 'realtime tell me news about coronavirus.', etc and if the query is asking about any individual or thing like if the query is 'who is akshay kumar' respond with 'realtime who is akshay kumar', if the query is 'what is today's news?' respond with 'realtime what is today's news?', if the query is 'what is today's headline?' respond with 'realtime what is today's headline?', etc.
-> Respond with 'content (topic)' if a query is asking to write any type of content like application, codes, emails or anything else about a specific topic but if the query is asking to write multiple types of content, respond with 'content 1st topic, content 2nd topic' and so on.
-> Respond with 'google search (topic)' if a query is asking to search a specific topic on google but if the query is asking to search multiple topics on google, respond with 'google search 1st topic, google search 2nd topic' and so on.
-> Respond with 'youtube search (topic)' if a query is asking to search a specific topic on youtube but if the query is asking to search multiple topics on youtube, respond with 'youtube search 1st topic, youtube search 2nd topic' and so on.
-> Respond with 'lovely farewell' like: “Aww, take care! Tinsi will miss you 🌸✨ Until next time! if the user says goodbye or tries to end the chat (e.g., “bye chatbot”, “see you”, “talk to you later”, "Bye Bye" , "Bye" etc.). ***
*** Respond with 'general (query)' if you can't decide the kind of query or if a query is asking to perform a task which is not mentioned above. ***
"""

# Define Chat History with predefined user-ChatBot interactions for context
ChatHistory = [
    {"role": "User", "message": "how are you?"},
    {"role": "ChatBot", "message": "general how are you?"},
    {"role": "User", "message": "Do you like pizza?"},
    {"role": "ChatBot", "message": "general Do you like pizza"},
    {"role": "User", "message": "open chrome and tell me about Mahatama Gandhi."},
    {"role": "ChatBot", "message": "open open, general tell me about Mahatama Gandhi."},
    {"role": "User", "message": "open chrome and firefox."},
    {"role": "ChatBot", "message": "open chrome, open firefox."},
    {"role": "User", "message": "what is today's date and by the way remind me that i have a dance performance on 5th aug at 11pm."},
    {"role": "ChatBot", "message": "general what is today's date , reminder 11:00pm 5th aug dancing performance."},
    {"role": "User", "message": "chat with me."},
    {"role": "ChatBot", "message": "general chat with me."},
    {"role": "User", "message": "Bye Bye."},
    {"role": "ChatBot", "message": "general Bye Bye."},
]

# Define main function for decision-making on queries
def FirstLayerDMM(prompt: str = "test"):
    # Add the user's query to the message list
    messages.append({"role": "User", "message": f"{prompt}"})
    
    # Combine preamble with the prompt as a workaround for older SDK versions
    full_message = f"{preamble}\n\nQuery: {prompt}"
    
    # Create a streaming chat session with the Cohere model
    stream = co.chat(
        model='command-r-plus',  # Specify the Cohere model to use
        message=full_message,  # Pass the combined preamble and user query
        temperature=0.7,  # Set the creativity level of the model
        chat_history=ChatHistory,  # Provide the pre-defined chat history for context
        prompt_truncation='OFF',  # Ensure the prompt is not truncated
        connectors=[],  # No additional connectors are used
        stream=True  # Enable streaming
    )
    
    # Initialize an empty string to store the generated responses
    response = ""
    
    # Iterate over the events in the stream and capture the text generation
    for event in stream:
        if hasattr(event, 'text'):  # Check if the event has a 'text' attribute (newer SDK)
            response += event.text  # Append generated text to the response
    
    # Remove newline characters and split responses into individual tasks
    response = response.replace("\n", "")
    response = response.split(",")
    
    # Strip leading and trailing whitespaces from each task
    response = [i.strip() for i in response]
    
    # Initialize an empty list to filter valid tasks
    temp = []
    
    # Filter the tasks based on recognized function keywords
    for task in response:
        for func in funcs:
            if task.startswith(func):
                temp.append(task)  # Add valid tasks to the filtered list
    
    # Update the response with the filtered list of tasks
    response = temp
    
    # If '(query)' is in the response, recursively call the function for further clarification
    if any("(query)" in task for task in response):
        newresponse = FirstLayerDMM(prompt=prompt)
        return newresponse  # Return the clarified response
    else:
        return response  # Return the filtered response

# Entry point for the script (for testing standalone)
if __name__ == "__main__":
    # Continuously prompt the user for input and process it
    while True:
        print(FirstLayerDMM(input(">>>")))  # Print the categorized response