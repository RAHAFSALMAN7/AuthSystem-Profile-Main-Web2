const express = require('express');
const router = express.Router();
const session = require('express-session');
const asset = require('../models/assetModel');
const users = require('../models/userModel');
const crypto = require('crypto');





router.get('/', (req, res)=> {
 
  
    asset.find(async (err, docs) => {
        const arr = await Promise.all(docs.map(async (doc) => {
            const user = await users.findOne({email: doc.user_email})
            doc.user_email = user?.first

            return doc
        }))
        if (!err) {
            res.render('assetadmin', {
             list: arr
            });
        } else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    });
 
 });
 
 
   // --------------------------------------------------
 module.exports=router;
