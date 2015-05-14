var express = require('express');
var router = express.Router();
var permission = require('./lib/permission');


/* import mongoose and all needed Models */
var mongoose = require('mongoose');
var Category = require('../models/Category.js');


/* routes for category */

// get all main categories
router.get('/', function(req, res, next){
	Category.find({parent: null, deletedAt: null})
		.select('_id title lastPost parent categories threads')
		.deepPopulate(
			'lastPost' +
			' lastPost.createdBy' +
			' lastPost.parent' +
			' threads' +
			' threads.lastPost' +
			' threads.lastPost.createdBy' +
			' categories' +
			' categories.lastPost' +
			' categories.lastPost.createdBy' +
			' categories.lastPost.parent' +
			' categories.categories' +
			' categories.categories.lastPost' +
			' categories.categories.lastPost.createdBy' +
			' categories.categories.lastPost.parent'
		)
		.exec(function(err, category){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(category);
		});
});

// get a specific category by id
router.get('/:id', function(req, res, next){
	Category.findById(req.params.id)
		.select('_id title lastPost parent categories threads')
		.deepPopulate(
			'parent' +
			' parent.parent' +
			' lastPost' +
			' lastPost.createdBy' +
			' lastPost.parent' +
			' threads' +
			' threads.lastPost' +
			' threads.lastPost.createdBy' +
			' categories' +
			' categories.lastPost' +
			' categories.lastPost.createdBy' +
			' categories.lastPost.parent' +
			' categories.categories' +
			' categories.categories.lastPost' +
			' categories.categories.lastPost.createdBy' +
			' categories.categories.lastPost.parent'
		)
		.exec(function(err, category){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(category);
		});
});

// create a category
router.post('/', function(req, res, next) {
	req.body.createdBy = req.user._id;
	Category.create(req.body, function (err, category) {
		if (err) return next(err);

		// if the new category has a parent we will register it
		if(category.parent !== null){
			Category.findByIdAndUpdate(category.parent, { $push: { categories: category}}, function(err, category){
				if(err) return next(err);
			});
		}

		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// update category by id
router.put('/:id', permission.check, function(req, res, next) {
	req.body.updatedBy = req.user._id;
	req.body.updatedAt = Date.now();
	Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// soft delete category by setting current date for deletedAt
router.delete('/:id', permission.check, function(req, res, next) {
	Category.findByIdAndUpdate(req.params.id, {deletedAt: Date.now()} , function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// ONLY FOR DEBUG AND DEVELOPMENT: get all categories
router.get('/debug/getall', function(req, res, next) {
	Category.find(function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// ONLY FOR DEBUG AND DEVELOPMENT: delete a category by id */
router.delete('/debug/delete/:id', function(req, res, next) {
	Category.findByIdAndRemove(req.params.id, req.body, function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

module.exports = router;
