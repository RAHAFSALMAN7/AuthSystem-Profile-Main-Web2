const express = require('express');
const router = express.Router();
const session = require('express-session');
const asset = require('../models/assetModel');
const crypto = require('crypto');




router.get('/', (req, res)=> {
 
    sess = req.session;
    email=sess.email;

   asset.find({ user_email: email },(err, docs) => {
       if (!err) {
              if(email.includes('admin')){
                res.render('Myasset', {
                    list: docs
                   });     
                 }
             else{
                res.render('userMyAsset', {
                    list: docs
                });
                    }
                
            } else {
                    console.log('Failed to retrieve the Course List: ' + err);
            }
   });

});


  // --------------------------------------------------
module.exports=router;
