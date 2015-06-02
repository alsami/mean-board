var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deepPopulate = require('mongoose-deep-populate');

var CategorySchema = new Schema({
	title: String,
	parent: {type: Schema.Types.ObjectId, ref: 'Category', default: null},
	categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
	threads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
	lastPost: {type: Schema.Types.ObjectId, ref: 'Post'},
	createdBy: {type: Schema.Types.ObjectId, ref: 'User', default: null},
	createdAt: {type: Date, default: Date.now},
	updatedBy: {type: Schema.Types.ObjectId, ref: 'User', default: null},
	updatedAt: {type: Date, default: Date.now},
	deletedAt: {type: Date, default: null}
});

CategorySchema.plugin(deepPopulate, {
	populate: {
		'parent' : {
			select: '_id title parent'
		},
		'parent.parent' : {
			select: '_id title'
		},
		'lastPost' : {
			select: '_id createdBy parent'
		},
		'lastPost.createdBy' : {
			select: '_id userName'
		},
		'lastPost.parent' : {
			select: '_id title'
		},
		'threads' : {
			select: '_id title lastPost posts'
		},
		'threads.lastPost' : {
			select: '_id createdBy createdAt'
		},
		'threads.lastPost.createdBy' : {
			select: '_id userName'
		},
		'categories' : {
			select: '_id title lastPost categories'
		},
		'categories.lastPost' : {
			select: '_id createdBy createdAt parent'
		},
		'categories.lastPost.createdBy' : {
			select: '_id userName'
		},
		'categories.lastPost.parent' : {
			select: '_id title'
		},
		'categories.categories' : {
			select: '_id title lastPost categories'
		},
		'categories.categories.lastPost' : {
			select: '_id createdBy createdAt parent'
		},
		'categories.categories.lastPost.createdBy' : {
			select: '_id userName'
		},
		'categories.categories.lastPost.parent' : {
			select: '_id title'
		}
	}
});

module.exports = mongoose.model('Category', CategorySchema);
