// jwt

const userController = require("../controller/userController");

const router = require("express").Router();
// GET ALL USER

router.get("/", userController.getAllUsers);

module.exports = router;
