var jsdom = require('jsdom');
	//array of data with all the sports 
	//that were uploaded in the single document
	sports = [],
	_ = require('underscore')._,
	DateHelper = require('./public/javascripts/DateHelper').DateHelper;

//add missing helper methods to _

_.extendDeep = function(object) {
	var property, copy;
	if (Array.isArray(object)) {
		copy = object.slice();
		for (property in object) {
			if (object.hasOwnProperty(property) && +property !== +property) {
				//the property is not a number/index
				//the property belongs to the prototype
				if (typeof object[property] === 'object') {
					copy[property] = _.extendDeep(object[property]);
				} else {
					copy[property] = object[property];
				}
			}
		}
	} else {
		copy = {};
		for (property in object) {
			if (object.hasOwnProperty(property)) {
				if (typeof object[property] === 'object') {
					copy[property] = _.extendDeep(object[property]);
				} 
				else {
					copy[property] = object[property];
				}
			}
		}
	}
		
	return copy;
};
//sample object in sports

//helper functions for parsing 
//sports

//removes new line characters and replaces them with a single space
function removeNewLine(text) {
	var i, n, returnText = text;
	for (i = 0, n = text.length; i < n; ++i) {
		if (text.charAt(i) === '\n') {
			console.log("In here");
			returnText = returnText.substr(0,i) + " " + returnText.substr(i + 1, n - i - 1);
 		}
	}
	return returnText;
}

//removes spaces if the there are 
//multiple adjacent spaces
function trimExtraSpaces(text) {
	var i, n, returnText = "", precedingSpace = false;

	for (i = 0, n = text.length; i < n; ++i) {
		if (text.charAt(i).match(/\s/)) {
			if (!precedingSpace) {
				returnText = returnText + " ";
				precedingSpace = true;
			}
		} else {
			
			returnText = returnText + text.charAt(i);
			precedingSpace = false;
		}
	}

	return returnText;
}

function removeAllWhitespace(text) {
	var i, n, fixedText = "";
	for (i = 0, n = text.length; i < n; ++i) {
		if (!text.charAt(i).match(/\s/)) {
			fixedText = fixedText + text.charAt(i);
		}
	}
	return fixedText;
}

function filterBadCharacters(text) {
	var i, n, returnText = "";
	for (i=0, n = text.length; i < n; ++i) {
		if (text.charAt(i).match(/[a-z,0-9, ,',:]/i)) {
			returnText = returnText + text.charAt(i);
		}
	}
	return returnText;
}

//filters the given character from the text
function filterToken(text, token) {
	console.log("in filter token");
	var filterRegExp = new RegExp('[' + token + ']'),
		newText = "", i, n;

	for (i = 0, n = text.length; i < n; ++i) {
		console.log("Filter token: for loop");
		if (!filterRegExp.test(text.charAt(i))) {
			newText = newText + text.charAt(i);
		}
	}
	console.log("About to return from filter token with text " + newText);
	return newText;

} 

function tallyToNumber(window, element) {
	console.log("in tally");
	var total = 0;
	if (element.text() === "") {
		return 0;
	} else {
		
		total += (element.children('del').length * 5);
		if (element.text().match(/I/g)) {
			total += (element.text().match(/I/g).length - (element.children('del').length * 4));
		}
		
		return total;
	}
	
	
}

//for parsing ambiguous dates to a solution
function parseDate(date) {
	console.log("In parse date: " + date);
	var splitDate, i, testMonth, year;
	if (DateHelper.isDateString(date)) {
		return DateHelper.dateFromDateString(date);
	} else {
		console.log("Not a date string");
		year = (new Date()).getYear() + 1900;
		splitDate = date.split(' ');
		if (splitDate.length >= 2) {
			console.log("Split date is split into >= 2");
			//need to check if split date has a number for the day
			if (+splitDate[1] !== +splitDate[1]) {
				console.log("Split date is null")
				return null;
			}
			console.log("Split date is not null")
			testMonth = new RegExp('^' + splitDate[0], 'i');
			//generate month regexp
			for (i = 0; i < 12; ++i) {
				console.log("In the for loop");
				if (testMonth.test(DateHelper.monthNameForIndex(i))) {
					return new Date(year, i, +splitDate[1]);
				}
			}
		}
		
	}
	console.log("Actually, split date is null");
	//the date could not be parsed
	return null;
}

function parseTime(time) {
	var timeObj,
		salvageTime,
		splitTime;
	if (DateHelper.isTimeString(time)) {
		return time;
	} else {
		timeObj = removeAllWhitespace(time);
		timeObj = filterBadCharacters(timeObj);
		salvageTime = /^(((0\d)|(1[1,2]))|(\d)):\d\d[a,p]m$/g
		if (salvageTime.test(timeObj)) {
			splitTime = timeObj.split(':');
			if (splitTime[1].substr(splitTime[1].length - 2, 2) === 'am') {
				splitTime.push('am');
			} else {
				splitTime.push('pm');
			}
			//remove the am/pm string from the 2nd element
			splitTime[1] = splitTime[1].substr(0, splitTime[1].length -2);
			if (splitTime[0].length === 1) {
				splitTime[0] = '0' + splitTime[0];
			}
			return splitTime[0] + ':' + splitTime[1] + splitTime[2];

		} else {
			console.log("Time cannot be salvaged");
			return null;
		}

	}
}

//create an end time string based on the start
//time string that is passed in (1 hours after the start time)
//this method should only be called if a valid time string is
//passed in
function generateEndTime(timeString) {
	console.log("In generate end time");
	var timeArray, endTime = "";
	if (DateHelper.isTimeString(timeString)) {
		console.log("Is valid time string");
		timeArray = DateHelper.splitTime(timeString, true);
		console.log("Split the time");
		timeArray[0] = timeArray[0] + 1;
		if (timeArray[0] > 12) {
			timeArray[0] = 1;
			if (timeArray[2].toLowerCase() === 'am') {
				timeArray[2] = 'pm'
			} else {
				timeArray[2] = 'am';
			}
		}

		//now convert array to time string for end time
		if (timeArray[0] < 10) {
			endTime = '0' + timeArray[0].toString()+':';
		} else {
			endTime = timeArray[0].toString()+':';
		}

		if (timeArray[1] < 10) {
			endTime = endTime + '0' + timeArray[1].toString();
		} else {
			endTime = endTime + timeArray[1].toString();
		}

		endTime = endTime + timeArray[2];

	} 
	return endTime;
		

}

//functions to parse out data
function sportName(window) {
	var nameEl = window.$('body p:nth-of-type(1)'),
		name = nameEl.text();
	return name;
}

function matrixOfTeams(window) {
	
	var teamsTable = window.$('body table:nth-of-type(1) tbody'), rowEl,
	    teams = [], i, j, m, n, nextTeam;
	for (i = 1, n = teamsTable.children().length; i < n; ++i) {
		
		nextTeam = {};
		nextTeam.WLT = new Array(3);
		nextTeam.teamID = i;
		for (j = 1, rowEl = teamsTable.children().eq(i), m = rowEl.children().length; j < m; ++j) {
			
			if (j >= 2) {
				nextTeam.WLT[j-2] = tallyToNumber(window, rowEl.children().eq(j));
			} else {
				nextTeam.name = filterBadCharacters(trimExtraSpaces(rowEl.children().eq(j).text().trim()));
			}
			
		}
		nextTeam.dropped = false;
		teams.push(_.extendDeep(nextTeam));
		console.log(JSON.stringify(nextTeam));
	}
	
	return teams;
}

//for this function to work, the function's 
//teams property needs to be set to the array
//of teams in the sport, this teams property
//can be generated from the matrixOfTeams return
//value
function teamWithName(name) {
	console.log("teamwith name was called");
	var teams = teamWithName.teams,
		searchRegexp = new RegExp(name, 'i'),
		i, n;
	if (!teams) {
		
		throw new Error('Teams property is not set');
	}
	console.log("About to enter the for loop");
	for (i =0, n = teams.length; i < n; ++i) {
		console.log("In the for loop");
		if (searchRegexp.test(teams[i].name)) {
			return teams[i].teamID;
		}
	}
	console.log("Nothing was found with the name " + name);
	//id's of 0 do not exist, a return of a 0 ID
	//indicates that the team name could not be identified
	return 0;
}


function matrixOfGames(window, errors) {
	var gamesTable = window.$('body table:nth-of-type(2) tbody'),
		i, n, j, m, gameEl, games = [], score = [],
		location = gamesTable.children().eq(0).children().eq(2).text() + " ",
		rawDate, dateObj;

	for (i = 1, n = gamesTable.children().length; i < n; ++i) {
		gameEl = gamesTable.children().eq(i);
		nextGame = {};
		nextGame.teams = [];
		for (j = 0, m = gameEl.children().length; j < m; ++j) {
			switch(j) {
				case 0:
					console.log("Checking date");
					rawDate = filterBadCharacters(trimExtraSpaces(gameEl.children().eq(0).text()).trim());
					dateObj = parseDate(rawDate);
					console.log("Parsed the date");
					if (dateObj === null) {
						errors.push("The date for game #" + (i+1).toString() + " could not be identified and was set to 01/01/2013")
						nextGame.date = "01/01/2013";
					} else {
						console.log("Setting the date");
						nextGame.date = DateHelper.dateStringFromDate(dateObj);
					}
					break;
				case 1:
					console.log("setting times");
					nextGame.startTime = removeAllWhitespace(filterBadCharacters(gameEl.children().eq(1).text()));
					nextGame.startTime = parseTime(nextGame.startTime);
					console.log("done parsing start time");
					if (!nextGame.startTime) {
						errors.push("The start time for game #" + (i+1).toString() + " could not be identified and was set to 01:00am")
						nextGame.startTime = "01:00am";
						nextGame.endTime = "02:00am";
					} else {
						console.log("About to generate end time");
						nextGame.endTime = generateEndTime(nextGame.startTime);
					}
					break;
				case 2:
					nextGame.location = filterBadCharacters(trimExtraSpaces(location + gameEl.children().eq(2).text()).trim());
					break;
				case 3:
					nextGame.teams[0] = teamWithName(filterBadCharacters(trimExtraSpaces(gameEl.children().eq(3).text()).trim()));
					if (nextGame.teams[0] === 0) {
						errors.push('The home team in game #' +(i+1).toString() + ' could not be identified and was replaced with the team "' + filterToken(teamWithName.teams[0].name, ',') + '"');
						nextGame.teams[0] = teamWithName.teams[0].teamID;
					}
					break;
				case 5:
					nextGame.teams[1] = teamWithName(filterBadCharacters(trimExtraSpaces(gameEl.children().eq(5).text()).trim()));
					if (nextGame.teams[1] === 0) {
						errors.push('The away team in game #' +(i+1).toString() + ' could not be identified and was replaced with the team "' + filterToken(teamWithName.teams[1].name, ',') + '"');
						nextGame.teams[1] = teamWithName.teams[1].teamID;
					}
					break;
				case 6:
				
					score = gameEl.children().eq(6).text().split('-');
					
					if (score.length === 2) {

						score[0] = trimExtraSpaces(score[0]).trim();
						score[1] = trimExtraSpaces(score[1]).trim();

						nextGame.score = [0,0];
						//console.log(score);
						//console.log(+score[0]);
						
						if (+score[0] !== +score[0]) {
							//not a number
							//only need to set this using the data from the first score
							if (DateHelper.dateFromDateString(nextGame.date).getTime() > Date.now()) {
								//5 indicates game not played
								nextGame.winner = 5;

							} else if (score[0].toLowerCase() === 'w') {
								nextGame.winner = 4;
							} else {
								nextGame.winner = 3;
							}


						} else {
							nextGame.score[0] = +score[0];
							if (DateHelper.dateFromDateString(nextGame.date).getTime() > Date.now()) {
								//5 indicates the games has not yet been played
								nextGame.winner = 5;
							} else if (nextGame.score[0] > nextGame.score[1]) {
								nextGame.winner = 0;
							} else if (nextGame.score[0] < nextGame.score[1]) {
								nextGame.winner = 1;
							} else {
								nextGame.winner = 2;
							}
						}

						if (+score[1] === +score[1]) {
							
							nextGame.score[1] = +score[1];
						}
						

					} else {
						//the game cannot be read
						nextGame.score = [0,0];
						errors.push("Could not read the score for game #" + (i+1).toString());
						console.log("Score was not of length 2");
						//set winner to 5 if the game is after the current date
						//set winner to 2 if the game is before the current date (indicates tie)
						nextGame.winner = (DateHelper.dateFromDateString(nextGame.date).getTime() > Date.now()) ? 5 : 2;
					}
					
						
					
					break;
				default:
					if (j !== 4) {
						console.log("The table reached an unexpected row");
					}
					break;

			}
		}
		nextGame.isCancelled = false;
		games.push(_.extendDeep(nextGame));

	}
	return games;
	
}


//export methods


exports.parseSport = function(html, callback) {
	var document = jsdom.jsdom(html),
	    window = document.createWindow();
	try {
		jsdom.jQueryify(window, './public/jQuery-ui/js/jquery-1.9.1.js', function() {
			var model = {}, errors = [];
			model.sport = sportName(window, errors);
			model.teams = matrixOfTeams(window, errors);

			//set the teams property on the teamsWithName function
			teamWithName.teams = model.teams;

			model.games = matrixOfGames(window, errors);
			console.log("Done with the games");
			//callback the model that was parsed from the html
			//and the errors that were idenitified during the
			//parsing process
			callback(model, errors);
		});
	} catch(err) {
		//cannot read this file as html
		callback({
			sport: 'New Sport',
			season: 0,
			entryDates: {start: '01/01/2013', end: '01/02/2013'},
			seasonDates: {start: '01/01/2013', end: '01/02/2013'},
			teams: [],
			games: []
		}, ['This file could not be read as a valid html file and the sport was set to default values']);
	}
		
		
			
};
