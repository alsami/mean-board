var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate');

var PostSchema = new Schema({
	body: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Thread', required: true},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
	createdAt: {type: Date, default: Date.now},
	updatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
	updatedAt: {type: Date, default: null},
	deletedAt: {type: Date, default: null}
});

PostSchema.plugin(deepPopulate, {
	populate : {
		'parent' : {
			select : '_id title'
		},
		'createdBy' : {
			select: '_id userName'
		},
		'updatedBy' : {
			select: '_id userName'
		}
	}
});

module.exports = mongoose.model('Post', PostSchema);
