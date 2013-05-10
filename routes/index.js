
/*
 * GET home page.
 */
exports.login= function(req, res) {
	res.render('login', {warning: ''});
};
exports.index = function(req, res) {
	var isValidLogin = false;
	if (isValidLogin) {
		res.render('index');
	} else {
		res.render('login', {warning: 'Your username or password is invalid.'})
	}
  	
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