const mongoose = require('mongoose');

//user schema
const userSchema = new mongoose.Schema({
	email: {type: String, unique : true, lowercase: true, required: true},
	password: {type: String, required: true},
});

module.exports = User = mongoose.model('User',userSchema);