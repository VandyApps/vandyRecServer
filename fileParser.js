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
				console.log("/n/n/n/n/n/n/n/n/n/n/n/n/nSplit date is null")
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
		return endTime;
	} else {
		return null;
	}
	
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
			console.log("Found the team");
			return teams[i].teamID;
		}
	}
	console.log("Nothing was found with the name " + name);
	//id's of 0 do not exist, a return of a 0 ID
	//indicates that the team name could not be identified
	return 0;
}

function resetWLT(teams, games) {
	console.log("ResetWLT was called");
	//get the max teamID
	var maxID = 0,
		teamsArray;
	teams.forEach(function(team) {
		if (maxID < team.teamID) {
			maxID = team.teamID;
		}
	});
	if (maxID !== 0) {
		teamsArray = new Array(maxID);
		games.forEach(function(game) {
			var winner = game.winner,
				team1_id = game.teams[0],
				team2_id = game.teams[1];
			//lazy instantiation of the WLT arrays within the
			//teams array
			if (teamsArray[team1_id] === undefined) {
				teamsArray[team1_id] = [0,0,0];
			}

			if (teamsArray[team2_id] === undefined) {
				teamsArray[team2_id] = [0,0,0];
			}

			if (winner === 0 || winner === 4) {
				//home team won
				teamsArray[team1_id][0] = teamsArray[team1_id][0] + 1;
				teamsArray[team2_id][1] = teamsArray[team2_id][1] + 1;

			} else if (winner === 1 || winner === 3) {
				//away team won
				teamsArray[team1_id][1] = teamsArray[team1_id][1] + 1;
				teamsArray[team2_id][0] = teamsArray[team2_id][0] + 1;

			} else if (winner === 2) {
				//tie
				teamsArray[team1_id][2] = teamsArray[team1_id][2] + 1;
				teamsArray[team2_id][2] = teamsArray[team2_id][2] + 1;
			}
		});
	}

	//insert the new WLT back into the teams
	teams.forEach(function(team) {
		if (teamsArray[team.teamID] !== undefined) {
			team.WLT = teamsArray[team.teamID]
		}
	});
}

function matrixOfGames(window) {
	console.log("Inside matrixOfGames");
	var gamesTable = window.$('body table:nth-of-type(2) tbody'),
		i, n, j, m, gameEl, games = [], score = [],
		location = gamesTable.children().eq(0).children().eq(2).text() + " ",
		rawDate, dateObj;

	for (i = 1, n = gamesTable.children().length; i < n; ++i) {
		console.log("In the first for loop of the games");
		gameEl = gamesTable.children().eq(i);
		nextGame = {};
		nextGame.teams = [];
		for (j = 0, m = gameEl.children().length; j < m; ++j) {
			console.log("In the nexted for loop of the games");
			switch(j) {
				case 0:
					rawDate = filterBadCharacters(trimExtraSpaces(gameEl.children().eq(0).text()).trim());

					dateObj = parseDate(rawDate);
					if (dateObj) {
						
						nextGame.date = DateHelper.dateStringFromDate(dateObj);
					} else {

						nextGame.date = null;
					}
					break;
				case 1:
					
					nextGame.startTime = removeAllWhitespace(filterBadCharacters(gameEl.children().eq(1).text()));
					nextGame.startTime = parseTime(nextGame.startTime);
					nextGame.endTime = generateEndTime(nextGame.startTime);
					break;
				case 2:
					nextGame.location = filterBadCharacters(trimExtraSpaces(location + gameEl.children().eq(2).text()).trim());
					break;
				case 3:
					console.log("Setting the home team");
					nextGame.teams[0] = teamWithName(filterBadCharacters(trimExtraSpaces(gameEl.children().eq(3).text()).trim()));
					
					break;
				case 5:
					console.log("Setting the away team");
					nextGame.teams[1] = teamWithName(filterBadCharacters(trimExtraSpaces(gameEl.children().eq(5).text()).trim()));
					
					break;
				case 6:
					
					score = gameEl.children().eq(6).text().split('-');
					
					if (score.length === 2) {
						console.log("2 scores found");
						score[0] = trimExtraSpaces(score[0]).trim();
						score[1] = trimExtraSpaces(score[1]).trim();

						console.log("Done trimming");
						console.log("The date is " + nextGame.date);						nextGame.score = [0,0];
						//console.log(score);
						//console.log(+score[0]);
						
						if (+score[0] !== +score[0]) {
							console.log("Score is not a number");
							//not a number
							//only need to set this using the data from the first score
							//check to make sure the date exists for this game first
							if (!nextGame.date) {
								if (score[0].toLowerCase() === 'w') {
									nextGame.winner = 4;
								} else {
									nextGame.winner = 3;
								} 

							} else if (DateHelper.dateFromDateString(nextGame.date).getTime() > Date.now()) {
								//5 indicates game not played
								nextGame.winner = 5;

							} else if (score[0].toLowerCase() === 'w') {
								nextGame.winner = 4;
							} else {
								nextGame.winner = 3;
							}


						} else {
							console.log("Score is a number");
							nextGame.score[0] = +score[0];
							if (!nextGame.date) {

								if (nextGame.score[0] > nextGame.score[1]) {
									nextGame.winner = 0;
								} else if (nextGame.score[0] < nextGame.score[1]) {
									nextGame.winner = 1;
								} else {
									nextGame.winner = 2;
								}

							} else if (DateHelper.dateFromDateString(nextGame.date).getTime() > Date.now()) {
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
						console.log("Could not find a team")
						//the game cannot be read
						nextGame.score = [-1,-1];
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

//should initialize this function if needed
function sortTeams(teams) {

}

//sorts the games in chronological order
//all properties without proper dates are placed at
//the beginning of the list
function sortGames(games) {
	console.log("Sort games was called");
	games.sort(function(game1, game2) {
		var value1 = 0,
			value2 = 0;
		if (game1.date && game1.startTime) {
			value1 = DateHelper.dateFromDateString(game1.date).getTime() / 1000;
			value1 += DateHelper.timeStringInSecs(game1.startTime);
		}

		if (game1.date && game1.startTime) {
			value2 = DateHelper.dateFromDateString(game2.date).getTime() / 1000;
			value2 += DateHelper.timeStringInSecs(game2.startTime);
		}

		return value1 - value2;
	});
}

//finds errors with the model,
//corrects the errors to temporary values,
//reports the errors by returning an array 
//of descriptions
function findErrors(model) {
	console.log("Find errors was called");
	var errors = [];
	//check error with title

	//check error with teams

	//check error with games
	model.games.forEach(function(game, index) {
		console.log("Next game: "+game.date);
		if (!game.date) {
			errors.push("The date of game #"+(index+1).toString() + " cannot be read and was set to 01/01/2013");
			game.date = "01/01/2013";
		}

		if (!game.startTime) {
			errors.push("The starting time of game #"+(index+1).toString()+ " could not be read and was replaced with 01:00am");
			game.startTime = "01:00am";
			game.endTime = "02:00am";
		}

		if (!game.teams[0]) {
			errors.push("The home team for game #"+(index+1).toString()+" could not be identified and was replaced with the team \""+model.teams[0].name+"\"");
			game.teams[0] = model.teams[0].teamID;
		}

		if (!game.teams[1]) {
			errors.push("The away team for game #"+(index+1).toString()+" could not be identified and was replaced with the team \""+model.teams[1].name+"\"");
			game.teams[1] = model.teams[1].teamID;
		}

		if (game.score[0] < 0) {
			errors.push("The scores from game #"+(index+1).toString()+" could not be read and was set to 0 for both teams");
			game.score = [0,0];
			if (DateHelper.dateFromDateString(game.date).getTime() > Date.now()) {
				game.winner = 5;
			} else {
				game.winner = 2;
			}
		}
	});

	//commas are used to separate array elements so commas
	//should be removed from all error messages
	errors = errors.map(function(error) {
		return filterToken(error, ',');
	});
	return errors;
}

//export methods


exports.parseSport = function(html, callback) {
	var document = jsdom.jsdom(html),
	    window = document.createWindow();
	try {
		jsdom.jQueryify(window, './public/jQuery-ui/js/jquery-1.9.1.js', function() {
			var model = {}, errors;
			model.sport = sportName(window);
			model.teams = matrixOfTeams(window);

			//set the teams property on the teamsWithName function
			teamWithName.teams = model.teams;
			console.log("Games about to be created");
			model.games = matrixOfGames(window);
			sortGames(model.games);
			errors = findErrors(model);
			resetWLT(model.teams, model.games);
			console.log("Done with the games");
			//callback the model that was parsed from the html
			//and the errors that were idenitified during the
			//parsing process
			console.log("Errors: ");
			console.log(JSON.stringify(errors));
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
