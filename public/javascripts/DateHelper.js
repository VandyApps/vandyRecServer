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
//returns nothing if the int passed in is not a 
//valid index
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
		case 6: return "Saturday";
	}
}

//takes the day of the week as a string and converts it to an
//integer, 0-based index, returns nothing if the string passed in is not valid
DateHelper.weekAsInt = function(dayOfWeek) {
	var stringDate = dayOfWeek.toUpperCase();
	if (stringDate === "MONDAY") {
		return 0;
	} else if (stringDate === "TUESDAY") {
		return 1;
	} else if (stringDate === "WEDNESDAY") {
		return 2;
	} else if (stringDate === "THURSDAY") {
		return 3;
	} else if (stringDate === "FRIDAY") {
		return 4;
	} else if (stringDate === "SATURDAY") {
		return 5;
	} else if (stringDate === "SUNDAY") {
		return 6;
	} 
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

//returns the month index for the month name
//returns nothing if the name is not a valid name
//for a month
DateHelper.monthIndexForName = function(monthName) {

	var monthString = monthName.toUpperCase();
	if (monthString === "JANUARY") {
		return 0;
	} else if (monthString === "FEBRUARY") {
		return 1;
	} else if (monthString === "MARCH") {
		return 2;
	} else if (monthString === "APRIL") {
		return 3;
	} else if (monthString === "MAY") {
		return 4;
	} else if (monthString === "JUNE") {
		return 5;
	} else if (monthString === "JULY") {
		return 6;
	} else if (monthString === "AUGUST") {
		return 7;
	} else if (monthString === "SEPTEMBER") {
		return 8;
	} else if (monthString === "OCTOBER") {
		return 9;
	} else if (monthString === "NOVEMBER") {
		return 10;
	} else if (monthString === "DECEMBER") {
		return 11;
	}
}

//get the number of days for a month index and year
//monthIndex and year can either be numbers or 
//strings (strings that can be parsed to numbers)
DateHelper.daysForMonth = function(mIndex, y) {
	var monthIndex, year;
	if (typeof mIndex === 'string') {

		monthIndex = +mIndex;

	} else {
		monthIndex = mIndex;
	}

	if (typeof y === 'string') {
		year = +y;
	} else {
		year = y;
	}

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
//12:00:00 am, makes changes to the date that is 
//passed in
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

//returns true if the dates are equal without
//considering the time.  Only takes into account
//day year, and month
DateHelper.equalDates = function(date1, date2) {
	var firstDate = new Date(date1.getYear(), date1.getMonth(), date1.getDate(), 0,0,0,0);
	var secondDate = new Date(date2.getYear(), date2.getMonth(), date2.getDate(), 0,0,0,0);
	
	return firstDate.getTime() === secondDate.getTime();
}

//checks if the compare date is in between date1 and date2
//returns true if the compare date is in between the two dates
//or equal to either of the dates
DateHelper.betweenDates = function(compareDate, date1, date2) {
	var smallerDate;
	var largerDate;
	if (date1.getTime() < date2.getTime()) {
		smallerDate = date1;
		largerDate = date2;
	} else {
		smallerDate = date2;
		largerDate = date1;
	}
	if (compareDate.getTime() <= largerDate.getTime() && compareDate.getTime() >= smallerDate.getTime()) {
		return true;
	}
	return false;

}

//this function set the dateToSet to a date that is on or after the comparison date
//but of the same week day as the dateToSet currently is

DateHelper.setDateToWeekDayAfterDate = function(dateToSet, comparisonDate) {
	while (DateHelper.earlierDate(dateToSet, comparisonDate)) {
		DateHelper.addWeekToDate(dateToSet);
	};
}

//converts the date into a dateString of the form MM/DD/YYYY where month, day, and year
//are all 1-based indexed
DateHelper.dateStringFromDate = function(date) {
	var monthString;
	var dayString;
	var yearString = date.getYear() + 1900;

	var monthIndex = date.getMonth() + 1;
	if (monthIndex < 10) {
		monthString = '0' + monthIndex.toString();
	} else {
		monthString = monthIndex.toString();
	}

	if (date.getDate() < 10) {
		dayString = '0' + date.getDate().toString();
	} else {
		dayString = date.getDate().toString();
	}
	return monthString + '/' + dayString +'/' + yearString;
}

DateHelper.dateFromDateString = function(dateString) {
	var dateArray = dateString.split('/');
	return new Date(parseInt(dateArray[2], 10), parseInt(dateArray[0], 10) - 1, parseInt(dateArray[1], 10), 0,0,0,0);
}


/*timeString methods*/
DateHelper.isTimeString = function(timeString) {
	var regexp = new RegExp("^((0\\d)|(1[012])):[012345]\\d[a,A,p,P][m,M]$");
	return regexp.test(timeString);
}

//date can either be a date or a date string
//the date is split into an array of 3 elements
//at index 0 is the month, at index 1 is the day,
//and at index 2 is the year.  An optional 2nd 
//parameter can be passed, which is a boolean.  
//if the boolean is true, the elements in the array are
//parsed into numbers (instead of strings)
DateHelper.splitDate = function(date, coerce) {
	var dateString;
	if (typeof date === 'string') {
		dateString = date;
	} else {
		dateString = DateHelper.dateStringFromDate(date);
	}

	if (!!coerce) {
		return dateString.split('/').map(function(element) {
			return +element;
		});
	}
	return dateString.split('/');
	
}

//a time string is passed in and an array is returned
//index 0 contains the hours, index 1 contains the minutes, 
//and index 2 contains the am/pm indicator.  Coerce is an optionnal
//parameter, and if coerce is true, then the values at index 0
//and index 1 are set to true
DateHelper.splitTime = function(time, coerce) {
	var firstSplit = time.split(':'),
	    finalSplit = [firstSplit[0], firstSplit[1].substr(0,2), firstSplit[1].substr(2,2)];

	if (coerce) {
		return finalSplit.map(function(el, index) {
			return (index !== 2) ? +el : el;
		});
	}
	return finalSplit;
	
}

DateHelper.timeStringInSecs = function(timeString) {
	var timeArray = this.splitTime(timeString, true),
		seconds = 0;
	seconds += (60 * timeArray[0] + timeArray[1]) * 60;
	seconds += (timeString[2] === 'pm') ? 12 * 60 * 60: 0;
	return seconds;

}