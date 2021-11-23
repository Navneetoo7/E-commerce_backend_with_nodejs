const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");




//only accessible to user who have valid token with jwcScrete code also and it also has valid
router.get("/",auth, async(req,res)=>{
    try{
console.log(req.user);
const user = await User.findById(req.user.id).select("-password");
console.log(user);
res.json(user);
    }catch(error){
        console.error(error.message);
    }
})
//login
router.post(
    "/",
    [
      check("email", "Please enter valid email").isEmail(),
      check("password", "password required").exists(),
    ],
    async (req, res) => {
      const error = validationResult(req);
      console.log(req.body);
      console.log(validationResult(req),"-------------------------->");
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }
      try {
        const { email, password } = req.body;
        console.log(req.body);
        let user = await User.findOne({ email });
        if (!user) {
          console.log(user);
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid username or password" }] });
        }
      const match = await bcrypt.compare(password, user.password);
      if(!match){
        return res
        .status(400)
        .json({ errors: [{ msg: "Invalid username or password" }] });
      }
        const payload ={
        user:{
          id:user.id,
        }
        }
        jwt.sign(payload, config.jwtSecret, {expiresIn:3600*24},(err,token)=>{
          if(err)throw err
          res.json({token});
        });
  
        // res.send("User created");
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error")
      }
    }
  );
module.exports = router;
