const authController = require("../controller/authController");

// route này đảm nhiệm login và logout
const route = require("express").Router();
// register
route.post("/register", authController.registerUser);

//login
route.post("/login", authController.loginUser);

module.exports = route;
