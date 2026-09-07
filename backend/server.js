const express = require("express");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 8080;

const client = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY,
    baseURL: "https://ollama.com/v1",
});

app.use(cors());
app.use(express.json());

app.post(["/ask", "/api/ask"], async (req, res) => {
    try {
        const { question, fileContent, fileName } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        let finalPrompt = question;
        if (fileContent) {
            finalPrompt = `Context from uploaded file (${fileName || 'unknown'}):\n\n${fileContent}\n\n---\n\nUser Question: ${question}`;
        }

        const systemPrompt = `You are CodeAtlas AI, an elite senior software architect and coding assistant.
You help developers understand repositories.
Always format your responses using clean Markdown. Use code blocks with language tags for any code.
Keep your answers highly accurate, concise, and professional.`;

        const response = await client.chat.completions.create({
            model: "gpt-oss:120b", 
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