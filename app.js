const express = require('express');
const axios = require("axios");
require('dotenv').config();

const authenticateReq = require('./Authentication/authenticate');
const handleGongCall = require('./Gong/gong');
const processQuestions = require('./Gemini/gemini');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/recordingHandler', authenticateReq, async (req, res) => {
    try {
        const { messageText, channelId, channelName, callbackUrl } = req.body;

        if (!messageText || !channelId || !channelName || !callbackUrl) {
            return res.status(400).json({ error: "Invalid request. Required fields: messageText, channelId, channelName, callbackUrl" });
        }

        // Respond immediately to prevent Zapier timeout
        res.status(202).json({ message: "Request received. Processing in background..." });

        const callTranscript = await handleGongCall(messageText);
        const geminiResponses = await processQuestions(callTranscript);
        const slackFormattedResponse = geminiResponses
            .map(({ question, answer }) => `*${question}*\n• _${answer}_`)
            .join("\n\n");

        // Send result back to client via callback URL
        await axios.post(callbackUrl, { gemini_response: slackFormattedResponse });

    } catch (error) {
        console.error("Error in /recordingHandler:", error);
    }
});

app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
