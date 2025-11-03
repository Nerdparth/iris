from httpx import post
import csv, json, io, tiktoken, uuid, chromadb, nltk

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
    collection = client.get_or_create_collection(bot_uuid)
    return


def get_response():
    return 