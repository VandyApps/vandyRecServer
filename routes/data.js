var db = require('../db');

exports.news = function(req, res) {
	db.newsCollection(function(collection) {
		res.send(collection);
	});
};

exports.groupFitness = function(req, res) {
	if (typeof req.query.month === 'undefined' || req.query.year === 'undefined') {

		db.allGFObjects(function(err, collection) {
			res.send(collection);
		});
	} else {
		var monthIndex = parseInt(req.query.month,10);
		var year = parseInt(req.query.year, 10);
		db.GFObjectsForDates(monthIndex, year, function(err, collection) {
			res.send(collection);
		});
	}
	
}