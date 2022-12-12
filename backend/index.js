const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_DB, () => {
  console.log("Connected to MongoDB");
});

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.listen(8000, () => {
  console.log("Server listening on port...");
});
