var GFModel = {};

GFModel.FitnessClass = Backbone.Model.extend({

	//this property is used by other web clients 
	//to differentiate between models of this type
	//and models of other types when retrieving
	//JSON data
	type: 'GFClass',
	//timeRange is in the form 12:30pm - 1:30pm
	//note that there is no spaces in between a single
	//time elements but there is a space-dash-space between 
	//two different time elements
	timeRange: '',

	//timeRange is in the process of becoming deprecated and
	//replaced by these two properties
	startTime: '',
	endTime: '',

	//an array of dateStrings for dates where the classes have been
	//cancelled.  The classes that have been cancelled are still retreived
	//from methods such as isOnDay
	canceledDates: [],

	instructor: '',
	className: '',
	idAttribute: '_id',
	//url for POST and PUT
	url: '/groupFitness', 
	//0-based index of the day of the week that this class is in
	dayOfWeek: 0,

	//if the class is a 1-time occurence, then 
	//the start and end dates are the same
	//if the class keeps going, then the end date is blank
	startDate: '',
	endDate: '',

	//defaults to false
	specialDateClass: false,
	
	initialize: function(modelData) {
		this.set('timeRange', modelData.timeRange);
		this.set('instructor', modelData.instructor);
		this.set('dayOfWeek', modelData.dayOfWeek);
		this.set('startDate', modelData.startDate);
		this.set('endDate', modelData.endDate);
		this.set('startTime', modelData.startTime);
		this.set('endTime', modelData.endTime);

		if (typeof modelData.canceledDates !== 'undefined') {
			this.set('canceledDates', modelData.canceledDates);
		}

		if (typeof modelData.specialDateClass !== 'undefined') {
			this.set('specialDateClass', modelData.specialDateClass);
		}
	},
	//dateString in the format MM/DD/YYYY
	//where month is 1-based indexed
	isOnDay: function(year, monthIndex, day) {

		var date = new Date(year, monthIndex, day, 0,0,0,0);

		if (date.getDay() !== this.get('dayOfWeek') ) {
			return false;
		}

		//check if the date is before the start date
		if (DateHelper.earlierDate(date, this.getStartDate()) && !DateHelper.equalDates(date, this.getStartDate())) {
			return false;
		}

		//check if the date is after the end date
		if (typeof this.getEndDate() !== 'undefined' && DateHelper.earlierDate(this.getEndDate(), date) && !DateHelper.equalDates(this.getEndDate(), date)) {
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
	isRepeating: function() {
		if (typeof this.getEndDate() === 'undefined') {
			return true;
		}
		//repeating if the start and end dates are different and the end date is less than 1 week 
		//greater than the start date
		if ((this.getStartDate().getTime() + (7 * 24 * 60 * 60 * 1000)) > this.getEndDate().getTime()) {
			return false;
		}
		return true;
	},
	//takes a parameters of a date and sets the date range
	//so that the end date is before the date passed in
	//does not do anything if the date passed in is before the 
	//starting date.  Also removes the date that is passed in
	//returns a js object that has the same variables as the 
	//fitnessClass object but with the end date 1 week after 
	//the date being deleted, which can be used to create 
	//another fitnessClass if needed
	//with the return date as a start date.  Returns undefined if 
	//there is not valid date after the sliced date, and the sliced
	//date was the last date.  Returns undefined if the sliceDate is 
	//not in between the start and end dates
	slice: function(sliceDate) {
		//check if slice date is out of range of the start and end dates
		if ((typeof this.getEndDate() !== 'undefined' && !DateHelper.betweenDates(sliceDate, this.getStartDate(), this.getEndDate())) || (typeof this.getEndDate() === 'undefined' && DateHelper.earlierDate(sliceDate, this.getStartDate()) ) ) {
			return undefined;
		}

		if (!DateHelper.equalDates(sliceDate, this.getStartDate())) {

	
			//make sure that the slice date is of the same day of the week
			//and has no time value
			var dateChanged = false;
			while (sliceDate.getDay() !== this.getWeekDay()) {
				sliceDate.setDate(sliceDate.getDate() - 1);
				dateChanged = true;
			}
			DateHelper.dateWithEmptyTime(sliceDate);

			var returnUndefined = false;
			if (typeof this.getEndDate() !== 'undefined' && DateHelper.equalDates(sliceDate, this.getEndDate())) {
				returnUndefined = true;
			}

			//only reduce the date further if the slice date was not adjusted 
			//to match the day of the week
			if (!dateChanged) {
				sliceDate.setDate(sliceDate.getDate() - 7);
			}
			
			var startDateFactor;
			if (!dateChanged) {
				startDateFactor = 14;
			} else {
				startDateFactor = 7;
			}
			//construct date string and set it to end date
			var oldEndDate = this.get('endDate');
			this.set('endDate', DateHelper.dateStringFromDate(sliceDate));

			//save the new value of this class
			//should call PUT
			this.save({
				success: function() {console.log("saved");},
				error: function() {console.log("something went wrong");}
			});
			if (returnUndefined) {

				return undefined;
			} else {
				//create the return object
				var objectToReturn = {};
				objectToReturn.className = this.getClassName();
				objectToReturn.instructor = this.getInstructor();
				objectToReturn.timeRange = this.get('timeRange');
				//set the start date as the next valid date after the sliced date
				objectToReturn.startDate = DateHelper.dateStringFromDate(new Date(sliceDate.getTime() + (startDateFactor * 24 * 60 * 60 * 1000)));
				//set the end date on the return object as the old end date
				objectToReturn.endDate = oldEndDate;
				objectToReturn.dayOfWeek = this.getWeekDay();
				return objectToReturn;
			}

		} else {
			//should call destroy
			var that = this;
			console.log("deleting an element");
			this.destroy({
				headers: {_id: that.id }
			});
		}

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
		if (typeof this.get('endDate') === 'undefined' || this.get('endDate') === '*') {
			return undefined;
		}
		var endDateArray = this.get('endDate').split('/');
		return new Date(parseInt(endDateArray[2],10), parseInt(endDateArray[0]-1, 10), parseInt(endDateArray[1],10), 0, 0 , 0, 0);
	}

});

//set of all classes within a given month
//used to put classes into views displayed to user
GFModel.FitnessClasses = Backbone.Collection.extend({
	model: GFModel.FitnessClass,
	idAttribute: '_id',
	url: function() {
		
		return '/JSON/GF?month='+this.month+'&year='+this.year;
	},
	//index of the month,
	//0-based index
	month: 0,
	//full year i.e. 2013
	year: 0, 

	//first weekday of the month
	//0=sunday, 6=saturday
	firstWeekDay: 0,
	//last weekday of the month
	lastWeekDay: 0,

	//these are dates that are specified for unique scheduling
	//all normal classes that are held are removed from these
	//dates and new classes can be created on these dates that
	//are not held at any other time
	//there should never be two special dates that overlap
	specialDates: [],
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
		var newFitnessClass = new GFModel.FitnessClass({
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
			error: function(collection) {alert("Error when saving fitness class data to the server")}
		});
	},
	parse: function(response) {
		console.log(response);
		return response;
	}


});

