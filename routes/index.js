const express = require('express');
const router = express.Router();
const users = require('../models/userModel')
const passwordReset = require("../routes/passwordReset");
const user = require("../routes/users");
const app = express();
const connection = require("../db");

// Create custom homepage
// --------------------------------------------------
router.get('/', async (req, res) => {
  const firstThreeUsers = await users.find({}).sort({ _id: -1 }).limit(3).select("email -_id")
  res.render('auth/login', {recent: firstThreeUsers})
});
// -------------------------------------------------
//reset password
//--------------------------------------------------
router.use(express.json());

router.use("/api/users", user);
router.use("/api/password-reset", passwordReset);
//--------------------------------------------------
module.exports = router;
