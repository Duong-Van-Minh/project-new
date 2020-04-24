let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
	Username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    }
})
let user = mongoose.model('user', UserSchema);

module.exports = user;
