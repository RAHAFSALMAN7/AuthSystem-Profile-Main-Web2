const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Joi = require("joi");
const { number } = require('joi');

const userModel = new mongoose.Schema({
   
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true,
         unique: true
    },
    password: {
        type: String,
        required: true
    }
})


const users = mongoose.model('users', userModel);


module.exports = users;
