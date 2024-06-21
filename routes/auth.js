const express = require('express');
const session = require('express-session');
const router = express.Router();
const authUtils = require('../utils/auth');
const passport = require('passport');
const flash = require('connect-flash');
const users = require('../models/userModel');
const Token = require('../models/token')
const Joi = require('joi')
const crypto = require('crypto')
const sendEmail = require("../utils/sendEmail");
// Create login page
// --------------------------------------------------
router.get('/login', (req, res, next) => {
  const messages = req.flash();
  res.render('login', { messages });
});

router.get('/login/:email', (req, res, next) => {
  const messages = req.flash();
  res.render('login-fill', { messages, email: req.params.email });
});
// --------------------------------------------------


// Handle login request
// --------------------------------------------------

// router.post('/login', passport.authenticate('local',

//   { 
//     failureRedirect: '/login', 

//     failureFlash: 'Wrong email or password'}), (req, res) => {
     
  
//   res.redirect('/login');
 
// });

router.post('/login', (req, res, next) => {
  const loginParams = req.body;
  email=loginParams.email;
  sess = req.session;
  sess.email = req.body.email;
  password=loginParams.password;
 
  users.findOne({ email }, (err, users) => {

    if (err) {
      req.flash('error','Wrong email.')
      res.redirect('/auth/login');
     
    }

    if (!users) {
      console.log (users)

      req.flash('error','User does not exist.')
      res.redirect('/auth/login');
    
    }

   else if (users.password != authUtils.hashPassword(password)) {
      req.flash('error','Wrong password')
      res.redirect('/auth/login');
     
    }
    else{
      
      // if ({email:'admin'}){
      //   console.log({email:'admin'});
      //   res.redirect('/assetpage');
      // }
      // else{
      // res.redirect('/userassetpage');
      // }
      if(email.includes('admin')){
        res.redirect('/assetpage');
      }
      else{
        res.redirect('/userassetpage');
      }
    
    }
    // res.redirect('/auth/login');


  });
});
// --------------------------------------------------


// Create register page
// --------------------------------------------------
router.get('/register', (req, res, next) => {
  const messages = req.flash();
  res.render('register', { messages });
});
// --------------------------------------------------


// Handle register request
// --------------------------------------------------
router.post('/register', (req, res, next) => {
  const registrationParams = req.body;
  const payload = {
    first:  registrationParams.first,
    last:  registrationParams.last,
    email: registrationParams.email,
    password: authUtils.hashPassword(registrationParams.password),
    repeatPassowrd: authUtils.hashPassword(registrationParams.repeatPassword),
  };

  if(payload.password !== payload.repeatPassowrd){
    req.flash('error', 'Passwords do not match.')
    res.redirect('/auth/register');
    return
  }

  users.insertMany(payload, (err) => {
    if (err) {
      req.flash('error', 'User account already exists.');
      res.redirect('/auth/register');
    } else {
      req.flash('success', 'User account registered successfully.');
      sess = req.session;
      sess.email = req.body.email;
      res.redirect('/assetpage');
    }
    
  });
});
// --------------------------------------------------

// Logout page
// --------------------------------------------------
// router.get('/logout', (req, res, next) => {
//   req.session.destroy();
//   res.redirect('/auth/login');
// });

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/auth/login');
  });

});

router.get('/forget', (req, res, next) => {
  const messages = req.flash();
  res.render('forget', { messages });
});

router.post("/forget", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await users.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
  
});
router.get('/change', (req, res, next) => {
  const messages = req.flash();
  res.render('change', { messages });
});

router.post('/change', (req, res, next) => {
  console.log("email");
  sess = req.session;
  email=sess.email;
  const registrationParams = req.body;
  console.log(email);
  oldpassword= registrationParams.oldpassword;
  const payload = {
    newPassword: authUtils.hashPassword(registrationParams.newPassword),
    confPassword : authUtils.hashPassword(registrationParams.confPassword),
  };
  console.log ("newPassword");

  if (users.password != oldpassword ) {
    req.flash('error','Wrong password')
    res.redirect('/auth/change');
   
  }

  else if(payload.newPassword !== payload.confPassword){
    req.flash('error', 'Passwords do not match.')
    res.redirect('/auth/change');
    return
  }
  else {
    users.findOneAndUpdate({email: email} ,{$set: {'password':payload.newPassword}}, function(err, results) {

      if (err ) {
        console.log(err);
        req.flash('error', 'error occure.');
        res.redirect('/auth/change');
      } 
      else {

        req.flash('success', ' Password reset sucessfully');
        console.log('success');
     
        res.redirect('/users');
      }
    })
  }
});


module.exports = router;
