var db = require('../db');

exports.news = function(req, res) {
	db.newsCollection(function(collection) {
		res.send(collection);
	});
};