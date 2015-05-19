var express = require('express');
var router = express.Router();
var permission = require('./lib/permission');


/* import mongoose and all needed Models */
var mongoose = require('mongoose');
var Message = require('../models/Message.js');


/* routes for message */

// get all incoming messages INBOX
router.get('/inbox', function(req, res, next){
	Message.find({to: req.user._id, deletedAt: null})
		.select('_id to from subject body isRead createdAt')
		.deepPopulate(
			'to' +
			' from'
		)
		.exec(function(err, message){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(message);
		});
});


// get all outgoing messages OUTBOX
router.get('/outbox', function(req, res, next){
	Message.find({from: req.user._id, deletedAt: null})
		.select('_id to from subject body isRead createdAt')
		.deepPopulate(
			'to' +
			' from'
		)
		.exec(function(err, message){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(message);
		});
});


// get a specific message by id
router.get('/:id', permission.check, function(req, res, next){
	Message.find({_id: req.params.id})
		.select('_id to from subject body isRead createdAt')
		.deepPopulate(
			'to' +
			' from'
		)
		.exec(function(err, message){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(message);
		});
});


// ONLY FOR DEBUG AND DEVELOPMENT: get all categories
router.get('/debug/getall', function(req, res, next) {
	Message.find()
		.select('_id to from subject body isRead createdAt')
		.deepPopulate(
			'to' +
			' from'
		)
		.exec(function(err, message){
			if(err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(message);
		});
});


// create a message
router.post('/', function(req, res, next) {
	permitted_obj = permission.permitted_obj(req);
	permitted_obj.from = req.user._id;
	Message.create(permitted_obj, function (err, message) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(message);
	});
});


// update message, used to set isRead attribute
router.put('/:id', permission.check, function(req, res, next) {
	// toggle read/unread
	Message.findById(req.params.id, function (err, message) {
		if (err) return next(err);

		if(message.isRead){
			message.isRead = false;
		} else {
			message.isRead = true;
		}

		message.save(function(err){
			res.header("Content-Type", "application/json; charset=utf-8");
			if(err) {
				res.end("Error: Could not toggle the isRead attribute of message!");
			} else {
				res.json(message);
			}
		});
	});
});


// soft delete message by setting current date for deletedAt
router.delete('/:id', permission.check, function(req, res, next) {
	Message.findByIdAndUpdate(req.params.id, {deletedAt: Date.now()} , function (err, message) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(message);
	});
});


// ONLY FOR DEBUG AND DEVELOPMENT: delete a message by id */
router.delete('/debug/delete/:id', permission.check, function(req, res, next) {
	Message.findByIdAndRemove(req.params.id, req.body, function (err, message) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(message);
	});
});


module.exports = router;
