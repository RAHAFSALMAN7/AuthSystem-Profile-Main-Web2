const express = require('express');
const router = express.Router();
const session = require('express-session');
const users = require('../models/userModel');

// Configure user account profile edit
// --------------------------------------------------
// router.get('/', function(req, res, next) {
//   // if (!req.isAuthenticated()) { 
//   //   req.flash('error','Wrong');
//   //   res.redirect('/auth/login');
//   // }
 
//   const email = req.body.email;

//   users.findOne({ email }, (err, results) => {
//     if (err) {
//       throw err;
//     }

//       res.render('account', { ...results });
//   });
// });
//--------------------------------------------------


// Get public profile for any user
// --------------------------------------------------

// --------------------------------------------------
router.get('/', (req, res) => {
  
  sess = req.session;
  email=sess.email;

 users.findOne({ email }, (err, results) => {
   if (err || !results) {
     res.render('public-profile', { messages: { error: ['User not found'] } });
   }
   res.render('public-profile', { ...results?._doc, email });
 });
})
// --------------------------------------------------
// router.get('session/:email', (req, res, next) => {
  
 

//  users.findOne({ email }, (err, results) => {
//    if (err || !results) {
//      res.render('public-profile', { messages: { error: ['User not found'] } });
//    }

//    res.render('public-profile', { results, email });
//  });
// })


// Handle updating user profile data
// --------------------------------------------------
// router.post('/', (req, res, next) => {
 

//   const { fisrt, last, email} = req.body;
//   const _id = ObjectID(req.session.user);

//   users.updateOne({ _id }, { $set: { first, last, email } }, (err) => {
//     if (err) {
//       throw err;
//     }
    
//     res.redirect('/users');
//   });
// });
// --------------------------------------------------

module.exports = router;