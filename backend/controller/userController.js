const User = require("../models/User");

const userController = {
  // get all user
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
