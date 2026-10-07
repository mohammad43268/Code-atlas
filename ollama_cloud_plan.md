# Ollama Cloud API Routing Plan

## 1. Environment Variables Configuration
We will remove Groq-related variables and replace them with the two Ollama API keys provided:
- `OLLAMA_API_KEY_1` = `d269022547ea4b9a8321f6fa5b91c4aa.qUUpV5cLGW2JJu1G6i5CU_Uy`
- `OLLAMA_API_KEY_2` = `51104d5bcb3f4b4c92458b129172f810.WXpCq0c8eVUW6UCecZb3pbwF`

## 2. Frontend Dropdown Updates
Update `ChatPanel.tsx` to list the exactly 4 models requested:
1. `gemma4:31b`
2. `nvidia-3-ultra`
3. `nemotron`
4. `gpt-oss:120b`

## 3. Backend Routing Logic
Update `server.js` to route the incoming model requests securely based on the selected model:

**API Key 1 (`d2690...`) will handle:**
- `gemma4:31b`
- `nvidia-3-ultra`

**API Key 2 (`51104...`) will handle:**
- `nemotron`
- `gpt-oss:120b`

When a request comes in, the backend will dynamically select the correct API key from `.env` and forward the prompt to the Ollama Cloud endpoint (`https://api.ollama.com/v1`).
