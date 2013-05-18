

window.FitnessClass = Backbone.Model.extend({

	//time in military time, 1200 is 12 pm, 1330, is 1:30 pm
	//make sure end time is greater than start time
	startTime: 0, 
	endTime: 0,
	instructor: '',
	className: '',
	//0-based index of the day of the week that this class is in
	dayOfWeek: 0,

	//all dates should be dates with zeroed out time
	//so the time is all set to 12:00:00 am of that day
	//for simplicity

	//if the class is a 1-time occurence, then 
	//the start and end dates are the same
	//if the class keeps going, then the end date is blank
	startDate: null,
	endDate: null,

	//an array of dates that are exceptions to the date range
	exceptionDates: [],
	//returns true if the class exists within a given month
	//takes parameter of month index, where 0 is January, 11 is December
	isInMonth: function(monthIndex) {

	},
	//returns true if the class exists on a given day
	//takes a parameter of the day, which is 1-based, 
	//so 2 is the second of a month
	isOnDay: function(day) {

	},
	//returns the day of the week the class exists
	getDayOfWeek: function() {

	},
	//takes a parameters of a date and sets the date range
	//so that the end date is before the date passed in
	//does not do anything if the date passed in is before the 
	//starting date
	sliceFitnessDates: function(date) {

	}

});