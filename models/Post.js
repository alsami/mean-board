var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	body: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Thread', required: true},
	deletedAt: {type:Date, default: null}
});

module.exports = mongoose.model('Post', PostSchema);
