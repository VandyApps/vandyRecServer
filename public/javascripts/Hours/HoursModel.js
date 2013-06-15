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
	}
});


HoursModel.HoursCollection = Backbone.Collection.extend({
	model: HoursModel.Hours,
	url: '',

	getBaseHours: function() {
		return [].filter.call(this.models, function(model) {
			return model.isBaseHours();
		});
	},
	getOtherHours: function(facilityHours) {
		//if facility hours is undefined, then
		//just filter the selection based on 
		//whether the hours are closed and whether
		//they are base hours
		if (facilityHours === undefined) {
			return [].filter.call(this.models, function(model) {
				return !model.isBaseHours() && !model.isClosed().sort(function(model1, model2) {
					return model2.getStartDate().getTime() - model1.getStartDate().getTime();
				});
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
			return model2.getStartDate().getTime() - model1.getStartDate().getTime();
		});
	}
});
