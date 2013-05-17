//DateHelper is a utility class
var DateHelper = {};

DateHelper.addWeekToDate = function(date) {
	date.setDate(date.getDate() + 7);
}


//returns the week day of the date as a string
DateHelper.weekDayAsString = function(date) {
	switch(date.getDay()) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";

	}
	return "Saturday";
}

//sets the date so that the date is the same
//with the exception of the time, which is 
//12:00:00 am
DateHelper.dateWithEmptyTime = function(date) {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
}

//returns true if date1 is earlier than date2
DateHelper.earlierDate = function(date1, date2) {
	return date1.getTime() < date2.getTime();
}


//this function set the dateToSet to a date that is on or after the comparison date
//but of the same week day as the dateToSet currently is

DateHelper.setDateToWeekDayAfterDate = function(dateToSet, comparisonDate) {
	while (DateHelper.earlierDate(dateToSet, comparisonDate)) {
		DateHelper.addWeekToDate(dateToSet);
	};
}
