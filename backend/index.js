const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const app = express();
const userRoute = require("./routes/user");
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_DB, () => {
  console.log("Connected to MongoDB");
});

app.use(cors());

app.use(cookieParser());

app.use(express.json());

// Routes

app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.listen(8000, () => {
  console.log("Server listening on port...");
});

// AUTHENTICATION : SO sánh pass của user so với info trên db, so sánh dữ liệu nhập vs db đã có
// AUTHORIZATION: bạn là ai và bạn có quyền làm gi (phần quyền)
