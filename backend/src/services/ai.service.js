const { GoogleGenAI } = require("@google/genai");

// 1️⃣ ai instance MUST be defined BEFORE generateResponse
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// 2️⃣ function MUST be inside same file and scope
async function generateResponse(content) {

    // send request
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config:{
            temperature:0.2,
            systemInstruction: `
            You are an intelligent AI assistant.

Follow these rules:

1. **Be accurate and concise.**
   Prefer short, direct answers unless the user requests detailed explanations.

2. **Use the provided context blocks correctly:**
   - **STM (short-term memory)** = the last few messages from this chat. Use it for conversation flow.
   - **LTM (long-term memory)** = retrieved memories about the user. Use them ONLY when clearly relevant to the current query.
   - **SCRAPED CONTENT** = website text or external information. If provided, prioritize it over assumptions.

3. **If scraped content is present:**
   - Prefer facts from the scraped text.
   - If the scraped content does not contain the answer, politely mention that.

4. **Do NOT hallucinate.**
   If you don't know something, say:
   “I don’t have enough information to answer that.”

5. **Do NOT fabricate sources, dates, or statistics.**
   Stick to what is in STM, LTM, or scraped content.

6. **When using long-term memory:**
   - Only use relevant memories.
   - Do not reveal or list memory unless asked.
   - Never invent new memories.

7. **If user asks about past conversations:**
   - Answer using LTM if relevant.
   - Do not assume anything that is not in memory.

8. **If user asks for code:**
   - Provide clean, correct code.
   - Explain steps briefly if needed.

9. **When user asks for opinions or suggestions:**
   - Give practical, helpful, and safe advice.

10. **Be friendly, clear, and helpful.**

            `

        }
    });

    // 3️⃣ New Gemini structure
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text;
    }

    // 4️⃣ Old Gemini structure
    if (response?.response?.text) {
        return response.response.text();
    }

    throw new Error("Gemini returned no text response");
}

async function generateVector(content){
    const response = await ai.models.embedContent({
        model:"gemini-embedding-001",
        contents:content,
        config:{
            outputDimensionality:768
        }
    })

    return response.embeddings[0].values;
}
// 5️⃣ CORRECT export
module.exports = {
    generateResponse, generateVector 
}
