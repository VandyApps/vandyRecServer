var IMView = {};

//should never have to directly call the table element
//view.  Views are generated by passing a model into the 
//table section
IMView.TableElement = Backbone.View.extend({
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
		if (this.model.isNew()) {

		} else {
			sessionStorage.id = JSON.stringify(this.model.get('_id'));
		}
		
	}
});

IMView.TableSection = Backbone.View.extend({
	//array of views that exist in the table view,
	//in the order that they appear in the table view
	items: [],
	//pass in the seasonIndex 0, 1, 2, 3
	initialize: function(options) {
		//must have a specified season
		if (!options || options.season === undefined) {
			throw new Error("Must include the season index of the table");
		}
		//set the season for quick access
		this.season = options.season;
		switch(options.season) {
			case 0:
				this.$el = $('#FallSeason');
				break;
			case 1:
				
				this.$el = $('#WinterSeason');
				break;
			case 2:
				this.$el = $('#SpringSeason');
				break;
			case 3:
				this.$el = $('#SummerSeason');
				break;
			default:
				throw new Error("The season index is incorrect");
		}

		//events outside of el
		$('#hoursAdd-'+this.season.toString()).click(function() {
			this.addElement();
		}.bind(this));
	},
	//accepts a model and creates a view, then
	//appends the view to the end of the table
	//does nothing if the model has a 
	//non-corresponding season value
	append: function(model) {
		var view = new IMView.TableElement({model: model});
		this.items.push(view);

		this.$el.append(view.$el);
	},
	prepend: function(model) {
		var view = new IMView.tableElement({model: model});
		this.items = [view].concat(this.items);

		this.$el.prepend(view.$el);
	},
	//removes all elements and resorts them
	//based on the sorting within the 
	//collection
	sort: function() {

	},
	//creates a generic model and adds it to the collection and 
	//creates a view that is appended to the table
	//the model is not persisted to the database
	addElement: function() {
		var modelData = {
				sport: "New Sport",
				season: this.season,
				entryDates: {
					start: "02/01/2013",
					end: "03/03/2013"
				},
				seasonDates: {
					start: "01/01/2013",
					end: "01/05/2013",
				},
				teams: [],
				games: []
			},

			
			model = new IMModel.Sport(modelData);


		IMModel.getCollection().insert(model);
		this.append(model);
	}
});

IMView.getTable = function(season) {
	return new IMView.TableSection({season: season});
};