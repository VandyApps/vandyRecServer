//this is not really a backbone view in that it has not real models but helps 
//delegate the display of models in a separate window
var BlockView = Backbone.View.extend({

	//the day to display
	day: 0,
	//row and column on the calendar grid
	column: 0,
	row: 0,
	//empty block defaults to false
	//empty means that this block does not represent a valid date
	empty: false,
	//the number of fitness classes to be held on this day
	numberOfFitnessClasses: 0,

	
	initialize: function(options) {
		//set the variables
		this.row = options.row;
		this.column = options.column;
		var columnSelector = "#cal-column-" + this.column;
		var rowSelector = ".cal-block-" + this.row;
		this.$el = $(columnSelector).children(rowSelector);

		if (options.empty === true) {
			this.empty = true;

		} else {
			this.empty = false;
			this.day = options.day;
			this.numberOfFitnessClasses = options.numberOfFitnessClasses;
		}
		this.render();
		
	},
	render: function() {
		if (this.empty) {
			this.$el.attr('empty', 'empty');
		}

		this.$el.append('<div class="dayIndicator">'+this.day+'</div>');
		if (this.numberOfFitnessClasses === 1) {

			this.$el.append('<div class="classCountIndicator">1 Class</div>');

		} else if (this.numberOfFitnessClasses > 1) {
			this.$el.append('<div class="classCountIndicator">'+this.numberOfFitnessClasses+" Classes</div>");

		} else {
			this.$el.append('<div class="classCountIndicator"><div>');
		}
		
		
	},
	//for resetting the view for another date 
	//without removing it
	reset: function(options) {
		//set the variables
		this.row = options.row;
		this.column = options.column;
		var columnSelector = "#cal-column-" + this.column;
		var rowSelector = ".cal-block-" + this.row;
		this.$el = $(columnSelector).children(rowSelector);
		if (options.empty === true) {
			this.empty = true;
			this.$el.attr('empty', 'empty');

		} else {
			this.empty = false;
			this.day = options.day;
			this.numberOfFitnessClasses = options.numberOfFitnessClasses;
		}
		
		this.rerender();

	},
	rerender: function() {
		if (this.empty) {
			this.$el.attr('empty', 'empty');
		} else {
			this.$el.removeAttr('empty');
		}

		this.$('.dayIndicator').text(this.day.toString());
		if (this.numberOfFitnessClasses === 1) {

			this.$('.classCountIndicator').text('1 Class');

		} else if (this.numberOfFitnessClasses > 1) {

			this.$('.classCountIndicator').text(this.numberOfFitnessClasses+' Classes');
		} else { //0 classes
			this.$('.classCountIndicator').text('');
			
		}
	}
	
});






var MonthView = Backbone.View.extend({

	el: '#calendar',

	month: 0,
	year: 0,
	//2D array for blocks in the month view
	//this is an array of rows, and each row 
	//is an array of columns
	dayBlocks: [],

	initialize: function(options) {
		this.month = options.month;
		this.year = options.year;
		this.render();
	},
	render: function() {

		//set the display to the month and year indication outside of
		//calendar element
		$('#month').text(DateHelper.monthNameForIndex(this.month));
		$('#year').text(this.year.toString());
		//construct date
		//set iterationDate to the first of the month
		var foundFirstDay = false;
		var foundLastDay = false;
		var passedLastDay = false;
		var counter = 0;
		var iterationDate = new Date(this.year, this.month, 1, 0, 0, 0, 0);
		for (var row = 0; row < 6; ++row) {
			
			//initiate the nested array
			this.dayBlocks[row] = new Array(7);
			for (var column = 0; column < 7; ++column) {
				

				//check for the first day 
				if (!foundFirstDay && iterationDate.getDay() === column) {
					foundFirstDay = true;

				} else if (foundLastDay) {

					passedLastDay = true;
				}else if (!foundLastDay && DateHelper.daysForMonth(iterationDate.getMonth(), this.year) === iterationDate.getDate()) {
					foundLastDay = true;
				}

				if (!foundFirstDay || passedLastDay) {
					
					//create an empty element
					this.dayBlocks[row][column] = new BlockView({row: row, column: column, empty: true});

				} else {
					
					//create a filled column
					//set the number of fitness classes to 0 initially
					this.dayBlocks[row][column] = new BlockView({row: row, column: column, day: iterationDate.getDate(), numberOfFitnessClasses: 0});
					iterationDate.setDate(iterationDate.getDate() + 1);
					counter++;
				}

				
			}
		}
	},
	incrementMonth: function() {
		this.month += 1;
		if (this.month > 11) {
			this.month = 0;
			this.year += 1;
			
		}
		this.rerender();
	},
	decrementMonth: function() {
		this.month -= 1;
		if (this.month < 0) {
			this.month = 11;
			this.year -= 1;

		}
		this.rerender();
	},
	rerender: function() {
		$('#month').text(DateHelper.monthNameForIndex(this.month));
		$('#year').text(this.year.toString());

		var foundFirstDay = false;
		var foundLastDay = false;
		var passedLastDay = false;
		var counter = 0;
		var iterationDate = new Date(this.year, this.month, 1, 0, 0, 0, 0);

		for (var row = 0; row < 6; ++row) {

			for (var column = 0; column < 7; ++column) {

				//check for the first day 
				if (!foundFirstDay && iterationDate.getDay() === column) {
					foundFirstDay = true;

				} else if (foundLastDay) {

					passedLastDay = true;
				} else if (!foundLastDay && DateHelper.daysForMonth(iterationDate.getMonth(), this.year) === iterationDate.getDate()) {
					foundLastDay = true;
				}

				if (!foundFirstDay || passedLastDay) {
					//reset instead of initiate
					this.dayBlocks[row][column].reset({row: row, column: column, empty: true});

				} else {

					//reset instead of initiate
					this.dayBlocks[row][column].reset({row: row, column: column, day: iterationDate.getDate(), numberOfFitnessClasses: 0});
					iterationDate.setDate(iterationDate.getDate() + 1);
					counter++;
				}

				
			}
		}
	}
});

//setup the MonthView instance
var currentDate = new Date();
var monthView = new MonthView({month: currentDate.getMonth(), year: currentDate.getYear() + 1900});

//set up other events
$('#leftArrow').click(function() {
	monthView.decrementMonth();
});

$('#rightArrow').click(function() {
	monthView.incrementMonth();
});
