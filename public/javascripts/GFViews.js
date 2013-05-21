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
	events: {

		'mouseenter.dayBlock': 'hoverOn',
		'mouseleave.dayBlock': 'hoverOff',
		'click.dayBlock': 'showForm'
	},
	
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
		this.$el.removeAttr('style');
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
	},
	hoverOn: function(event) {
		
		var partialSelector = $(event.delegateTarget).attr('class');
		
		$(event.delegateTarget).not('[empty]').animate({backgroundColor: 'rgba(200,200,200,1)'}, 200);
	},
	hoverOff: function(event) {
		
		$(event.delegateTarget).not('[empty]').animate({backgroundColor: 'rgba(0,0,0,0)'}, 200);
	},
	showForm: function(event) {
		
		if (typeof $(event.delegateTarget).attr('empty') === "undefined") {
			
			var dayOfWeekIndex = parseInt($(event.delegateTarget).parent().attr('id').charAt(11), 10);

			
			var windowTitle = DateHelper.weekDayAsString(dayOfWeekIndex) +', '+$('#month').text()+' '+$('.dayIndicator' , event.delegateTarget).text()+' '+$('#year').text();
			$('#formWindow-title').text(windowTitle);
			$('#windowPrimer').fadeIn(400, function() {
				$('#formWindow').show();
			});
		}
		
	}
	
});





//view for the calendar
//has no model but contains the collections and has 
//events that listen to changes in the collection in order to
//render data on the calendar
var MonthView = Backbone.View.extend({

	el: '#calendar',
	//collection that is used by the view
	fitnessClasses: null,
	month: 0,
	year: 0,
	//2D array for blocks in the month view
	//this is an array of rows, and each row 
	//is an array of columns
	dayBlocks: [],

	initialize: function(options) {
		console.log("initialize");
		this.month = options.month;
		this.year = options.year;
		//this is a collection of backbone models
		//render is called by the reset event on fitness classes
		this.fitnessClasses = options.fitnessClasses;
		//set the reset event for rendering the calendar
		this.fitnessClasses.on('reset', this.render, this);
		
		this.fitnessClasses.fetch();
		
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
			if (typeof this.dayBlocks[row] === 'undefined') {
				this.dayBlocks[row] = new Array(7);
			}
			
			
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
					if (typeof this.dayBlocks[row][column] === 'undefined') {

						this.dayBlocks[row][column] = new BlockView({row: row, column: column, empty: true});
					} else {

						this.dayBlocks[row][column].reset({row: row, column: column, empty: true});
					}
					

				} else {
					
					//create a filled column
					//set the number of fitness classes to 0 initially
					if (typeof this.dayBlocks[row][column] === 'undefined') {
						
						this.dayBlocks[row][column] = new BlockView({row: row, column: column, day: iterationDate.getDate(), numberOfFitnessClasses: 0});
					} else {
						

						this.dayBlocks[row][column].reset({row: row, column: column, day: iterationDate.getDate(), numberOfFitnessClasses: 0});
					}
					
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
		this.fitnessClasses.incrementMonth();
	
	},
	decrementMonth: function() {
		this.month -= 1;
		if (this.month < 0) {
			this.month = 11;
			this.year -= 1;

		}
		//calls reset and renders new calendar
		this.fitnessClasses.decrementMonth();
	}
});

//does not have a single model that it renders
//manages the creation and deletion of models
//that are being rendered in the window form
var GFClassForm = Backbone.View.extend({

	el: '#formWindow-classes',

	events: {

		//need an event for clicking submit on the form
		'click #formWindow-newClass-title': 'toggleForm'
		//need events to manage selections and changes to existing classes
	},


	initialize: function(options) {
		
	},
	render: function() {

	},
	//adds class that was submitted by the form
	//and appends it immediately after the class creation
	//form
	addClass: function() {

	},
	//this toggles the appearance of the new class form
	toggleForm: function() {
		$('#formWindow-newClass-form').slideToggle();
	}
});

var formWindowView = new GFClassForm();
//this backbone view does take a model of a single class
//that it renders to a li
var GFClassView = Backbone.View.extend({

	className: 'formWindow-existingClass',

	events: {
		
	},
	//render the list item with necessary forms for
	//changing options
	render: function() {

	},
	//for deleting a single instance
	deleteOne: function() {

	},
	//for deleting many instances
	deleteMany:function() {

	}
	

});


//set up other events
$('#leftArrow').click(function() {
	monthView.decrementMonth();
});

$('#rightArrow').click(function() {
	monthView.incrementMonth();
});
$('#windowPrimer,#formWindow-exit').click(function() {
	$('#windowPrimer').hide();
	$('#formWindow').hide();
});
$('#formWindow-exit').mouseover(function() {
	$(this).animate({backgroundColor: '#cb7c01'}, 200);
});
$('#formWindow-exit').mouseout(function() {
	$(this).animate({backgroundColor: 'rgba(0,0,0,0)'}, 200);
});


