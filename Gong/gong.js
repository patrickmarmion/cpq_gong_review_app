require('dotenv').config();
const axios = require("axios");
const base64Credentials = Buffer.from(`${process.env.GONG_API_KEY}:${process.env.GONG_API_SECRET}`).toString("base64");
const headers = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${base64Credentials}`
    }
};
const baseUrl = process.env.GONG_BASE_URL;

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
    const { calls } = await axios.post(`${baseUrl}/v2/calls/extensive`, JSON.stringify(body), headers);
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
    const { data } = await axios.post(`${baseUrl}/v2/calls/transcript`, body, headers);
    const transcript = data.callTranscripts[0].transcript.filter(obj => obj.topic !== "Call Setup" && obj.topic !== "Small Talk" && obj.topic !== "Wrap-up");
    return transcript
};

const handleGongCall = async (messageText) => {
    const gongURL = extractGongUrl(messageText);
    const id = gongURL.split("?id=")[1];
    const transcript = await retrieveTranscript(id);

    //THIS NEEDS TO BE TESTED
    /*
    const speakers = await retrieveSpeakerIds(id);
    return {
        speakers,
        transcript
    }
    */

    return {
        speakers: {
            "PandaSpeakers": ["6496595035999914885"],
            "ExternalSpeakers": ["1615404021306669752", "5049046312312437272"]
        },
        transcript
    }
};

module.exports = handleGongCall