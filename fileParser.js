var jsdom = require('jsdom');


exports.parseHTML = function(html, callback) {
	var document = jsdom.jsdom(html),
	    window = document.createWindow();

	jsdom.jQueryify(window, './public/jQuery-ui/js/jquery-1.9.1.js', function() {
		console.log("Inside callback of jqueryify");
		console.log(window.$('body').html());
		callback();
	});
};
