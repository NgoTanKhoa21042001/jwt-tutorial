// hash pass
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Save user to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        // Mún thông tin id user
        id: user.id,
        admin: user.admin,
      },
      // mã bí mật
      process.env.JWT_ACCESS_KEY,
      // thời gian hết hạn
      { expiresIn: "30d" }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        // Mún thông tin id user
        id: user.id,
        admin: user.admin,
      },
      // mã bí mật
      process.env.JWT_REFRESH_KEY,
      // thời gian hết hạn
      { expiresIn: "365d" }
    );
  },
  // logjn
  loginUser: async (req, res) => {
    try {
      // tìm có username trong db hay ko
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Incorrect username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("Incorrect password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        // refresh token
        const refreshToken = authController.generateRefreshToken(user);
        refreshToken.push();
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict", // nghĩa là nhg cái http rq đến site này thôi
        });
        // ko trả password
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    // Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    // nếu array của mình nó ko include refreshToken
    if (!refreshToken.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not available");
    }
    // xác nhận xem refresh token này có đúng hay ko
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }

      // lọc token cũ ra
      refreshToken = refreshToken.filter((token) => token !== refreshToken);

      // Create new access token and refresh token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      
      // Lưu vào cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict", // nghĩa là nhg cái http rq đến site này thôi
      });
    });
  },
};

module.exports = authController;

// 2 cách để lưu trữ acccess token và refresh token
// 1. Lưu ở Local storage
// xss dễ bị tấn công
// 2/ cookies
// CSRF: loại tấn công khi web giả mạo phải yêu cầu nhập gi đó => cookies bị đánh cắp
// khắc phục = SAMeSITE
// 3/ REDUX STORE: ĐỂ LƯU ACCCESS TOKEN
// httponly cookie => để lưu trữ refresh token
