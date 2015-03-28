var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	body: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Thread', required: true},
	createdBy: {type: String, default: 'Anonymous'}, // only for developing
	updatedAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('Post', PostSchema);
