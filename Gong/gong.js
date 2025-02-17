require('dotenv').config();

const extractGongUrl = (messageText) => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = messageText.match(urlRegex);

    if (match) {
        return match[0]; // Return the first element of the array (the URL)
    }
    //need to handle Error
};

const handleGongCall = async (messageText) => {
    const gongURL = extractGongUrl(messageText);
    const id = gongURL.split("?id=");
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.GONG_API_KEY}`
    };
    const body = {
        "filter": {
            "callIds": [
                id
            ]
        }
    };
    //THIS NEEDS TO BE TESTED
    /*
    const retrieveTranscript = await axios.post("/v2/calls/transcript", JSON.stringify(body), headers);
    const mappedSentences = retrieveTranscript.callTranscripts[0].transcript;
    return mappedSentences
    */
    return [{
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
};

module.exports = handleGongCall