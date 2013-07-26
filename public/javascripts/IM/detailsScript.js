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

	var DatesEdit = Backbone.View.extend({
			el: '#datesEdit',
			isShowing: false,
			startDate: '',
			endDate: '',
			_start: {
				month: $('div:nth-child(2) select:nth-child(2)', this.$el),
				day: $('div:nth-child(2) select:nth-child(3)', this.$el),
				year: $('div:nth-child(2) select:nth-child(4)', this.$el)
			},
			_end: {
				month: $('div:nth-child(3) select:nth-child(2)', this.$el),
				day: $('div:nth-child(3) select:nth-child(3)', this.$el),
				year: $('div:nth-child(3) select:nth-child(4)', this.$el)
			},
			events: {
				'click input:nth-child(4)': 'onSubmit',
				'click input:nth-child(5)': 'onCancel',
				//listen for changes to the start date
				'change div:nth-child(2) select': 'startChanged',
				//listen for changes to the end date
				'change div:nth-child(3) select': 'endChanged'
				
			},
			show: function() {
				
				this.setStartDateTag();
				this.setEndDateTag();
				this.$el.show();
				this.isShowing = true;
			},
			hide: function() {
				this.$el.hide();
				this.isShowing = false;
			},
			onSubmit: function() {

				
				this.trigger('submit');
				this.hide();
			},
			onCancel: function() {
				this.trigger('cancel');
				this.hide();
			},
			//uses the start and end date properties
			//to create the tags for the start and end dates
			setStartDateTag: function() {
				var startDate, startDays, i, n;

				if (this.startDate === '' ) {
					throw new Error("the start date is not set correctly within the e_datesEdit");
				}

				startDate = this.startDate.split('/');
				startDays = DateHelper.daysForMonth(+startDate[0] - 1, +startDate[2]);
				//remove all currently existing options

				this._start.day.children().remove();

				//fix the options of the start and end days
				for (i=1, n = startDays; i <= n; ++i) {
					if (i <= 9) {

						this._start.day.append('<option value="0' + i + '">' + i + '</option>');
					} else {
						this._start.day.append('<option value="' + i + '">' + i + '</option>');
					}
					
				}

				this._start.month.val(startDate[0]);
				this._start.day.val(startDate[1]);
				this._start.year.val(startDate[2]);
				
			},
			setEndDateTag: function() {
				var endDate, startDays, endDays, i, n;

				if (this.endDate === '' ) {
					throw new Error("the end date is not set correctly within the e_datesEdit");
				}

				endDate = this.endDate.split('/');
				endDays = DateHelper.daysForMonth(+endDate[0] - 1, +endDate[2]);
				//remove all currently existing options

				this._end.day.children().remove();

				for (i=1, n = endDays; i <= n; ++i) {
					if (i <= 9) {

						this._end.day.append('<option value="0' + i + '">' + i + '</option>');
					} else {
						this._end.day.append('<option value="' + i + '">' + i + '</option>');
					}
					
				}

				this._end.month.val(endDate[0]);
				this._end.day.val(endDate[1]);
				this._end.year.val(endDate[2]);
			},
			startChanged: function() {
				var startDate = this.startDate.split('/'),
					month = +this._start.month.val(), 
					year = +this._start.year.val(), 
					days = +this._start.day.val(), 
					changed = false;

				while (days > DateHelper.daysForMonth(month - 1, year)) {
					days--;
					changed = true;
				}

				if (days <= 9) {
					startDate[1] = '0' + days.toString();
				} else {
					startDate[1] = days.toString();
				}
				
				//set the month
				if (month <= 9) {
					startDate[0] = '0' + month.toString();
				} else {
					startDate[0] = month.toString();
				}
				//set the year
				startDate[2] = year.toString();

				this.startDate = startDate[0] + '/' + startDate[1] + '/' + startDate[2];
				this.setStartDateTag();

			},
			endChanged: function() {
				var endDate = this.endDate.split('/'),
					month = +this._end.month.val(), 
					year = +this._end.year.val(), 
					days = +this._end.day.val(), 
					changed = false;

				while (days > DateHelper.daysForMonth(month - 1, year)) {
					days--;
					changed = true;
				}

				if (days <= 9) {
					endDate[1] = '0' + days.toString();
				} else {
					endDate[1] = days.toString();
				}
				
				//set the month
				if (month <= 9) {
					endDate[0] = '0' + month.toString();
				} else {
					endDate[0] = month.toString();
				}
				//set the year
				endDate[2] = year.toString();

				this.endDate = endDate[0] + '/' + endDate[1] + '/' + endDate[2];
				this.setEndDateTag();
			}
		}),


		TeamsEdit = Backbone.View.extend({
			'el': '#teamsEdit',
			name: '',
			wins: 0,
			losses: 0,
			ties: 0,
			events: {
				'click input[value="submit"]': 'onSubmit',
				'click input[value="cancel"]': 'onCancel',
				'blur input:nth-child(2)': 'updateName',
				'blur div:nth-child(3) input': 'updateWins',
				'blur div:nth-child(4) input': 'updateLosses',
				'blur div:nth-child(5) input': 'updateTies'
			},
			onSubmit: function() {
				this.trigger('submit');
				this.hide();
			},
			onCancel: function() {
				this.trigger('cancel');
				this.hide();
			},
			updateName: function() {
				var name = $('input:nth-child(2)', this.$el).val();
				if (name === "") {
					name = this.name;
					$('input:nth-child(2)', this.$el).val(name);
				} else {
					this.name = name;
				}
				
			},
			updateWins: function() {
				var wins = $('div:nth-child(3) input').val();
				if (+wins !== +wins) {
					wins = "0";
					$('div:nth-child(3) input').val("0");
				}
				this.wins = +wins;

			},
			updateLosses: function() {
				var losses = $('div:nth-child(4) input').val();
				if (+losses !== +losses) {
					losses = "0";
					$('div:nth-child(4) input').val("0");
				}
				this.losses = +losses;
			},
			updateTies: function() {
				var ties = $('div:nth-child(5) input').val();
				if (+ties !== +ties) {
					ties = "0";
					$('div:nth-child(5) input').val("0");
				}
				this.ties = +ties;
			},
			show: function() {
				$('input:nth-child(2)', this.$el).val(this.name);
				$('div:nth-child(3) input', this.$el).val(this.wins.toString());
				$('div:nth-child(4) input', this.$el).val(this.losses.toString());
				$('div:nth-child(5) input', this.$el).val(this.ties.toString());
				this.$el.show();
			},
			hide: function() {
				this.$el.hide();
			}
		}),

		GamesEdit = Backbone.View.extend({
			'el': '#gamesEdit'
		});


	return {
		getInstance: function(elName) {
			var name = elName.toLowerCase();
			switch(elName) {
				case 'dates':
					if (!DatesEdit.instance) {
						DatesEdit.instance = new DatesEdit();
					}
					return DatesEdit.instance;
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