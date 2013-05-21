//DateHelper is a utility class
window.DateHelper = {};

DateHelper.addWeekToDate = function(date) {
	date.setDate(date.getDate() + 7);
}

DateHelper.substractWeekFromDate = function(date) {
	date.setDate(date.getDate() - 7);
}

//returns the week day of the date as a string
//can either pass in a date or an index of a day
DateHelper.weekDayAsString = function(date) {
	var dayOfWeekIndex;
	if (typeof date === 'object') {
		dayOfWeekIndex = date.getDay();
	} else if (typeof date === 'number') {
		dayOfWeekIndex = date;
	} else {
		return new Error('parameter passed into weekDayAsString is not valid');
	}
	switch(dayOfWeekIndex) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";

	}
	return "Saturday";
}


DateHelper.monthNameForIndex = function(monthIndex) {
	switch(monthIndex) {
		case 0: return "January";
		case 1: return "February";
		case 2: return "March";
		case 3: return "April";
		case 4: return "May";
		case 5: return "June";
		case 6: return "July";
		case 7: return "August";
		case 8: return "September";
		case 9: return "October";
		case 10: return "November";
		default: return "December";
	}
}

//get the number of days for a month index
DateHelper.daysForMonth = function(monthIndex, year) {
	switch(monthIndex) {
		case 0: return 31;
		case 1: if (year % 4 === 0) return 29; else return 28;
		case 2: return 31; 
		case 3: return 30;
		case 4: return 31;
		case 5: return 30;
		case 6: return 31;
		case 7: return 31;
		case 8: return 30;
		case 9: return 31;
		case 10: return 30;
		default: return 31;
	}
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

DateHelper.equalDates = function(date1, date2) {
	return date1.getTime() === date2.getTime();
}

//this function set the dateToSet to a date that is on or after the comparison date
//but of the same week day as the dateToSet currently is

DateHelper.setDateToWeekDayAfterDate = function(dateToSet, comparisonDate) {
	while (DateHelper.earlierDate(dateToSet, comparisonDate)) {
		DateHelper.addWeekToDate(dateToSet);
	};
}
