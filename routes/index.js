
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
	var news;
	db.newsCollection(function(collection) {
		news = collection;
	});
	console.log(news);
	res.render('news', {news: news});

};
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