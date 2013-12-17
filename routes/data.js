var db = require('../db'),
	path = require('path');

exports.news = function(req, res) {
	db.newsCollection(function(collection) {
		res.statusCode = 200;
		res.send(collection);
	});
};

exports.hours = function(req, res) {
	db.hoursCollection(function(collection) {
		res.statusCode = 200;
		res.send(collection);
	});
};

exports.groupFitness = function(req, res) {
	if (typeof req.query.type === 'undefined') {
		db.allGFObjects(function(err, collection) {
				res.statusCode = 200;
				res.send(collection);
			});
	} else if (req.query.type.toUpperCase() === 'GFCLASS') {
		if (typeof req.query.month === 'undefined' || req.query.year === 'undefined') {

			//need to change this to only send GFClass data
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
		db.GFSpecialDates(function(err, collection) {
			res.statusCode = 200;
			res.send(collection);
		});
	} else {
		res.statusCode = 409;
		res.send("Type parameter was not recognized by GET method, must be GFSpecialDate or GFClass");
	}
	
};

exports.intramurals = {};
exports.intramurals.get = {
	categories: function(req, res) {
		if (req.query.season) {
			db.intramurals.get.season(+req.query.season, function(err, collection) {
				res.send(collection);
			});
		} else {
			db.intramurals.get.categories(null, function(err, categories) {
				console.log(err);
				res.send(categories);
			});
		}
			
	},
	category: function(req, res) {
		db.intramurals.get.categories(path.basename(req.path), function(err, categories) {
			console.log(err);
			res.send(categories[0]);
		});
	},

	leagues: function(req, res) {
		var categoryId = req.path.split(path.sep)[3];
		
		db.intramurals.get.leagues(categoryId, null, function(err, leagues) {
			console.log(err);
			res.send(leagues);
		});

	},
	league: function(req, res) {
		var splitPath = req.path.split(path.sep),
			categoryId = splitPath[3],
			//this id is a 2 digit decimal number
			id = +splitPath[5];

		db.intramurals.get.leagues(categoryId, id, function(err, leagues) {
			res.send(leagues);
		});
	}

};

exports.intramurals.post = {
	categories: function(req, res) {
		if (req.user) {
			db.intramurals.insert.category(req.body, function(err, category) {
				if (err) {
					res.statusCode = 500;
					res.send(err);

				} else {
					res.statusCode = 200;
					res.send(category);
				}
			});
			
		} else {
			res.statusCode = 401;
			res.send("Forbidden access. Posting new data requires credentials");
		}
	},
	leagues: function(req, res) {
		var splitPath;
		if (req.user) {
			splitPath = req.path.split(path.sep);
			db.intramurals.insert.league(splitPath[3], req.body, function(err, league) {
				if (err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.statusCode = 200;
					res.send(league);
				}
			});
		} else {
			res.statusCode = 401;
			res.send("Forbidden access.  Posting new data requires credentials");
		}
	}
};

exports.intramurals.put = {
	category: function(req, res) {
		if (req.user) {
			db.intramurals.update.category(req.body, function(err, category) {
				if (err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.statusCode = 200;
					res.send(category);
				}
			});
		} else {
			res.statusCode = 401;
			res.send("Forbidden access.  Updating data requires credentials");
		}
	},
	league: function(req, res) {
		var splitPath;
		if (req.user) {
			splitPath = req.path.split(path.sep);
			db.intramurals.update.league(splitPath[3], req.body, function(err, league) {
				if (err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.statusCode = 200;
					res.send(league);
				}
			});

		} else {
			res.statusCode = 401;
			res.send("Forbidden access.  Updating data requires credentials");
		}
	}
};

exports.intramurals.delete = {
	category: function(req, res) {
		if (req.user) {
			var splitPath = req.path.split(path.sep),
				categoryId = splitPath[3];

			db.intramurals.delete.category(categoryId, function(err, sport) {
				if (err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.statusCode = 200;
					res.send(sport);
				}
				
			});
		} else {
			res.statusCode = 401;
			res.send("Forbidden access. Deleting data requires credentials");
		}
	},
	league: function(req, res) {
		var splitPath;
		if (req.user) {
			splitPath = req.path.split(path.sep);

			db.intramurals.delete.league(splitPath[3], +(splitPath[5]), function(err, id) {
				if (err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.statusCode = 200;
					res.send(id);
				}
			});
		} else {
			res.statusCode = 401;
			res.send("Forbidden access.  Deleting data requires credentials");
		}
	}
};
