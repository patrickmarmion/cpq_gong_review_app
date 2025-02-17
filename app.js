const express = require('express');
require('dotenv').config();

const authenticateReq = require('./Authentication/authenticate');
const handleGongCall = require('./Gong/gong');
const processQuestions = require('./Gemini/gemini');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/recordingHandler', authenticateReq, async (req, res) => {
    try {
        const { messageText, channelId, channelName } = req.body;

        // Validate the required fields
        if (!messageText || !channelId || !channelName) {
            return res.status(400).json({ error: "Invalid request. Required fields: messageText, channelId, channelName" });
        };

        const callTranscript = await handleGongCall(messageText);
        const geminiResponse = await processQuestions(callTranscript);

        res.json({
            gemini_response: geminiResponse
        });
    } catch (error) {
        console.error("Error in /recordingHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
