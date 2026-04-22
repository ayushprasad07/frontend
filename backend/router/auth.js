const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

router.post(
  "/signup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ success: false, errors: result.array() });
    }

    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ success: false, errors: "Please enter all fields" });
      }

      if (await User.findOne({ email })) {
        return res
          .status(400)
          .json({ success: false, errors: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

    //   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1d",
    //   });

    //   res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "None",
    //   });

      res.status(200).json({success: true, message: "User account created. Please log in" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, errors: "Internal Server error" });
    }
  },
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ success: false, errors: result.array() });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res
            .status(400)
            .json({ success: false, errors: "Please enter all fields" });
        }

        const user = await User.findOne({ email });

        if (!user) {
          return res
            .status(400)
            .json({ success: false, errors: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, errors: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });

        res.status(200).json({success: true, message: "User logged in" });
    } catch (error) {
        console.log(error);
        return res
        .status(500)
        .json({ success: false, errors: "Internal Server error" });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "User logged out" });
})

router.get("/check-access", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    res.json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false });
  }
});

module.exports = router;
