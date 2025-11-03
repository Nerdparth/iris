from httpx import post
import csv, json, io, tiktoken, uuid, chromadb, nltk
from .models import Bot

client = chromadb.PersistentClient(path="./chroma_db")
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab")


def extract_text_from_file(file, extension):
    if extension == ".txt":
        text = file.read().decode("utf-8")
        return text
    elif extension == ".csv":
        decoded = file.read().decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        text = "\n".join([", ".join(row) for row in reader])
        return text
    elif extension == ".json":
        data = json.load(file)
        text = json.dumps(data, indent=2)
        return text
    else:
        return None


def generate_embedding_and_store(text: str, bot_uuid: str):
    embedding = post("http://172.29.153.203:11434/api/embeddings", json={ "model": "mxbai-embed-large" , "prompt": text}).json()["embedding"]
    bot_uuid = str(bot_uuid).strip()
    collection = client.get_or_create_collection(bot_uuid)
    doc_id = str(uuid.uuid4())
    
    collection.add(
        documents=[text],
        embeddings=[embedding],
        ids=[doc_id]
    )
    return None


def chunkify_data(text : str, chunk_size=700, overlap=100):
    chunks = []
    current_chunk = []
    current_chunk_tokens = 0
    tokenizer = tiktoken.get_encoding("cl100k_base")
    sentences = nltk.sent_tokenize(text)

    for sentence in sentences:
        sentence_tokens = len(tokenizer.encode(sentence))
        if current_chunk_tokens + sentence_tokens > chunk_size:
            chunk_text = " ".join(current_chunk)
            chunks.append(chunk_text)

            overlap_tokens = 0
            overlap_chunk = []

            for overlapping_sentence in reversed(current_chunk):
                token_length = len(tokenizer.encode(overlapping_sentence))
                if token_length + overlap_tokens > overlap:
                    break
                overlap_chunk.insert(0, overlapping_sentence)
                overlap_tokens += token_length

            current_chunk = overlap_chunk.copy()
            current_chunk_tokens = overlap_tokens

        current_chunk.append(sentence)
        current_chunk_tokens += sentence_tokens

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def convert_to_embedding_and_search(text : str, bot_uuid:str):
    embedding = post("http://172.29.153.203:11434/api/embeddings", json={ "model": "mxbai-embed-large" , "prompt": text}).json()["embedding"]
    bot = Bot.objects.get(uuid = bot_uuid)
    collection = client.get_or_create_collection(bot_uuid)
    results = collection.query(query_embeddings=embedding,n_results=5)
    ai_response = post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", headers={"x-goog-api-key": 'AIzaSyBDOq-9Ly2cCM_gry-1zDASMDrrXMnPy6Q', "Content-Type": "application/json"}, json={"contents": [{"parts": [{"text": f''' You are {bot.bot_name}, an intelligent assistant built for {bot.organisation.organisation_name}, a company in the {bot.organisation.industry} industry.

You are a highly trained expert on the company’s internal knowledge base and documents provided via embeddings.

--- INSTRUCTIONS ---
1. If context (embeddings) is provided:
   - Use the embeddings’ content as your *primary source of truth*.
   - Give concise, precise, technically correct answers.
   - Do not include introductions, pleasantries, or unnecessary explanations.
   - Speak as a knowledgeable internal assistant who deeply understands the company’s processes and data.

2. If NO embeddings or the context array is empty:
   - Rely on your general knowledge to answer helpfully and accurately.
   - If the question requires company-specific data that isn’t in context, say:
     “I don’t have that specific company data right now.”

3. Identity rules:
   - When asked “Who are you?”, respond: “I’m {bot.bot_name}, the virtual assistant for {bot.organisation.organisation_name}.”
   - Never reveal that you’re running on Ollama or mention Llama models.
   - Always stay factual, direct, and confident.

4. Style:
   - No greetings, no self-references, no meta explanations.
   - Output only the most relevant information.
   - Avoid speculative answers — be concise and authoritative.

   The user has asked this question: {text}

--- CONTEXT ---
{results}  
 ''', }]}]}, timeout=60.0
 ).json()
    print(ai_response)
    if "message" in ai_response:
        parsed = json.loads(ai_response["message"].replace("'", '"'))
        result = parsed["candidates"][0]["content"]["parts"][0]["text"]
    else:
        result = ai_response["candidates"][0]["content"]["parts"][0]["text"]

    return result
