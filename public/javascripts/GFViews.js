var MonthView = Backbone.View.extend({

	el: '#calendar',

	month: 0,
	day: 0,
	year: 0,

	events: {


	},

	initialize: function() {
		this.render();
	},
	render: function() {

	}

});

//this is not really a backbone view in that it has not real models but helps 
//delegate the generation of models in a separate window
window.BlockView = Backbone.View.extend({

	//the day to display
	day: 0,
	//the number of fitness classes to be held on this day
	numberOfFitnessClasses: 0,
	//initialize with a row and column specifying the coordinates
	//of the block on the calendar
	//set the day that this block is to represent
	initialize: function(row, column, day) {
		//set up the element
		var calenderRow = '.cal-block-' + row; 
		var calendarColumn = '#cal-column-' + column;
		this.$el = $(calendarColumn).children(calenderRow);
		this.day = day;
		this.render();
	},
	render: function() {

		this.$el.append('<div class="dayIndicator">'+this.day+'</div>');
		
	}
});