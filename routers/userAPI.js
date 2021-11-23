const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");

router.get("/", (req, res) => {
  res.send("User router");
});
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check("password", "please provide with at least 5 digit").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    console.log(req.body);
    console.log(
      validationResult(req),
      "--------------------------> validationResult---------<>"
    );
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      const { name, email, password } = req.body;
      console.log(req.body, "req body data");
      let user = await User.findOne({ email });
      if (user) {
        console.log(user);
        return res
          .status(400)
          .json({ errors: [{ msg: "User already present" }] });
      }
      user = new User({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 3600 * 24 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //res.send("User created");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
