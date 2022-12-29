const authController = require("../controller/authController");

// route này đảm nhiệm login và logout
const router = require("express").Router();
// register
router.post("/register", authController.registerUser);

//login
router.post("/login", authController.loginUser);

// REFRESH
router.post("/refresh", authController.requestRefreshToken);
module.exports = router;
