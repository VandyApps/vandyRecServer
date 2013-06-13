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
		var noOptions = (options === undefined),
		    name = (noOptions || options.name === undefined) ? '' : options.name,
		    startDate = (noOptions || options.startDate === undefined) ? '' : options.startDate,
		    endDate = (noOptions || options.endDate === undefined) ? '' : options.endDate,
		    priorityNumber = (noOptions || options.priorityNumber === undefined) ? 0 : options.priorityNumber,
		    facilityHours = (noOptions || options.facilityHours === undefined) ? false : options.facilityHours,
		    closedHours = (noOptions || options.closedHours === undefined) ? false : options.closedHours,
		    times = (noOptions || options.times === undefined) ? [] : options.times;


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
		return this.get('startDate');
	},
	getEndDate: function() {
		return this.get('endDate');
	},
	getPriorityNumber: function() {
		return this.get('priorityNumber');
	},
	setTimesForDay: function(weekDay, timeObject) {
		if (timeObject.startTime !== undefined && timeObject.endTime !== undefined) {
			if (DateHelper.isTimeString(timeObject.startTime) && DateHelper.isTimeString(timeObject.endTime)) {
				this.get('times')[weekDay] = timeObject;
			}
			console.log("Failed time string");
		}
		console.log("failed undefined or time string");
	}
});