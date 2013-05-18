

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
	sliceFitnessDates: function(sliceDate) {

	}

});


//all the fitness classes that are available
//used for retrieving and posting classes to and
// from the server as well as giving classes to 
//smaller collections
var FitnessClasses = Backbone.Collection.extend({
	model: FitnessClass,

	//earliest month and year of any class
	firstMonth: 0,
	firstYear: 0,
	//latest month and year of any class
	lastMonth: 0,
	lastYear: 0,

	getClassesForMonthAndYear: function(monthIndex, year) {

	} 
});

//set of all classes within a given month
//used to put classes into views displayed to user
var FitnessClassesByMonth = Backbone.Collection.extend({
	model: FitnessClass,

	//index of the month
	month: 0,
	//full year i.e. 2013
	year: 0, 

	//first weekday of the month
	//0=sunday, 6=saturday
	firstWeekDay: 0,
	//last weekday of the month
	lastWeekDay: 0,
	//get all the classes that are on a particular day
	//day is the day of the month, 1-based, 2 is the second
	//day of the month, does nothing if the day passed in 
	//is out of the bounds for the days of a month
	//returns an array of the models on that particular day
	getClassesForDay: function(day) {

	}


});

