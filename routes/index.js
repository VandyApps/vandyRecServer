
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.news = function(req, res) {
	res.render('news');

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