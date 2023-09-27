const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username: {type: String, required: true, min: 4, unique: true},
    password: {type: String, required: true},
});

//creating models
const UserModel = model('User', UserSchema);

// export user model
module.exports = UserModel;