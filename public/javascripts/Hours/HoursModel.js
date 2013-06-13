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
		var noOptions = (options === undefined);
		var name = (noOptions || options.name === undefined) ? '' : options.name;
		var startDate = (noOptions || options.startDate === undefined) ? '' : options.startDate;
		var endDate = (noOptions || options.endDate === undefined) ? '' : options.endDate;
		var priorityNumber = (noOptions || options.priorityNumber === undefined) ? 0 : options.priorityNumber;
		var facilityHours = (noOptions || options.facilityHours === undefined) ? false : options.facilityHours;
		var closedHours = (noOptions || options.closedHours === undefined) ? false : options.closedHours;
		var times = (noOptions || options.times === undefined) ? [] : options.times;


		this.set('name', name);
		this.set('startDate', startDate);
		this.set('endDate', endDate);
		this.set("facilityHours", facilityHours);
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