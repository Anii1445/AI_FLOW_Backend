const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db.js")
const app = express();
const AIPrompt_Response = require("./schema.js")


const corsOptions = {
    origin: ["http://localhost:3000","https://ai-flow-frontend-steel.vercel.app"],
    methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json());

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    res.json({ response: aiText });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/add", async(req, res) => {
    try {
        const {prompt, AI_response} = req.body;
        const response = await AIPrompt_Response.create({prompt, AI_response})

        if(response){
            res.status(200).json(response);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Something went wrong!" });
    }
})

app.get("/api/get", async(req, res) => {
    try {
        const response = await AIPrompt_Response.find();

        if(response){
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Couldn't Fetch"})
    }
})

connectDB().then(() => {
    app.listen(process.env.PORT, () => console.log("Server running on port 5000"));
        console.log("API KEY:", process.env.OPENROUTER_API_KEY);
});


// fetch('https://openrouter.ai/api/v1/chat/completions', {
//   method: 'POST',
//   headers: {
//     Authorization: 'Bearer <OPENROUTER_API_KEY>',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     model: 'openai/gpt-5.2',
//     messages: [
//       { role: 'user', content: 'What is the meaning of life?' },
//       { role: 'assistant', content: "I'm not sure, but my best guess is" },
//     ],
//   }),
// });
