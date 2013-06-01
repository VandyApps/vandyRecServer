var db = require('../db');

exports.news = function(req, res) {
	db.newsCollection(function(collection) {
		res.statusCode = 200;
		res.send(collection);
	});
};

exports.groupFitness = function(req, res) {
	if (req.query.type.toUpperCase() === 'GFCLASS') {
		if (typeof req.query.month === 'undefined' || req.query.year === 'undefined') {

			db.allGFObjects(function(err, collection) {
				res.statusCode = 200;
				res.send(collection);
			});
		} else {
			var monthIndex = parseInt(req.query.month,10);
			var year = parseInt(req.query.year, 10);
			//calculate the month for the value passed in
			var monthCount = (year - 1970) * 12 + monthIndex; 
			console.log(monthCount);
			db.GFClassesForDates(monthCount, function(err, collection) {
				res.statusCode = 200;
				res.send(collection);
			});
		}
	} else if (req.query.type.toUpperCase() === 'GFSPECIALDATE') {

	}
	
}