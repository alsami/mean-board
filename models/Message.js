var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate');

var MessageSchema = new Schema({
	from: {type: Schema.Types.ObjectId, ref: 'User'},
	to: {type: Schema.Types.ObjectId, ref: 'User'},
	// cc
	// bcc
	subject: String,
	// attachment
	body: String,
	isRead: {type: Boolean, default: false},
	createdAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

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
