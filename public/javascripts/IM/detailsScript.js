//Declarations
var sportDetails,
	E_DatesView,
	S_DatesView,
	TeamsView,
	GamesView,
	EditView;



//Model

SportDetails = Backbone.Model.extend({

});

//singleton
SportDetails.getInstance = function() {
	if (!sportDetails.instance) {
		sportDetails.instance = new SportDetails();
	}
	return sportDetails.instance;
};

//Views

E_DatesView = Backbone.View.extend({
	el: '#entryDates'
	startDate: '',
	endDate: '',
	isHidden: true,
	events: {

	},
	render: function() {

	},
	toggle: function() {

	},
	show: function() {

	},
	hide: function() {

	}
});

E_DatesView.getInstance = function() {
	if (!this.instance) {
		this.instance = new E_DatesView();
	}
	return this.instance;
};


S_DatesView = Backbone.View.extend({
	el: '#seasonDates'
});

S_DatesView.getInstance = function() {
	if (!this.instance) {
		this.instance = new S_DatesView();
	}
	return this.instance;
};


TeamsView = Backbone.View.extend({
	el: '#teams'
});

TeamsView.getInstance = function() {
	if (!this.instance) {
		this.instance = new TeamsView();
	}
	return this.instance;
};

GamesView = Backbone.View.extend({
	el: '#games',
});

GamesView.getInstance = function() {
	if (!this.instance) {
		this.instance = new GamesView();
	}
	return this.instance;
};

//edit view contains all the windows that have
//access to editting the data within the model
//each window has a singleton that can be accessed through
//this method
EditView = (function() {

	var e_dates_edit = new Backbone.View.extend({
			'el': '#e_datesEdit'
		}),

		s_dates_edit = new Backbone.View.extend({
			'el': '#s_datesEdit'
		}),

		teams_edit = new Backbone.View.extend({
			'el': '#teamsEdit'
		}),

		games_edit = new Backbone.View.extend({
			'el': '#gamesEdit'
		});


	return {
		getInstance: function(elName) {
			var name = elName.toLowerCase();
			switch(elName) {
				case: 'e_dates':
					return e_dates_edit;
				case: 's_dates':
					return s_dates_edit;
				case 'teams':
					return teams_edit;
				case: 'games':
					return games_edit;
				default: 
					//error
					throw new Error("Edit view could not find instance with name " + elName);
					break;
			}
		}
	};

});