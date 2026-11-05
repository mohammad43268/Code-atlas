require("dotenv").config();
const { OpenAI } = require("openai");

async function testModel(model, apiKey) {
    if (!apiKey) {
        console.warn(`[SKIP] Missing API key for model: ${model}`);
        return;
    }

    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://ollama.com/v1",
    });

    try {
        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: "hello" }]
        });
        console.log(`${model} SUCCESS:`, response.choices[0].message.content);
    } catch (e) {
        console.error(`${model} ERROR:`, e.status, e.message);
    }
}

const key1 = process.env.OLLAMA_API_KEY_1;
const key2 = process.env.OLLAMA_API_KEY_2;

async function run() {
    await testModel("gemma4:31b", key1);
    await testModel("nemotron-3-ultra", key1);
    await testModel("nemotron-3-super", key2);
    await testModel("gpt-oss:120b", key2);
}

run();
