

window.FitnessClass = Backbone.Model.extend({

	//timeRange is in the form 12:30pm - 1:30pm
	//note that there is no spaces in between a single
	//time elements but there is a space-dash-space between 
	//two different time elements
	timeRange: '',

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
	startDate: '',
	endDate: '',

	//an array of dates that are exceptions to the date range
	exceptionDates: [],
	
	//dateString in the format MM/DD/YYYY
	//where month is 1-based indexed
	isOnDay: function(year, monthIndex, day) {
		var date = new Date(year, monthIndex, day, 0,0,0,0);
		if (date.getDay() !== this.get('dayOfWeek')) {
			return false;
		}

		//check if the date is after the end date
		if (typeof this.getEndDate() !== 'undefined' && DateHelper.earlierDate(this.getEndDate(), date) {
			return false;
		}

		//check if the date is before the start date
		if (DateHelper.earlierDate(date, this.getStartDate())) {
			return false;
		}

		//check if the date is an exception date
		if (this.isExceptionDate(date)) {
			return false;
		}

		return true;

	},
	//returns the day of the week the class exists
	getDayOfWeek: function() {
		return this.get('dayofWeek');
	},
	//takes a parameters of a date and sets the date range
	//so that the end date is before the date passed in
	//does not do anything if the date passed in is before the 
	//starting date.  Also removes the date that is passed in
	sliceFitnessDates: function(sliceDate) {

	},
	//converts the string into a javascript date object
	//before returning the value
	getStartDate: function() {
		if (typeof this.get('startDate') === 'undefined') {
			return 'undefined';
		}
		var startDateArray = this.get('startDate').split('/');
		//convert month from 1-based to 0-based indexing when 
		//representing as date
		return new Date(parseInt(startDateArray[2],10), parseInt(startDateArray[0]-1, 10), parseInt(startDateArray[1],10), 0, 0 , 0, 0);
	},
	//converts the string into a javascript date object
	//before returning the value
	getEndDate: function() {
		if (typeof this.get('endDate') === 'undefined') {
			return 'undefined';
		}
		var endDateArray = this.get('endDate').split('/');
		return new Date(parseInt(endDateArray[2],10), parseInt(endDateArray[0]-1, 10), parseInt(endDateArray[1],10), 0, 0 , 0, 0);
	},
	//date string is in the format: MM/DD/YYYY
	addExceptionDate: function(dateString) {
		//lazy instantiation
		if (typeof this.get('exceptionDates') === 'undefined') {
			this.set('exceptionDates', []);
		}
		this.get('exceptionDates').push(dateString);
	},
	//date string is in the format: MM/DD/YYYY
	//returns true if the date string represents
	//one of the dates in the exception date
	//can either pass in a dateString of the 
	//format MM/DD/YYYY or an actual date object
	isExceptionDate: function(date) {
		var dateString;
		if (typeof date === 'string') {
			dateString = date;
		} else if (typeof date === 'object') {
			var monthString;
			var dayString;

			//convert month for 0-based to 1-based
			//when representing date as string
			if (date.getMonth()+1 < 10) {
				monthString = '0'+(date.getMonth()+1);
			} else {
				monthString = date.getMonth().toString();
			}

			if (date.getDate() < 10) {
				dayString = '0'+date.getDate();
			} else {
				dayString = date.getDate().toString();
			}

			dateString = monthString+'/'+dayString+'/'+ (date.getYear()+1900);
			console.log(dateString);
		} else {
			return new Error('Invalid parameter for the function isExceptionDate');
		}

		for (var index in this.get('exceptionDates')) {
			if (dateString === this.get('exceptionDates')[index]) {
				return true;
			}
		}
		return false;
	}

});


//all the fitness classes that are available
//used for retrieving and posting classes to and
// from the server as well as giving classes to 
//smaller collections
var FitnessClasses = Backbone.Collection.extend({
	model: FitnessClass,
	url: '/JSON/GF',
	//earliest month and year of any class
	firstMonth: 0,
	firstYear: 0,
	//latest month and year of any class
	lastMonth: 0,
	lastYear: 0,

	getClassesForMonthAndYear: function(monthIndex, year) {

	} 
});

window.fitnessClasses = new FitnessClasses();

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

