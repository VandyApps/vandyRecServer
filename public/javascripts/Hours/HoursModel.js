var HoursModel = {};
HoursModel.Hours = Backbone.Model.extend({

	//properties
	name: '',
	startDate: '',
	endDate: '',
	priorityNumber: 0,
	facilityHours: false,
	closedHours: false,
	times: [],

	//methods
	initialize: function(options) {
		var defaultTimeObject = {startTime: '12:00am', endTime: '1:00am'},
		    noOptions = (options === undefined),
		    name = (noOptions || options.name === undefined) ? '' : options.name,
		    startDate = (noOptions || options.startDate === undefined) ? '' : options.startDate,
		    endDate = (noOptions || options.endDate === undefined) ? '' : options.endDate,
		    priorityNumber = (noOptions || options.priorityNumber === undefined) ? 0 : options.priorityNumber,
		    facilityHours = (noOptions || options.facilityHours === undefined) ? false : options.facilityHours,
		    closedHours = (noOptions || options.closedHours === undefined) ? false : options.closedHours,
		    times = options.times || [];
		    if (times.length === 0 && startDate !== '' && endDate !== '') {
		    	//set blank objects for all valid days
		    }


		this.set('name', name);
		this.set('startDate', startDate);
		this.set('endDate', endDate);
		this.set("facilityHours", facilityHours);
                this.set('priorityNumber', priorityNumber);
		this.set('closedHours', closedHours);
		this.set('times', times);
	},
	getName: function() {
		return this.get('name');
	},
	getStartDate: function() {
		return DateHelper.dateFromDateString(this.get('startDate'));
	},
	getEndDate: function() {
		return DateHelper.dateFromDateString(this.get('endDate'));
	},
	getPriorityNumber: function() {
		return this.get('priorityNumber');
	},
	getTimeObjectForDay: function(weekDay) {
		var timesArray = this.get('times'), timeObject = null;
		if (timesArray.length > weekDay && timesArray[weekDay] !== undefined) {
			
			timeObject = timesArray[weekDay];
		} 
		return timeObject;
	},
	isFacilityHours: function() {
		return this.get('facilityHours');
	},
	isClosed: function() {
		return this.get('closedHours');
	},
	setTimesForDay: function(weekDay, timeObject) {
		if (timeObject.startTime !== undefined && timeObject.endTime !== undefined) {
			if (DateHelper.isTimeString(timeObject.startTime) && DateHelper.isTimeString(timeObject.endTime)) {
				this.get('times')[weekDay] = timeObject;
			}
		}
	},
	isBaseHours: function() {
		return this.getPriorityNumber() === 0 && this.isFacilityHours();
	},
	configureTimes: function() {
		//uses the start and end time of the array
		//this method does nothing if the start or end times are not set
		var startDate = this.get('startDate'),
		    endDate = this.get('endDate'),
		    times = this.get('times'),
		    defaultObj = {startTime: '12:00am', endTime: '01:00am'},
		    loopDone, endDateFound, 
		    firstIteration, i;

		if ((startDate && startDate !== '') && (endDate && endDate !== '')) {

			if ((this.getEndDate().getTime() - this.getStartDate().getTime()) / (24*60*60*1000) >= 6) {
				//then all the days of the week are represented
				for (i = 0; i < 7; ++i) {
					if (!times[i]) {
						times[i] = defaultObj;
					}
				}

			} else {
				
				//there are days of the week that should not be represented
				for (i = this.getStartDate().getDay(), firstIteration = true, endDateFound = false, loopDone = false; !loopDone; i = (i+1) % 7) {
					
					if (i === this.getStartDate().getDay() && !firstIteration) {

						loopDone = true;
					} else {

						if (!endDateFound && !times[i]) {

							times[i] = defaultObj;

						} else if (endDateFound) {
							times[i] = undefined;
						}

						if (i === this.getEndDate().getDay()) {
							
							endDateFound = true;
						}
						

						firstIteration = false;
						
					}
					
				}
			}

		}
	},
	iterateTimes: function(callback, context) {
		var i, n, 
		    times = this.get('times'), 
		    context = context || this;

		for (i = 0, n = times.length; i < n; ++i) {
			if (times[i]) {
				callback.call(context, times[i], i);
			}
		}
	}
});


HoursModel.HoursCollection = Backbone.Collection.extend({
	model: HoursModel.Hours,
	url: '/JSON/hours',

	getBaseHours: function() {
		return [].filter.call(this.models, function(model) {
			return model.isBaseHours();
		}).sort(function(model1, model2) {
			return model2.getStartDate().getTime() - model1.getStartDate().getTime();
		});
	},
	getOtherHours: function(facilityHours) {
		//if facility hours is undefined, then
		//just filter the selection based on 
		//whether the hours are closed and whether
		//they are base hours
		if (facilityHours === undefined) {
			return [].filter.call(this.models, function(model) {
				return !model.isBaseHours() && !model.isClosed();
			}).sort(function(model1, model2) {
				return model2.getStartDate().getTime() - model1.getStartDate().getTime();
			});
		}
		//otherwise, use the facilityHours boolean value to further
		//filter the selection beyong just baseHours and isClosed
		return [].filter.call(this.models, function(model) {
			return !model.isBaseHours() && !model.isClosed() && (facilityHours === model.isFacilityHours());
		}).sort(function(model1, model2) {
			return model2.getStartDate().getTime() - model1.getStartDate().getTime();
		});
	},
	getClosedHours: function() {
		return [].filter.call(this.models, function(model) {
			return model.isClosed();
		}).sort(function(model1, model2) {
			return model1.getStartDate().getTime() - model2.getStartDate().getTime();
		});
	}
});

//global variables related to
//the model are defined here
