/**
 * Blueprint for users and interface
 * for MongoDB
 */

// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

// schema
var UserSchema = new Schema({
	firstName: { type: String, required: true},
	lastName: String,
	birthday: Date,
	gender: String,

	userName: { type: String, required: true, unique: true}, // userName has to be unique
	password: { type: String, required: true },
	email: {type: String, required: true, unique: true},

	signature: String,
	aboutMe: String,

	country: String,
	city: String,
	zipCode: String,

	subscribed_categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
	subscribed_threads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],

	role: {type: String, default: 'user'},
	unreadMessages: {type: Number, default: 0},
	posts: {type: Number, default: 0},

	createdAt: {type: Date, default: Date.now},
	updatedBy: {type: Schema.Types.ObjectId, ref: 'User', default: null},
	updatedAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

// declare what a deepPopulate (chaining population) will return
// for a specific attribute
UserSchema.plugin(deepPopulate, {});

module.exports = mongoose.model('User', UserSchema);
