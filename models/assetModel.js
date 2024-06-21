const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const users = require('../models/userModel');

const assetModel = new mongoose.Schema({
    // _id: {
    //     type: numberlong(3) ,

    //     required: true
    // },
    productId:{
        type: Number ,
        required: true,
        unique:true

    },
   productName: {
        type: String,
        required: true
    },
    productCategory : {
        type: String,
        required: true
    },
    user_email: {
         type: String, 
         ref: 'users'
    }
})

const asset = mongoose.model('assets', assetModel);

module.exports = asset;
