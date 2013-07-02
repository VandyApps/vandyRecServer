var HoursModel = {};


HoursModel.Hours = (function () {

	//method implementations
	function initialize(options) {
		var defaultTimeObject = {startTime: '12:00am', endTime: '1:00am'},
		    name = (!options || options.name === undefined) ? '' : options.name,
		    startDate = (!options || options.startDate === undefined) ? '' : options.startDate,
		    endDate = (!options || options.endDate === undefined) ? '' : options.endDate,
		    priorityNumber = (!options || options.priorityNumber === undefined) ? 0 : options.priorityNumber,
		    facilityHours = (!options || options.facilityHours === undefined) ? false : options.facilityHours,
		    closedHours = (!options || options.closedHours === undefined) ? false : options.closedHours,
		    times = options.times || [];
		    
		    configureTimes.call(this);


		this.set('name', name);
		this.set('startDate', startDate);
		this.set('endDate', endDate);
		this.set("facilityHours", facilityHours);
                this.set('priorityNumber', priorityNumber);
		this.set('closedHours', closedHours);
		
	}

	function getName() {
		return this.get('name');
	}

	function getStartDate() {
		return DateHelper.dateFromDateString(this.get('startDate'));
	}

	function getEndDate() {
		return DateHelper.dateFromDateString(this.get('endDate'));
	}

	function getPriorityNumber() {
		return this.get('priorityNumber');
	}

	function getTimeObjectForDay(weekDay) {
		var timesArray = this.get('times'), timeObject = null;
		if (timesArray.length > weekDay && timesArray[weekDay] !== undefined) {
			
			timeObject = timesArray[weekDay];
		} 
		return timeObject;
	}

	function isFacilityHours() {
		return this.get('facilityHours');
	}

	function isClosed() {
		return this.get('closedHours');

	}

	function setStartDate(startDate) {
		this.set('startDate', startDate);
		configureTimes.call(this);
	}

	function setEndDate(endDate) {
		this.set('endDate', endDate);
		configureTimes.call(this);
	}

	function setTimesForDay(weekDay, timeObject) {
		var times;
		if ((!this.isClosed()) && (timeObject.startTime !== undefined && timeObject.endTime !== undefined)) {
			if (DateHelper.isTimeString(timeObject.startTime) && DateHelper.isTimeString(timeObject.endTime)) {
				//copy the times so that the setter can be called
				//setter needs to be called for events to propogate
				times = this.get('times').slice();
				times[weekDay] = timeObject;
				this.set('times', times);
			}
		}
	}

	function isBaseHours() {
		return this.getPriorityNumber() === 0 && this.isFacilityHours();
	}

	function iterateTimes(callback, context) {
		var i, 
		    times = this.get('times'),
		    n = (times) ? times.length : 0, 
		    context = context || this;

		for (i = 0; i < n; ++i) {
			if (times[i] && [].hasOwnProperty.call(times[i], 'startTime')) {
				callback.call(context, times[i], i);
			}
		}
	}

	//private
	function configureTimes() {
		//uses the start and end time of the array
		//this method does nothing if the start or end times are not set
		var startDate = this.get('startDate'),
		    endDate = this.get('endDate'),
		    times = (this.get('times')) ? [].slice.call(this.get('times')) : new Array(7),
		    defaultObj = {startTime: '12:00am', endTime: '01:00am'},
		    timesChanged = false,
		    loopDone, endDateFound, 
		    firstIteration, i;
		    
		if (this.isClosed()) {
			this.set('times', null);

		} else if ((startDate && startDate !== '') && (endDate && endDate !== '')) {

			if ((this.getEndDate().getTime() - this.getStartDate().getTime()) / (24*60*60*1000) >= 6) {
				
				//then all the days of the week are represented
				for (i = 0; i < 7; ++i) {
					if (!times[i]) {
						timesChanged = true;
						times[i] = defaultObj;
						
					}
				}

			} else {
				
				//there are days of the week that should not be represented
				for (i = this.getStartDate().getDay(), firstIteration = true, endDateFound = false, loopDone = false; !loopDone; i = (i+1) % 7) {
					if (i === this.getStartDate().getDay() && !firstIteration)  {

						loopDone = true;
					} else {

						if (!endDateFound && (!times[i] || ![].hasOwnProperty.call(times[i], 'startTime'))) {
							
							timesChanged = true;
							times[i] = defaultObj;
							

						} else if (endDateFound) {
							times[i] = {};
							timeChanged = true;

						} 

						if (i === this.getEndDate().getDay()) {
							
							endDateFound = true;
						}
						

						firstIteration = false;
						
					}
					
				}
			}
			if (timesChanged) {
			
				this.set('times', times);
			}
		}
	}
 



	//method definitions
	return Backbone.Model.extend({
		idAttribute: "_id",
		url: '/hours',

		//methods
		initialize: initialize,
		getName: getName,
		getStartDate: getStartDate,
		getEndDate: getEndDate,
		getPriorityNumber: getPriorityNumber,
		getTimeObjectForDay: getTimeObjectForDay,
		isFacilityHours: isFacilityHours,
		isClosed: isClosed,
		setStartDate: setStartDate,
		setEndDate: setEndDate,
		setTimesForDay: setTimesForDay,
		isBaseHours: isBaseHours,
		iterateTimes: iterateTimes
	});
})();

//hours collection
//SINGLETON pattern...
HoursModel.HoursCollection = function() {
	var instance;

	//reset the HoursCollection function to just return the 
	//created instance
	HoursModel.HoursCollection = function() {
		return instance;
	};

	//this is set as a property of the HoursCollection function
	//in case the collection needs to be called to instantiate 
	//brand new collections (such as for testing)
	this.cachedCollection = (function() {

		function getBaseHours() {
			return [].filter.call(this.models, function(model) {
				return model.isBaseHours();
			}).sort(function(model1, model2) {
				return model1.getStartDate().getTime() - model2.getStartDate().getTime();
			});

		}

		function getOtherHours(facilityHours) {
			//if facility hours is undefined, then
			//just filter the selection based on 
			//whether the hours are closed and whether
			//they are base hours
			if (facilityHours === undefined) {
				return [].filter.call(this.models, function(model) {
					return !model.isBaseHours() && !model.isClosed();
				}).sort(function(model1, model2) {
					return model1.getStartDate().getTime() - model2.getStartDate().getTime();
				});
			}
			//otherwise, use the facilityHours boolean value to further
			//filter the selection beyong just baseHours and isClosed
			return [].filter.call(this.models, function(model) {
				return !model.isBaseHours() && !model.isClosed() && (facilityHours === model.isFacilityHours());
			}).sort(function(model1, model2) {
				return model1.getStartDate().getTime() - model2.getStartDate().getTime();
			});
		}

		function getClosedHours() {

			return [].filter.call(this.models, function(model) {
				return model.isClosed();
			}).sort(function(model1, model2) {
				return model1.getStartDate().getTime() - model2.getStartDate().getTime();
			});
		}

		function addModel(model) {
			this.add(model);
			//throw an event
			if (model.isClosed()) {

				this.trigger('addClosedHours', model);
			} else if (model.isFacilityHours()) {
				this.trigger('addFacilityHours', model);
			} else {
				this.trigger('addOtherHours', model);

			}
		}

		return Backbone.Collection.extend({
			model: HoursModel.Hours,
			url: '/JSON/hours',

			//methods
			getBaseHours: getBaseHours,
			getOtherHours: getOtherHours,
			getClosedHours: getClosedHours,
			addModel: addModel
		});

	})();
	//end of collection implementation

	instance = new this.cachedCollection();

	return instance;
}

//global variables related to
//the model are defined here
