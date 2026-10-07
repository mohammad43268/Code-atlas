const { OpenAI } = require("openai");

async function testModel(model, apiKey) {
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

const key1 = "d269022547ea4b9a8321f6fa5b91c4aa.qUUpV5cLGW2JJu1G6i5CU_Uy";
const key2 = "51104d5bcb3f4b4c92458b129172f810.WXpCq0c8eVUW6UCecZb3pbwF";

async function run() {
    await testModel("gemma4:31b", key1);
    await testModel("nvidia-3-ultra", key1);
    await testModel("nemotron", key2);
    await testModel("gpt-oss:120b", key2);
}
run();
