/**
 * Blueprint for messages and interface
 * for MongoDB
 */

// dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

// schema
var MessageSchema = new Schema({
	from: {type: Schema.Types.ObjectId, ref: 'User'},
	to: {type: Schema.Types.ObjectId, ref: 'User'},
	subject: String,
	body: String,
	isRead: {type: Boolean, default: false},
	createdAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

// declare what a deepPopulate (chaining population) will return
// for a specific attribute
MessageSchema.plugin(deepPopulate, {
	populate: {
		'from' : {
			select: '_id userName'
		},
		'to' : {
			select: '_id userName'
		}
	}
});

module.exports = mongoose.model('Message', MessageSchema);
