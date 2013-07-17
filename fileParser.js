var jsdom = require('jsdom');
	//array of data with all the sports 
	//that were uploaded in the single document
	sports = [];
//sample object in sports
/*
	{
		name: "",
		//teams should be sorted in 
		//winning order if the season is done
		teams: [],

		rank: [],
		wins: [],
		loses: [],
		ties: [],
		//an array of two values, start date 
		//string and end date string
		entryDates: [],
		dates: []
	}
*/

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
	console.log(element);
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

function matrixOfScores(window, table) {
	
	//matrix is in the form: teamNumber, teamName, numOfWins, numOfLosses
	
	var table = window.$('body table:nth-child(3) tbody'), rowEl,
	    matrix = [], i, j, m, n, row;
	for (i = 1, n = table.children().length; i < n; ++i) {
		
		row = [];
		for (j = 1, rowEl = table.children().eq(i), m = rowEl.children().length; j < m; ++j) {
			
			if (j >= 2) {
				row[j-1] = tallyToNumber(window, rowEl.children().eq(j));
			} else {
				row[j-1] = filterBadCharacters(trimExtraSpaces(rowEl.children().eq(j).text().trim()));
			}
			
		}
		
		matrix.push(row.slice());
	}
	
	return matrix;
}


//export methods

exports.parseHTML = function(html, callback) {
	var document = jsdom.jsdom(html),
	    window = document.createWindow();

	console.log("Parse html called");
	jsdom.jQueryify(window, './public/jQuery-ui/js/jquery-1.9.1.js', function() {
		console.log("jquery called");
		callback(matrixOfScores(window));
	});
};
