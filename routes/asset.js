const express = require('express');
const session = require('express-session');
const router = express.Router();
const flash = require('connect-flash');
const users = require('../models/userModel');
const asset = require('../models/assetModel');
const Joi = require('joi')
const crypto = require('crypto');


//-----------------asset add page-----------------------------------------------------
router.get('/addasset', (req, res, next) => {
    const messages = req.flash();
    res.render('addasset', { messages });
});



router.post('/addasset', (req, res, next) => {
  const assetParams = req.body;
 
  const payload = {

    productId:  assetParams.productId,
    productName:  assetParams.productName,
    productCategory: assetParams.productCategory

  };

  asset.insertMany(payload, (err) => {
    if (err) {
      req.flash('error', ' Product Id already exists.');
      res.redirect('/asset/addasset');
    } 
    else {
      req.flash('success', ' Assets have been successfully added.');
      sess = req.session;
      sess.productId = req.body.productId;
      res.redirect('/asset/addasset');
   
    }
    
  });
    
});
router.get('/back',(req,res) => {
 
  req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      if(email.includes('admin')){
        res.redirect('/assetpage');
      }
      else{
        sess = req.session;
        email=sess.email;
        res.redirect('/userassetpage');
      }
   
  });

});
router.get('/delete/:productId', function(req, res, next) {

  const id = req.params.productId;
    assets.findOneAndDelete({productId: id} , function(err,data) {


      if (err) {
     
          console.log('Failed to Delete asset Details: ' + err);


      } else {
        sess = req.session;
        email=sess.email;
      
        res.redirect('/assetpage');
   
      }
  });
})


module.exports = router;
