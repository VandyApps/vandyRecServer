var db = require('../db');

exports.news = function(req, res) {
	db.newsCollection(function(collection) {
		res.send(collection);
	});
};

exports.groupFitness = function(req, res) {
	db.allGFObjects(function(err, collection) {
		res.send(collection);
	});
}