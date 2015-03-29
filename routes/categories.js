var express = require('express');
var router = express.Router();


/* import mongoose and all needed Models */
var mongoose = require('mongoose');
var Category = require('../models/Category.js');


/* routes for category */

// get all main categories
router.get('/', function(req, res, next){
	Category.find({parent: null, deletedAt: null})
		.select('_id title categories threads')
		.deepPopulate('categories.lastPost.parent categories.categories.lastPost.parent threads.lastPost')
		.exec(function(err, category){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(category);
		});
});

// get a specific category by id
router.get('/:id', function(req, res, next){
	Category.findById(req.params.id)
		.select('parent _id title categories threads')
		.deepPopulate('parent categories.lastPost.parent categories.categories.lastPost.parent threads')
		.exec(function(err, category){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(category);
		});
});

// create a category
router.post('/', function(req, res, next) {
	Category.create(req.body, function (err, category) {
		if (err) return next(err);

		// if the new category has a parent we will register it
		if(category.parent !== null){
			console.log("has a parent");
			Category.findByIdAndUpdate(category.parent, { $push: { categories: category}}, function(err, category){
				if(err) return next(err);
			});
		}

		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// update category by id
router.put('/:id', function(req, res, next) {
	Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(category);
	});
});

// soft delete category by setting current date for deletedAt
router.delete('/:id', function(req, res, next) {
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
