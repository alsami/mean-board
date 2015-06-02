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
	updateReason: {type : String, default: null},
	deletedAt: {type: Date, default: null}
});

PostSchema.plugin(deepPopulate, {
	populate : {
		'parent' : { // thread
			select : '_id title parent'
		},
		'parent.parent' : { // e.g. sub sub category
			select : '_id title parent'
		},
		'parent.parent.parent' : { // e.g. sub category
			select : '_id title parent'
		},
		'parent.parent.parent.parent' : { // e.g. main category
			select : '_id title'
		},
		'createdBy' : {
			select: '_id userName createdAt role'
		},
		'updatedBy' : {
			select: '_id userName role'
		}
	}
});

module.exports = mongoose.model('Post', PostSchema);
