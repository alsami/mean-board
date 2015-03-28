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

CategorySchema.plugin(deepPopulate, {
	populate: {
		'parent': {
			select: '_id title'
		},
		'categories': {
			match: { deletedAt: null },
			select: '_id title categories'
		},
		'categories.categories': {
			match: { deletedAt: null },
			select: '_id title'
		},
		'threads': {
			match: { deletedAt: null },
			select: '_id title'
		},
		'lastPost': {
			select: 'updatedAt createdBy parent'
		},
		'lastPost.parent': {
			select: '_id title'
		}
	}
});

module.exports = mongoose.model('Category', CategorySchema);
