var jsdom = require('jsdom');
	//array of data with all the sports 
	//that were uploaded in the single document
	sports = [],
	_ = require('underscore')._;


//add missing helper methods

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

//removes spaces if the their are 
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

function filterBadCharacters(text) {
	var i, n, returnText = "";
	for (i=0, n = text.length; i < n; ++i) {
		if (text.charAt(i).match(/[a-z,0-9, ,']/i)) {
			returnText = returnText + text.charAt(i);
		}
	}
	return returnText;
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

function matrixOfTeams(window, table) {
	
	var teamsTable = window.$('body table:nth-child(3) tbody'), rowEl,
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
		
		teams.push(_.extendDeep(nextTeam));
		console.log(JSON.stringify(nextTeam));
	}
	
	return teams;
}


//export methods

exports.parseHTML = function(html, callback) {
	var document = jsdom.jsdom(html),
	    window = document.createWindow();

	jsdom.jQueryify(window, './public/jQuery-ui/js/jquery-1.9.1.js', function() {
		console.log("jquery called");
		callback(matrixOfTeams(window));
	});
};
