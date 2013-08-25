//this is not really a backbone view in that it has not real models but helps 
//delegate the display of models in a separate window
CalendarBlock = Backbone.View.extend({

	//the day to display
	day: 0,
	//row and column on the calendar grid
	column: 0,
	row: 0,
	//empty block defaults to false
	//empty means that this block does not represent a valid date
	empty: false,
	//the number of fitness classes to be held on this day
	fitnessClassesForBlock: [],
	specialDate: undefined,

	events: {

		'mouseenter.dayBlock': 'hoverOn',
		'mouseleave.dayBlock': 'hoverOff',
		'click.dayBlock': 'blockClicked'
	},
	
	initialize: function(options) {
		//set the variables
		var columnsSelector, rowSelector;
		this.row = options.row;
		this.column = options.column;

		columnSelector = "#cal-column-" + this.column;
		rowSelector = ".cal-block-" + this.row;

		this.$el = $(columnSelector).children(rowSelector);

		if (options.empty === true) {
			this.empty = true;

		} else {
			this.empty = false;
			this.day = options.day;
			this.fitnessClassesForBlock = options.fitnessClassesForBlock;
		}

		this.specialDate = options.specialDate;
		
		this.render();
		
	},
	
	render: function() {
		
		if (this.empty) {
			this.$el.attr('empty', 'empty');
		}

		$('.specialDayIndicator', this.$el).remove();
		if (this.specialDate !== undefined) {
			this.$el.addClass('specialDay');
			this.$el.append('<div class="specialDayIndicator">'+this.specialDate.getTitle()+'</div>');
		} else {
			this.$el.removeClass('specialDay');
			
		}

		this.$el.append('<div class="dayIndicator">'+this.day+'</div>');
		if (this.fitnessClassesForBlock.length === 1) {

			this.$el.append('<div class="classCountIndicator">1 Class</div>');

		} else if (this.fitnessClassesForBlock.length > 1) {
			this.$el.append('<div class="classCountIndicator">'+this.fitnessClassesForBlock.length+" Classes</div>");

		} else {
			this.$el.append('<div class="classCountIndicator"><div>');
		}
		
	},
	//for resetting the view for another date 
	//without removing it
	reset: function(options) {
		//set the variables
		var columnSelector, rowSelector;
		this.row = options.row;
		this.column = options.column;

		columnSelector = "#cal-column-" + this.column;
		rowSelector = ".cal-block-" + this.row;

		this.$el = $(columnSelector).children(rowSelector);
		if (options.empty === true) {
			this.empty = true;
			this.$el.attr('empty', 'empty');

		} else {
			this.empty = false;
			this.day = options.day;
			this.fitnessClassesForBlock = options.fitnessClassesForBlock;
		}
		this.specialDate = options.specialDate;
		this.rerender();

	},

	rerender: function() {
		this.$el.removeAttr('style');
		if (this.empty) {
			this.$el.attr('empty', 'empty');
		} else {
			this.$el.removeAttr('empty');
		}

		$('.specialDayIndicator', this.$el).remove();
		if (this.specialDate !== undefined) {
			this.$el.append('<div class="specialDayIndicator">'+this.specialDate.getTitle()+'</div>');
			this.$el.addClass('specialDay');
		} else {
			this.$el.removeClass('specialDay');
			
		}

		this.$('.dayIndicator').text(this.day.toString());
		if (this.fitnessClassesForBlock.length === 1) {

			this.$('.classCountIndicator').text('1 Class');

		} else if (this.fitnessClassesForBlock.length > 1) {

			this.$('.classCountIndicator').text(this.fitnessClassesForBlock.length+' Classes');
		} else { //0 classes
			console.log("There are no classes for day: " + this.day);
			this.$('.classCountIndicator').text('');
			
		}
	},
	hoverOn: function(event) {
		
		//var partialSelector = $(event.delegateTarget).attr('class');
		
		$(event.delegateTarget).not('[empty]').not('.specialDay').animate({backgroundColor: 'rgba(200,200,200,1)'}, 200);
		$(event.delegateTarget).not('[empty]').filter('.specialDay').animate({backgroundColor: 'rgba(255, 166, 109, 1)'}, 200);
	},
	hoverOff: function(event) {
		//check Mozilla-support for this!!!
		$(event.delegateTarget).not('[empty]').not('.specialDay').animate({backgroundColor: 'rgba(0,0,0,0)'}, 200);
		$(event.delegateTarget).not('[empty]').filter('.specialDay').animate({backgroundColor: '#EECBAD'}, 200);
	},
	blockClicked: function(event) {
		
		//if ($(event.delegateTarget).attr('empty') === undefined) {
		if (!this.empty) {
			//trigger clicking of block and pass in the day that
			//was clicked
			this.trigger('calBlockClicked', {day: this.day});
			
		}		
	}	
});

//view for the calendar
//has no model but contains the collections and has 
//events that listen to changes in the collection in order to
//render data on the calendar
Calendar = (function() {
		
	var Instance = Backbone.View.extend({

		el: '#calendar',
		//collection that is used by the view
		fitnessClasses: null,
		month: 0,
		year: 0,
		selectedDay: 0,
		//2D array for blocks in the month view
		//this is an array of rows, and each row 
		//is an array of columns
		dayBlocks: [],

		initialize: function(options) {
			var specialDates = GFModel.SpecialDates.getInstance(),
				self = this;
			this.month = options.month;
			this.year = options.year;
			//this is a collection of backbone models
			//render is called by the reset event on fitness classes
			this.fitnessClasses = options.fitnessClasses;

			//sets the rendering of the calendar for certain
			//events that are fired by the model
			this.fitnessClasses.on("change", this.render, this);
			this.fitnessClasses.on('monthChanged', this.render, this);
			specialDates.on("change", this.render, this);
			this.fitnessClasses.on('add', this.render, this);
			specialDates.on('add', this.render, this);
			specialDates.fetch();
			this.fitnessClasses.fetch({
				success: function() {
					self.render();
				},
				error: function() {
					alert("There was an error when trying to load the group fitness data");
				}
			});
			
		},
		//depending on whether this is the first call
		//to render or a subsequent call to render, the
		//subelements of the calendar are either set or reset
		render: function() {

			var foundFirstDay = false,
			    foundLastDay = false,
			    passedLastDay = false,
	            row = 0,
	            column = 0,
	            iterationDate = new Date(this.year, this.month, 1, 0, 0, 0, 0),

	            specialDates = GFModel.SpecialDates.getInstance();


	        $('#monthWrapper h2:nth-child(1)').text(DateHelper.monthNameForIndex(this.month));
	        $('#monthWrapper h2:nth-child(2)').text(this.year.toString());
			//construct date
			//set iterationDate to the first of the month
			
			for (row = 0; row < 6; ++row) {
				
				//initiate the nested array
				if (this.dayBlocks[row] === undefined) {
					this.dayBlocks[row] = new Array(7);
				}
				
				
				for (column = 0; column < 7; ++column) {

					//check to make sure if 
					//1. Found the first day on the calendar
					//2. Found the last day of the calendar 
					//3. Found the last day of the calendar on the previous iteration
					if (!foundFirstDay && iterationDate.getDay() === column) {
						foundFirstDay = true;

					} else if (foundLastDay) {

						passedLastDay = true;
					} else if (!foundLastDay && DateHelper.daysForMonth(iterationDate.getMonth(), this.year) === iterationDate.getDate()) {
						foundLastDay = true;
					}


					if (!foundFirstDay || passedLastDay) {
						
						//create an empty element
						if (!this.dayBlocks[row][column]) {

							this.dayBlocks[row][column] = new CalendarBlock({row: row, column: column, empty: true});
							//must also add the event to the blocks that are initially created
							//as empty, because these blocks can be reset to contain data
							//when the calendar changes months.  The blocks check 
							//at run-time if the block is in a state of empty before
							//calling the event, but should listen to all blocks
							this.dayBlocks[row][column].on('calBlockClicked', function(event) {
									//set the selected day of the calendar and trigger 
									//calBlockClicked event for the calendar
									this.selectedDay = event.day;
									this.trigger('calBlockClicked', {day: event.day});
								}, this);
						} else {

							this.dayBlocks[row][column].reset({row: row, column: column, empty: true});
						}
						

					} else {

						//create a filled block
						//set the number of fitness classes to 0 initially
						if (!this.dayBlocks[row][column]) {
							
							if (specialDates.includesDate(iterationDate)) {
								this.dayBlocks[row][column] = new CalendarBlock({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate()), specialDate: specialDates.getSpecialDateForDate(iterationDate)});
								this.dayBlocks[row][column].on('calBlockClicked', function(event) {
									//set the selected day of the calendar and trigger 
									//calBlockClicked event for the calendar
									this.selectedDay = event.day;
									this.trigger('calBlockClicked', {day: event.day});
								}, this);
						
							} else {

								this.dayBlocks[row][column] = new CalendarBlock({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate())});
								this.dayBlocks[row][column].on('calBlockClicked', function(event) {
									//set the selected day of the calendar and trigger 
									//calBlockClicked event for the calendar
									this.selectedDay = event.day;
									this.trigger('calBlockClicked', {day: event.day});
								}, this);

							}
						} else {
							if (specialDates.includesDate(iterationDate)) {
								this.dayBlocks[row][column].reset({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate()), specialDate: specialDates.getSpecialDateForDate(iterationDate)});
							} else {
								this.dayBlocks[row][column].reset({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate())});
							}

						}
						console.log(this.fitnessClasses.getClassesForDay(iterationDate.getDate()).length);
						//increment the iteration date
						iterationDate.setDate(iterationDate.getDate() + 1);
						
					}	
				}
			}
			
		},
		//returns an array of the classes that exist within
		//the day for the calendar, for the current month and year
		getClassesForDay: function(day) {
			var date = new Date(this.year, this.month, day),
				column, row, i;

			//find the block that the day references
			column = date.getDay();
			for (i =0; i < 6; ++i) {
				if (!this.dayBlocks[i][column].empty && this.dayBlocks[i][column].day == day) {
					return this.dayBlocks[i][column].fitnessClassesForBlock;
				}
			}
			return null;

		},
		//getters and setters for the calendar
		//properties
		incrementMonth: function() {
			this.month += 1;
			if (this.month > 11) {
				this.month = 0;
				this.year += 1;
				
			}
			this.fitnessClasses.incrementMonth();
		
		},
		decrementMonth: function() {
			this.month -= 1;
			if (this.month < 0) {
				this.month = 11;
				this.year -= 1;

			}
			this.fitnessClasses.decrementMonth();
			this.render();
		},
		getCalendar: function(month, year) {
			this.month = month;
			this.year = year;
			this.fitnessClasses.getCalendar(month,year);
		},

		getMonth: function() {
			return this.month;
		},
		getMonthName: function() {
			return DateHelper.monthNameForIndex(this.month);
		},

		getYear: function() {
			return this.year;
		},
		//selected day of 0 indicates that no
		//day was selected
		getSelectedDay: function() {
			return this.selectedDay;
		},
		//returns a Date object if there
		//is a selected date, and null
		//if there is no selected date
		getSelectedDate: function() {
			if (this.selectedDay === 0) {
				return null;
			} else {
				return new Date(this.year, this.month, this.selectedDay);
			}
		},
		getSelectedWeekDay: function() {
		 	return this.getSelectedDate().getDay();
		}
	});


	//the calendar object exposed
	return {
		initialize: function() {
			var currentDate = new Date();
			Calendar.instance = new Instance({month: currentDate.getMonth(), year: currentDate.getYear() + 1900, fitnessClasses: GFModel.FitnessClasses.getInstance()});

		},

		getInstance: function() {
			var currentDate;
			if (!Calendar.instance) {
				currentDate = new Date();
				Calendar.instance = new Instance({month: currentDate.getMonth(), year: currentDate.getYear() + 1900, fitnessClasses: GFModel.FitnessClasses.getInstance()});
			}
			return Calendar.instance;
		}
	};
})();