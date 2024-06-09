const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Black", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Define a schema and model for the data
const dataSchema = new mongoose.Schema({
  end_year: String,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: String,
  impact: String,
  added: String,
  published: String,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number,
});

const coffee = mongoose.model("coffee", dataSchema);

// Define the API endpoint to get data
app.get("/api/coffee", async (req, res) => {
  try {
    await coffee.find({}).then((data) => {
      res.json(data);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/coffee", async (req, res) => {
  for (let index = 0; index < req.body.length; index++) {
    let data = req.body[index];
    try {
      let contact = new coffee(data);
      await contact.save();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  res.status(200).json({ Success: "True" });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
