var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	body: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Thread', required: true},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
	createdAt: {type: Date, default: Date.now},
	updatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
	updatedAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('Post', PostSchema);
