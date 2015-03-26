var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true},
	lastName: String,
	birthday: Date,
	gender: String,

	userName: { type: String, required: true, unique: true},
	password: { type: String, required: true },
	email: {type: String, required: true},

	signature: String,
	aboutMe: String,

	country: String,
	city: String,
	zipCode: String,

	deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('User', UserSchema);
