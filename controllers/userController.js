const express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const assets = require('../models/assetModel');
//mongoose.set('useFindAndModify', false);

router.get('/', (req, res) => {
   console.log('zhqt');
    assets.find((err, docs) => {
        if (!err) {
            res.render('assetadmin', {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving assets list :' + err);
        }
    });
});

module.exports = router;