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

// TODO:It ist possible to use an filter object for deepPopulate
// {
//	populate: {
//		'path': {
//			match: { attribute: value },
//			select: 'attribute1 atrribute2 ...'
//		}, ...
//	}
//}

module.exports = mongoose.model('Category', CategorySchema);
