const express = require("express");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 8080;


app.use(cors());
app.use(express.json());

app.post(["/ask", "/api/ask"], async (req, res) => {
    try {
        const { question, fileContent, fileName, model } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        let finalPrompt = question;
        if (fileContent) {
            finalPrompt = `Context from uploaded file (${fileName || 'unknown'}):\n\n${fileContent}\n\n---\n\nUser Question: ${question}`;
        }

        const KEY_BY_MODEL = {
            "gemma4:31b": process.env.OLLAMA_API_KEY_1,
            "nemotron-3-ultra": process.env.OLLAMA_API_KEY_1,
            "nemotron-3-super": process.env.OLLAMA_API_KEY_2,
            "gpt-oss:120b": process.env.OLLAMA_API_KEY_2
        };

        if (!model || !(model in KEY_BY_MODEL)) {
            return res.status(400).json({ error: "Unsupported model" });
        }

        const selectedApiKey = KEY_BY_MODEL[model];
        if (!selectedApiKey) {
            const missingEnv = model === "gemma4:31b" || model === "nemotron-3-ultra" 
                ? "OLLAMA_API_KEY_1" 
                : "OLLAMA_API_KEY_2";
            return res.status(401).json({ error: `API key missing. Please set ${missingEnv} in your .env file.` });
        }

        const systemPrompt = `You are CodeAtlas AI, an elite senior software architect and coding assistant powered by the ${model} model.
If asked what model you are or what architecture you are based on, you must explicitly state that you are powered by ${model}.
You help developers understand repositories.
Always format your responses using clean Markdown. Use code blocks with language tags for any code.
Keep your answers highly accurate, concise, and professional.`;

        // Setup OpenAI client dynamically based on the routed API Key
        const client = new OpenAI({
            apiKey: selectedApiKey,
            baseURL: "https://ollama.com/v1", // Correct Ollama cloud endpoint
        });

        const response = await client.chat.completions.create({
            model: model, 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: finalPrompt }
            ]
        });

        res.status(200).json({
            answer: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Provider Error Status:", error.status);
        console.error("Provider Error Message:", error.message);
        
        const statusCode = error.status || 500;
        res.status(statusCode).json({ error: error.message || "An unexpected error occurred." });
    }
});

app.listen(port, () => {
    console.log(`CodeAtlas API is running on port ${port}`);
});

module.exports = app;