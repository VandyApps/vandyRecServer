var jsdom = require('jsdom');

exports.parseHTML = function(html, callback) {
	var document = jsdom.jsdom(html),
	    window = document.createWindow;

	jsdom.jQuerify(window, './public/javascripts/jQuery-ui/js/jquery-1.9.1.js', function() {
		console.log(window.$('body').html());
	});
};