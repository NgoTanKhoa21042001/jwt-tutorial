// jwt

const middlwareController = require("../controller/middlewareController");
const userController = require("../controller/userController");

const router = require("express").Router();
// GET ALL USER

router.get("/", middlwareController.verifyToken, userController.getAllUsers);

// Delete user
router.delete(
  "/:id",
  middlwareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);
module.exports = router;
