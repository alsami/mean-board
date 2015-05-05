var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate');

var UserSchema = new Schema({
	firstName: { type: String, required: true},
	lastName: String,
	birthday: Date,
	gender: String,

	userName: { type: String, required: true, unique: true},
	password: { type: String, required: true },
	email: {type: String, required: true, unique: true},

	signature: String,
	aboutMe: String,

	country: String,
	city: String,
	zipCode: String,

	subscribed_categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
	subscribed_threads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],

	deletedAt: {type: Date, default: null}
});

UserSchema.plugin(deepPopulate, {});

module.exports = mongoose.model('User', UserSchema);
