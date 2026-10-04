const express = require("express");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 8080;

// Setup OpenAI client to use Llama API
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.llama-api.com",
});

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

        const systemPrompt = `You are CodeAtlas AI, an elite senior software architect and coding assistant powered by the ${model || 'gpt-oss:120b'} model.
If asked what model you are or what architecture you are based on, you must explicitly state that you are powered by ${model || 'gpt-oss:120b'}.
You help developers understand repositories.
Always format your responses using clean Markdown. Use code blocks with language tags for any code.
Keep your answers highly accurate, concise, and professional.`;

        // Map the frontend's aesthetic model names to actual valid Llama API models
        let actualModel = "llama3.1-8b"; // default fallback
        if (model === "gpt-oss:120b") actualModel = "llama3.1-70b";
        else if (model === "nemotron-3-ultra:cloud") actualModel = "mixtral-8x7b-instruct";
        else if (model === "qwen-3.8b:edge") actualModel = "qwen2.5-72b";

        const response = await client.chat.completions.create({
            model: actualModel, 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: finalPrompt }
            ]
        });

        res.status(200).json({
            answer: response.choices[0].message.content
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
});

app.listen(port, () => {
    console.log(`CodeAtlas API is running on port ${port}`);
});

module.exports = app;