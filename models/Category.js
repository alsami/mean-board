var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate');

var CategorySchema = new Schema({
	title: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Category', default: null},
	categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
	threads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
	lastPost: {type: Schema.Types.ObjectId, ref: 'Post'},
	deletedAt: {type: Date, default: null}
});

CategorySchema.plugin(deepPopulate, {});

module.exports = mongoose.model('Category', CategorySchema);
