const mongoose = require("mongoose");

const AI_Schema = new mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    AI_response: {
        type: String,
        required: true
    }
});

const AIPrompt_Response = new mongoose.model("AIPrompt_Response", AI_Schema)
module.exports = AIPrompt_Response;
