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
	el: '#entryDates',
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

	var EntryDatesEdit = Backbone.View.extend({
			'el': '#e_datesEdit',
			isShowing: false,
			event: {
				'click #e_datesEdit > input:nth-child(4)': 'onSubmit',
				'click #e_datesEdit > input:nth-child(5)': 'onCancel'
			},
			show: function() {
				this.$el.show();
			},
			hide: function() {
				this.$el.hide();
			},
			test: function() {
				console.log("Test called");
			},
			onSubmit: function() {
				console.log("On submit called");
			},
			onCancel: function() {
				console.log("On cancel called");
			}
		}),

		StartDatesEdit = Backbone.View.extend({
			'el': '#s_datesEdit'
		}),

		TeamsEdit = Backbone.View.extend({
			'el': '#teamsEdit'
		}),

		GamesEdit = Backbone.View.extend({
			'el': '#gamesEdit'
		});




	return {
		getInstance: function(elName) {
			var name = elName.toLowerCase();
			switch(elName) {
				case 'e_dates':
					if (!EntryDatesEdit.instance) {
						EntryDatesEdit.instance = new EntryDatesEdit();
					}
					return EntryDatesEdit.instance;
				case 's_dates':
					if (!StartDatesEdit.instance) {
						StartDatesEdit.instance = new StartDatesEdit();
					}
					return StartDatesEdit.instance;
				case 'teams':
					if (!TeamsEdit.instance) {
						TeamsEdit.instance = new TeamsEdit();
					}
					return TeamsEdit.instance;
				case 'games':
					if (!GamesEdit.instance) {
						GamesEdit.instance = new GamesEdit();
					}
					return GamesEdit.instance;
				default: 
					//error
					throw new Error("Edit view could not find instance with name " + elName);
					break;
			}
		}
	};

})();