//DateHelper is a utility class
var DateHelper = {};


window.FitnessClass = Backbone.Model.extend({

	//time in military time, 1200 is 12 pm, 1330, is 1:30 pm
	startTime = 0, 
	endTime = 0,
	instructor = '',
	className = '',
	//0-based index of the day of the week that this class is in
	dayOfWeek = 0,
	//dates are strings in the form MM/DD/YYYY 
	//maybe use the date class instead

	//if the class is a 1-time occurence, then 
	//the start and end dates are the same
	//if the class keeps going, then the end date is blank
	startDate = '',
	endDate = '',


});