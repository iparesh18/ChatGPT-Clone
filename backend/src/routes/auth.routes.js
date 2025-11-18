const express = require("express");
const router = express.Router()
const userModel = require("../models/user.model")
const {registerController , loginController} = require("../controllers/auth.controller")

// register

router.post("/register", registerController)
router.post("/login", loginController)

module.exports = router;



