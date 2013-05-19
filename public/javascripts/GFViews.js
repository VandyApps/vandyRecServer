var MonthView = Backbone.View.extend({

	el: '#calendar',

	month: 0,
	year: 0,

	initialize: function(options) {
		this.month = options.month;
		this.year = options.year;
		this.render();
	},
	render: function() {
		//construct date
		//set iterationDate to the first of the month
		var foundFirstDay = false;
		var counter = 0;
		var iterationDate = new Date(this.year, this.month, 1, 0, 0, 0, 0);
		for (var i = 0; i < 5; ++i) {
			for (var j = 0; j < 7; ++j) {


			}
		}
	}

});

//this is not really a backbone view in that it has not real models but helps 
//delegate the display of models in a separate window
window.BlockView = Backbone.View.extend({

	//the day to display
	day: 0,
	//row and column on the calendar grid
	column: 0,
	row: 0,
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
			this.$el.attr('empty', 'empty');

		} else {
			this.day = options.day;
			this.numberOfFitnessClasses = options.numberOfFitnessClasses;
			this.render();
		}
	},
	render: function() {
		
		this.$el.append('<div class="dayIndicator">'+this.day+'</div>');
		if (this.numberOfFitnessClasses === 1) {

			this.$el.append('<div class="classCountIndicator">1 Class</div>');
		} else if (this.numberOfFitnessClasses > 1) {
			this.$el.append('<div class="classCountIndicator">'+this.numberOfFitnessClasses+" Classes</div>");

		}
	},
	//for resetting the view without removing it
	reset: function(options) {
	}
});

