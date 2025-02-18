require('dotenv').config();
const axios = require("axios");
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${process.env.GONG_API_KEY}`
};

const extractGongUrl = (messageText) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = messageText.match(urlRegex);

    if (match) {
        return match[0]; // Return the first element of the array (the URL)
    }
    //need to handle Error
};

const retrieveSpeakerIds = async (id) => {
    const body = {
        "filter": {
            "callIds": [
                id
            ]
        }
    };
    const { calls } = await axios.post("/v2/calls/extensive", JSON.stringify(body), headers);
    const PandaSpeakers = calls[0].parties
        .filter(party => party.affiliation === "Internal")
        .map(speaker => speaker.speakerId);
    const ExternalSpeakers = calls[0].parties
        .filter(party => party.affiliation !== "Internal")
        .map(speaker => speaker.speakerId);

    return {
        PandaSpeakers,
        ExternalSpeakers
    }

};

const retrieveTranscript = async (id) => {
    const body = {
        "filter": {
            "callIds": [
                id
            ]
        }
    };
    const retrieveTranscript = await axios.post("/v2/calls/transcript", JSON.stringify(body), headers);
    const transcript = retrieveTranscript.callTranscripts[0].transcript;
    return transcript
};

const handleGongCall = async (messageText) => {
    const gongURL = extractGongUrl(messageText);
    const id = gongURL.split("?id=");

    //THIS NEEDS TO BE TESTED
    /*
    const speakers = await retrieveSpeakerIds(id);
    const transcript = await retrieveTranscript(id);
    return {
        speakers,
        transcript
    }
    */

    return {
        speakers: {
            "PandaSpeakers": ["123"],
            "ExternalSpeakers": ["456"]
        },
        transcript: [{
                "speakerId": "123",
                "topic": "CPQ",
                "sentences": [{
                    "start": 460230,
                    "end": 462343,
                    "text": "What is the name of your CRM Name?"
                }]
            },
            {
                "speakerId": "456",
                "topic": "CPQ",
                "sentences": [{
                    "start": 462344,
                    "end": 465343,
                    "text": "We use HubSpot CRM and generate documents from the Deal"
                }]
            }
        ]
    }
};

module.exports = handleGongCall