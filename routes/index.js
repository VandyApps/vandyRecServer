
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

exports.updateNews = function(req, res) {
	console.log(req.body);
	res.send('nothing to send yet');
};


exports.deleteNews = function(req, res) {
	console.log('delete method on server was called');
	console.log(req.body);
	res.send('nothing to send yet');
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