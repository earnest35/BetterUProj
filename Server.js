const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  try {
    const { input } = req.body;
    const messages = [
      { role: "system", content: "Hello! I'm your personal assistant for health and fitness. Please ask me any questions related to health and fitness." },
      { role: "user", content: input }
    ];
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    res.json({ response: completion.data.choices[0].content });
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
