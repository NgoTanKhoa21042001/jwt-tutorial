const jwt = require("jsonwebtoken");

const middlwareController = {
  // verifyToken
  // xác nhận xem có phải ng đó ko
  verifyToken: (req, res, next) => {
    // Lấy token từ user
    const token = req.headers.token;
    if (token) {
      // lấy access token
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(500).json("Token is not valid");
        }
        //   nếu đúng token thì trả về user
        req.user = user;
        // chạy tiếp function
        next();
      });
    } else {
      res.status(500).json("You're not authentication");
    }
  },
  // xác thực xem có phải chình mình hay admin hay ko
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlwareController.verifyToken(req, res, () => {
      // so sánh có trùng id hay ko
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allowed to delete other");
      }
    });
  },
};

module.exports = middlwareController;
