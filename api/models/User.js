const mongoose = require('mongoose')
const {Schema, model} = mongoose;
const express = require('express');

const UserSchema = new Schema({
    username: {type: String, required: true, min:4, unique: true},
    password: {type: String, required: true}

});

UserSchema.pre('save', function(){
    this.password = hashedPass;

})

const UserModel = model('User', UserSchema)

module.exports = UserModel;