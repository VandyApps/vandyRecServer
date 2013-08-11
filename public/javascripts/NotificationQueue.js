///////////////////////
//Notification Queue//
///////////////////////

/* Notification Queue is a javascript front-end Notification
management tool that works with toastr js to display notifications */

(function(global) {
	var NQ = {},
		settings = {
			timeInterval: 4500
		},
		notifications = [],
		interval,
		isRunning = false;

	global.NQ = NQ;
	if (!global.toastr) {
		throw new Error("Must import toastr before this file");
	}

	//helper function extend that performs shallow
	//copy of properties from obj1 to obj2
	function extend(obj1, obj2) {
		var prop;
		for (prop in obj1) {
			if (obj1.hasOwnProperty(prop)) {
				obj2[prop] = obj1[prop];
			}
		}
	}

	function next() {
		var nextNotification, type, message, correctType;
		if (notifications.length) {
			nextNotification = notifications[0];
			type = nextNotification.type.toLowerCase();
			message = nextNotification.message;
			correctType = /^((error)|(info)|(warning)|(success))$/i;

			if (type && correctType.test(type)) {
				toastr[type.toLowerCase()](message);
			}
			NQ.dequeue();
		}
			

	}

	

	NQ.settings = function(options) {
		if (options) {
			extend(options, settings);
		}
	};
	NQ.add = function() {
		var i, n;
		for (i =0, n = arguments.length; i < n; ++i) {
			this.enqueue(arguments[i]);
		}
	};

	NQ.enqueue = function(notification) {
		notifications.push(notification);
	};

	NQ.dequeue = function() {
		notifications.splice(0,1);
	}

	NQ.start = function() {
		if (!isRunning && notifications.length > 0) {
			isRunning = true;
			interval = setInterval(next, settings.timeInterval);
		}
		
	};

	NQ.stop = function() {
		if (isRunning) {
			isRunning = false;
			clearInterval(interval);
		}
			
	};



})(window);