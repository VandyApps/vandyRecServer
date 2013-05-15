
/*
 * GET home page.
 */

var db = require('../db');

exports.login = function(req, res) {
	res.render('login', {warning: ''});
	
};

exports.loginError = function(req, res) {
	res.render('login', {warning: 'Login attempt failed due to incorrect credentials'});
};
exports.index = function(req, res) {
	res.render('index');
  	
};

exports.news = function(req, res) {
	db.newsCollection(function(collection) {
		console.log(collection);
		res.render('news', {news: JSON.stringify(collection)});
	});
};

exports.createNews = function(req, res) {
	console.log(req.body);
	db.addNewsElement(req.body, function(err, result) {
		
		if (!err) {
			res.send(result);
		} else {
			res.send(null);
		}
		
	});
	
};

exports.updateNews = function(req, res) {
	//model should have an _id that already exists
	console.log(req.body);
	res.send('nothing to send yet');
};


exports.deleteNews = function(req, res) {
	//should return JSON serialization of the element that was deleted to indicate
	//a successful deletion
	var removedDoc = db.removeNewsElementWithID(req.headers._id, function(err, deletedID) {

		if (err || typeof deletedID === null) {
			
			res.send(new Error("failed to remove document"));
		} else {
			
			res.send({_id: deletedID});
		}
	});
	

}
exports.hours = function(req, res) {

	res.render('hours')
};

exports.intramurals = function(req, res) {

	res.render('intramurals')
};

exports.groupFitness = function(req, res) {

	res.render('groupFitness');
};

exports.traffic = function(req, res) {

	res.render('traffic');
};

exports.programs = function(req, res) {

	res.render('programs');
};