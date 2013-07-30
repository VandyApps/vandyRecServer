var IMView = {};

IMView.tableElement = Backbone.View.extend({
	tagName: 'li',
	events: function() {
		return {
			'click a': 'navigateToDetails'
		};
	},
	initialize: function(options) {
		if (!options || !options.model) {
			throw new Error("Need to include the model in the parameters");
		}
		this.model = options.model;
		this.render();

		//add model-listening events here
		this.model.on('change:sport', function() {
			$('.intramuralsItem-name', this.$el).text(this.model.get('sport'));
		}.bind(this));
		this.model.on('change:startDate', function() {
			$('.intramuralsItem-startDate', this.$el).text(this.model.get('startDate'));
		}.bind(this));
		this.model.on('change:endDate', function() {
			$('.intramuralsItem-endDate', this.$el).text(this.model.get('endDate'));
		}.bind(this));
	},
	render: function() {
		var linkEl;
		this.$el.append('<a href="intramurals/details"></a>');
		linkEl = $('a', this.$el);

		linkEl.append('<div class="intramuralsItem-name">' + this.model.get('sport') + '</div>')
				.append('<div class="intramuralsItem-startDate">' + this.model.get('seasonDates').start + '</div>')
				.append('<div class="intramuralsItem-endDate">' + this.model.get('seasonDates').end + '</div>');


	},
	navigateToDetails: function() {
		sessionStorage.model = JSON.stringify(this.model);
	}
});

IMView.tableSection = Backbone.View.extend({

	//pass in the seasonIndex 0, 1, 2, 3
	intitialize: function(options) {
		if (!options || !options.season) {
			throw new Error("Must include the season index of the table");
		}
		//set the season for quick access
		this.season = options.season;
		switch(options.season) {
			case 0:
				this.$el = $('#FallSeason');
				this.collection = IMModel.getInstance('fall');
				break;
			case 1:
				this.$el = $('#WinterSeason');
				this.collection = IMModel.getInstance('winter');
				break;
			case 2:
				this.$el = $('#SpringSeason');
				this.collection = IMModel.getInstance('spring');
				break;
			case 3:
				this.$el = $('#SummerSeason');
				this.collection = IMModel.getInstance('summer');
				break;
			default:
				throw new Error("The season index is incorrect");
		}
		this.render();
	},
	render: function() {
		//iterate through the collection and create
		//views for all the models
		this.collection.each(function(model) {
			//do stuff here with the model
		});
	},
	//accepts a model and creates a view, then
	//appends the view to the end of the table
	//does nothing if the model has a 
	//non-corresponding season value
	append: function(model) {

	},
	preprend: function(model) {

	},
	//removes all elements and resorts them
	//based on the sorting within the 
	//collection
	sort: function() {

	}
});