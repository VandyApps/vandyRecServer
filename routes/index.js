
/*
 * GET home page.
 */

var db = require('../db');

exports.index = function(req, res) {
	if (typeof req.user !== 'undefined') {
		if (typeof req.query.entry !== 'undefined') {
			res.render('index', {tabIndex: parseInt(req.query.entry, 10)});
		} else {
			res.render('index', {tabIndex: 0});
		}
		
	} else {
		res.redirect('/login');
	}
	
  	
};

exports.login = function(req, res) {
	if (typeof req.query.failed !== 'undefined' && req.query.failed === 'true') {
		res.render('login', {warning: 'Incorrect Login Credentials'});
	} else {
		res.render('login', {warning: ''});	
	}
	
	
};


exports.news = function(req, res) {
	if (typeof req.user !== 'undefined') {
		res.redirect('/');	
	} else {
		res.redirect('/login');
	}
	
};

exports.createNews = function(req, res) {
	console.log(req.body);
	db.addNewsElement(req.body, function(err, result) {
		
		if (!err) {
			res.statusCode = 200;
			res.send(JSON.stringify(result));
		} else {
			res.statusCode = 500;
			res.send(null);
		}
		
	});
	
};

exports.updateNews = function(req, res) {
	console.log(req.body);
	db.updateNewsElement(req.body, function(err, doc) {
		if (!err) {
			res.statusCode = 200;
			res.send(JSON.stringify(doc));
		} else {
			res.statusCode = 500;
			res.send(null);
		}
	});
	
};


exports.deleteNews = function(req, res) {
	//should return _id of the element that was deleted
	var removedDoc = db.removeNewsElementWithID(req.headers._id, function(err, deletedID) {

		if (err || typeof deletedID === null) {
			res.statusCode = 500;
			res.send(new Error("failed to remove document"));
		} else {
			res.statusCode = 200;
			res.send({_id: deletedID});
		}
	});
	

};

//hours methods
exports.hours = function(req, res) {
	if (typeof req.user !== 'undefined') {
		res.redirect('/?entry=1')
	} else {
		res.redirect('/login');
	}
	
};


//traffic methods 
exports.traffic = function(req, res) {
	if (typeof req.user !== 'undefined') {
		res.redirect('/?entry=2');
	} else {
		res.redirect('/login');
	}
	
};



//group fitness methods
exports.groupFitness = function(req, res) {
	if (typeof req.user !== 'undefined') {
		res.redirect('/?entry=3');
	} else {
		res.redirect('/login');
	}
	
};

exports.updateGF = function(req, res) {

	var data = req.body;
	//add data that can be used for server side querying
	var startDateArray = data.startDate.split('/');
	data.SD_monthCount = (parseInt(startDateArray[2], 10) -1970) * 12 + (parseInt(startDateArray[0], 10) - 1);
	if (data.endDate === '*') {
		//monthCount of 0 indicates that it goes infinitely
		data.ED_monthCount = 0;
	} else {
		var endDateArray = data.endDate.split('/');
		data.ED_monthCount = (parseInt(endDateArray[2], 10) - 1970) * 12 + (parseInt(endDateArray[0], 10) - 1);
	}

	db.updateGFObject(data, function(err, doc) {
		if (err) {
			res.statusCode = 500;
			res.send(err);
		} else {
			res.statusCode = 200;
			res.send(doc);
		}
	});
}
exports.createGF = function(req, res) {

	var data = req.body;

	//add data that can be used for server side querying
	var startDateArray = data.startDate.split('/');
	data.SD_monthCount = (parseInt(startDateArray[2], 10) -1970) * 12 + (parseInt(startDateArray[0], 10) - 1);
	if (data.endDate === '*') {
		//monthCount of 0 indicates that it goes infinitely
		data.ED_monthCount = 0;
	} else {
		var endDateArray = data.endDate.split('/');
		data.ED_monthCount = (parseInt(endDateArray[2], 10) - 1970) * 12 + (parseInt(endDateArray[0], 10) - 1);
	}
	db.insertGFObject(data, function(err, document) {
		res.statusCode = 200;
		res.send(document);
	});
}

exports.deleteGF = function(req, res) {
	db.deleteGFObjectWithID(req.headers._id, function(err, id) {

		if (err) {
			res.statusCode = 500;
			res.send({error: new Error("Could not delete element")});
		} else {
			res.statusCode = 200;
			res.send({id: id});
		}
		
	});
}

//intramurals methods
exports.intramurals = function(req, res) {
	if (typeof req.user !== 'undefined') {
		res.redirect('/?entry=4');
	} else {
		res.redirect('/login');
	}
	
};


//programs method
exports.programs = function(req, res) {
	if (typeof req.user !== 'undefined') {
		res.redirect('/?entry=5');
	} else {
		res.redirect('/login');
	}
	
};


//serves raw ejs files for jQuery tabs
exports.newsRaw = function(req, res) {
	res.render('news');
};
exports.hoursRaw = function(req, res) {
	res.render('hours');
};
exports.trafficRaw = function(req, res) {
	res.render('traffic');
};
exports.groupFitnessRaw = function(req, res) {
	res.render('groupFitness');
};
exports.intramuralsRaw = function(req, res) {
	res.render('intramurals');
};
exports.programsRaw = function(req, res) {
	res.render('programs');
};