const fetch = require('node-fetch');
require('dotenv').config({ path: ".env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const questions = [
    "What CRM does the customer use?", 
    "CRM central object/table name where your Quotes are created from? Opportunity, Deal, other",
    "Where do you store your pricebook? In your CRM or is there also a spreadsheet?",
    "Roughly how many SKUs or Products are in your catalog or that you manage",
    "What is your biggest pain point?", 
];
const responseConfidence = "Please try to make your asnwers concise. If based on the data provided, you cannot determine the answer please output: insufficient data";

const askGemini = async (callTranscript, question) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    });

    const prompt = `
        Here's some data about customer conversations:

        \`\`\`json
        ${JSON.stringify(callTranscript, null, 2)}
        \`\`\`

        Based on this data, answer the following question:

        ${question}
        `;

    try {
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{
                    text: prompt
                }]
            }],
        });

        const response = result.response;
        //console.log(JSON.stringify(response, null, 2)); // Helpful for debugging

        const answer = response.candidates[0].content.parts[0].text.trim();
        return answer;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "";
    }
};

const processQuestions = async (callTranscript) => {
    const geminiResponses = [];
    for (const question of questions) {
        const answer = await askGemini(callTranscript, `${question} ${responseConfidence}`);
        geminiResponses.push({ question, answer });
    }
    return geminiResponses;
};

module.exports = processQuestions;