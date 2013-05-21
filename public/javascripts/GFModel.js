

var FitnessClass = Backbone.Model.extend({

	//timeRange is in the form 12:30pm - 1:30pm
	//note that there is no spaces in between a single
	//time elements but there is a space-dash-space between 
	//two different time elements
	timeRange: '',
	instructor: '',
	className: '',
	//url for POST and PUT
	url: '/groupFitness', 
	//0-based index of the day of the week that this class is in
	dayOfWeek: 0,

	//if the class is a 1-time occurence, then 
	//the start and end dates are the same
	//if the class keeps going, then the end date is blank
	startDate: '',
	endDate: '',
	
	initialize: function(modelData) {
		this.set('timeRange', modelData.timeRange);
		this.set('instructor', modelData.instructor);
		this.set('dayOfWeek', modelData.dayOfWeek);
		this.set('startDate', modelData.startDate);
		this.set('endDate', modelData.endDate);
	},
	//dateString in the format MM/DD/YYYY
	//where month is 1-based indexed
	isOnDay: function(year, monthIndex, day) {

		var date = new Date(year, monthIndex, day, 0,0,0,0);

		if (date.getDay() !== this.get('dayOfWeek') ) {
			return false;
		}

		//check if the date is after the end date
		if (typeof this.getEndDate() !== 'undefined' && DateHelper.earlierDate(this.getEndDate(), date)) {
			return false;
		}

		//check if the date is before the start date
		if (DateHelper.earlierDate(date, this.getStartDate())) {
			return false;
		}

		return true;

	},
	
	//returns the day of the week the class exists
	getWeekDay: function() {
		return this.get('dayOfWeek');
	},
	getClassName: function() {
		return this.get('className');
	},
	getInstructor: function() {
		return this.get('instructor');
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
			return undefined;
		}
		var startDateArray = this.get('startDate').split('/');
		//convert month from 1-based to 0-based indexing when 
		//representing as date
		return new Date(parseInt(startDateArray[2],10), parseInt(startDateArray[0]-1, 10), parseInt(startDateArray[1],10), 0, 0 , 0, 0);
	},
	//converts the string into a javascript date object
	//before returning the value
	getEndDate: function() {
		if (typeof this.get('endDate') === 'undefined' || this.getEndDate === '*') {
			return undefined;
		}
		var endDateArray = this.get('endDate').split('/');
		return new Date(parseInt(endDateArray[2],10), parseInt(endDateArray[0]-1, 10), parseInt(endDateArray[1],10), 0, 0 , 0, 0);
	}

});

//set of all classes within a given month
//used to put classes into views displayed to user
var FitnessClasses = Backbone.Collection.extend({
	model: FitnessClass,
	idAttribute: '_id',
	url: function() {
		
		return '/JSON/GF?month='+this.month+'&year='+this.year;
	},
	//index of the month
	month: 0,
	//full year i.e. 2013
	year: 0, 

	//first weekday of the month
	//0=sunday, 6=saturday
	firstWeekDay: 0,
	//last weekday of the month
	lastWeekDay: 0,

	initialize: function(options) {
		this.month = options.month;
		this.year = options.year;
	},
	//get all the classes that are on a particular day
	//day is the day of the month, 1-based indexing, 2 is the second
	//day of the month, does nothing if the day passed in 
	//is out of the bounds for the days of a month
	//returns an array of the models on that particular day
	getClassesForDay: function(day) {
		var collection = this;
		var classes = [];
		this.forEach(function(fitnessClass) {
			
			if (fitnessClass.isOnDay(collection.year, collection.month, day)) {
				
				classes.push(fitnessClass);
			}
		});
		return classes;
	},
	//increments the date by a month and resets the models in the 
	//collection to correspond with the new month
	incrementMonth: function() {
		this.month+= 1;
		if (this.month > 11) {
			this.month = 0;
			this.year += 1;
		}
		this.fetch({reset: true});
	},
	//decrements the month and seeks for new models using url query
	decrementMonth: function() {
		this.month -= 1;
		if (this.month < 0) {
			this.month = 11;
			this.year -=1;
		}
		this.fetch({reset: true});
	},
	addNewClass: function(data) {
		//create
		var newFitnessClass = new FitnessClass({
			className: data.className, 
			timeRange: data.timeRange,
			startDate: data.startDate,
			endDate: data.endDate,
			dayOfWeek: data.dayOfWeek,
			instructor: data.instructor
		});
		//add to server side database
		//call post
		newFitnessClass.save();
		//fetch data, no need to reset because month has not
		//changes
		this.fetch({
			success: function(collection) {console.log("success: " + JSON.stringify(collection))},
			error: function(collection) {console.log("error: " + JSON.stringify(collection))}
		});
	}


});

