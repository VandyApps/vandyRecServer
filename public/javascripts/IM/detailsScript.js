//NEED TO ADD CHECKS FOR ISEDITTING WITHIN THE VIEW OBJECTS

//Declarations
var E_DatesView,
	S_DatesView,
	TeamsView,
	GamesView,
	EditView;


//Views
NameView = Backbone.View.extend({
	el: '#sportName',
	sportName: '',
	events: {
		'click div': 'editName'
	},
	initialize: function(model) {
		$('h3', this.$el).text(model.get('sport'));

		this.model = model;
		model.on('change:sport', function() {
			this.sportName = model.get('sport');
			$('h3', this.$el).text(model.get('sport'));
		}.bind(this));
	},
	editName: function() {
		var nameEdit = EditView.getInstance('name');

		nameEdit.show();
		nameEdit.on('submit', function() {
			this.model.set('sport', nameEdit.sportName);

			nameEdit.unbind('submit');
			nameEdit.unbind('cancel');
		}.bind(this));
		nameEdit.on('cancel', function() {
			nameEdit.unbind('submit');
			nameEdit.unbind('cancel');
		});
	}
});

E_DatesView = Backbone.View.extend({
	el: '#entryDates',
	startDate: '',
	endDate: '',
	isHidden: true,
	events: {
		'click .edit': 'editDates'
	},
	//pass in the model here and the needed data is extracted
	initialize: function(model) {

		this.model = model;
		this.startDate = model.get('entryDates').start;
		this.endDate = model.get('entryDates').end;

		$('span:nth-of-type(1)', this.$el).text(this.startDate);
		$('span:nth-of-type(2)', this.$el).text(this.endDate);

		//always listen to unexpected changed in the model
		model.on('change:entryDates', function() {

			this.startDate = model.get('entryDates').start;
			this.endDate = model.get('entryDates').end;
			$('span:nth-of-type(1)', this.$el).text(this.startDate);
			$('span:nth-of-type(2)', this.$el).text(this.endDate);

		}.bind(this));
	},
	editDates: function() {
		var datesEdit = EditView.getInstance('dates');

		datesEdit.startDate = this.startDate;
		datesEdit.endDate = this.endDate;
		datesEdit.show();

		datesEdit.on('submit', function() {
			//registered event takes care of setting the views parameters and 
			//rendering the correct dates
			this.model.set('entryDates', {start: datesEdit.startDate, end: datesEdit.endDate});
			//this.startDate = datesEdit.startDate;
			//this.endDate = datesEdit.endDate;

			datesEdit.unbind('submit');
			datesEdit.unbind('cancel');

		}.bind(this));

		datesEdit.on('cancel', function() {

			datesEdit.unbind('submit');
			datesEdit.unbind('cancel');
		});

	}
});


S_DatesView = Backbone.View.extend({
	el: '#seasonDates',
	startDate: '',
	endDate: '',
	events: {
		'click .edit': 'editDates'
	},
	initialize: function(model) {
		this.model = model;
		this.startDate = model.get('seasonDates').start;
		this.endDate = model.get('seasonDates').end;
		$('span:nth-of-type(1)', this.$el).text(this.startDate);
		$('span:nth-of-type(2)', this.$el).text(this.endDate);

		model.on('change:seasonDates', function() {
			this.startDate = model.get('seasonDates').start;
			this.endDate = model.get('seasonDates').end;
			$('span:nth-of-type(1)', this.$el).text(this.startDate);
			$('span:nth-of-type(2)', this.$el).text(this.endDate);

		}.bind(this));
	},
	editDates: function() {
		var datesEdit = EditView.getInstance('dates');
		datesEdit.startDate = this.startDate;
		datesEdit.endDate = this.endDate;
		datesEdit.show();
		datesEdit.on('submit', function() {

			this.model.set('seasonDates', {start: datesEdit.startDate, end: datesEdit.endDate});

			datesEdit.unbind('submit');
			datesEdit.unbind('cancel');
		}.bind(this));

		datesEdit.on('cancel', function() {
			datesEdit.unbind('submit');
			datesEdit.unbind('cancel');
		});
	}
});


TeamsView = Backbone.View.extend({
	el: '#teams',
	isShowing: false,
	teams: [],
	events: {
		'click div:nth-child(1)': 'toggle',
		'click ul li div:nth-child(5)': 'editTeam',
		'click ul li div:nth-child(6)': 'removeTeam',
		'click #addButton': 'addTeam'
	},
	initialize: function(model) {
		this.model = model;
		this.teams = model.get('teams').slice();
		this.resetTeams();
		this.model.on('change:teams', function() {

			this.teams = model.get('teams');
			this.resetTeams();

		}.bind(this));
	},
	hide: function() {
		this.isShowing = false;
		$('ul', this.$el).slideUp();
	},
	show: function() {
		this.isShowing = true;
		$('ul', this.$el).slideDown();
	},
	toggle: function() {
		if (this.isShowing) {
			this.hide();
		} else {
			this.show();
		}
	},
	//takes the event that is being fired and
	//parses out the index of the li
	//that it is referring to
	getIndex: function(event) {
		return $(event.delegateTarget).parent().index();
	},
	editTeam: function(event) {
		
		var teamsEdit, index, team;
		if (!EditView.isEditting()) {

			teamsEdit = EditView.getInstance('teams');
			index = this.getIndex(event);
			
			team = this.teams[index];
			
			//set the variables of teams edit
			teamsEdit.name = team.name;
			teamsEdit.wins = team.WLT[0];
			teamsEdit.losses = team.WLT[1];
			teamsEdit.ties = team.WLT[2];

			teamsEdit.show();
			teamsEdit.on('submit', function() {

				this.setTeamAtIndex(index, {name: teamsEdit.name, WLT: [teamsEdit.wins, teamsEdit.losses, teamsEdit.ties], teamID: team.teamID});
				
				teamsEdit.unbind('submit');
				teamsEdit.unbind('cancel');
			}.bind(this));

			teamsEdit.on('cancel', function() {

				teamsEdit.unbind('submit');
				teamsEdit.unbind('cancel');
			});
		}
			
	},
	//fix this to make sure teamObj has the correct properties
	setTeamAtIndex: function(index, teamObj) {
		var teamEl = $('ul li:nth-child('+(index+1)+')', this.$el);
		this.teams[index] = teamObj;
		//a silent set by using the getter
		this.model.get('teams')[index] = teamObj;

		//set the DOM element
		$('div:nth-child(1)', teamEl).text(teamObj.name);
		$('div:nth-child(2)', teamEl).text('Wins: ' + teamObj.WLT[0].toString());
		$('div:nth-child(3)', teamEl).text('Losses: ' + teamObj.WLT[1].toString());
		$('div:nth-child(4)', teamEl).text('Ties:' + teamObj.WLT[2].toString());

	},
	addTeam: function() {
		var defaultObj = {
			name: "New Team",
			WLT: [0,0,0]
		}

		this.teams.push(defaultObj);
		//silent set
		this.model.get('teams').push(defaultObj);

		$('<li></li>')	.append('<div>New Team</div>')
						.append('<div>Wins: 0</div>')
						.append('<div>Losses: 0</div>')
						.append('<div>Ties: 0</div>')
						.append('<div>edit</div><div>delete</div>').appendTo('ul', this.$el);

	},
	removeTeam: function(event) {
		var confirm = new ConfirmationBox(
		{
			message: 'Are you sure you would like to delete this team',
			button1Name: 'YES',
			button2Name: 'NO'
		});
		confirm.show();
		confirm.on('clicked1', function() {
			var index = this.getIndex(event),
				self = this;

			$('ul li:nth-child('+ (index + 1).toString()+ ')', this.$el).slideUp(400, function() {
				var modelTeams = self.model.get('teams');
				//remove the element
				this.remove();
				self.teams.splice(index, 1);
				//silently set the model
				modelTeams.splice(index, 1);
			});
			confirm.unbind('clicked1');
			confirm.unbind('clicked2');
		}.bind(this));

		confirm.on('clicked2', function() {
			confirm.unbind('clicked1');
			confirm.unbind('clicked2');
		});
	},
	//uses the teams property of the object to set up the elements within the
	//teams list
	//removes all currently set teams and resets the teams displayed using the
	//teams property
	resetTeams: function() {
		var i, n, list = $('ul', this.$el);
		list.children().remove();
		for (i =0, n = this.teams.length; i < n; ++i) {
			$('<li></li>')	.append('<div>'+ this.teams[i].name + '</div>')
							.append('<div>Wins: ' + this.teams[i].WLT[0] + '</div>')
							.append('<div>Losses: ' + this.teams[i].WLT[1] + '</div>')
							.append('<div>Ties: ' + this.teams[i].WLT[2] + '</div>')
							.append('<div>edit</div><div>delete</div>').appendTo(list);

		}
	}
});


GamesView = Backbone.View.extend({
	el: '#games',
	isShowing: false,
	events: {
		'click div:nth-child(1)': 'toggle'
	},
	initialize: function(model) {},
	
	show: function() {
		$('ul', this.$el).slideDown();
		this.isShowing = true;
	},
	hide: function() {
		$('ul', this.$el).slideUp();
		this.isShowing = false;
	},
	toggle: function() {
		if (this.isShowing) {
			this.hide();
		} else {
			this.show();
		}
	},
	editGame: function() {},
	addGame: function() {},
	removeGame: function() {} 
});

//edit view contains all the windows that have
//access to editting the data within the model
//each window has a singleton that can be accessed through
//this method
EditView = (function() {
	//indicates if any of the windows are active
	var isEditting = false,

		NameEdit = Backbone.View.extend({

			el: '#nameEdit',
			isShowing: false,
			sportName: '',
			events: {
				'click input[value="submit"][type="button"]': 'onSubmit',
				'click input[value="cancel"][type="button"]': 'onCancel',
				'blur input[type="text"]': 'setName'
			},
			show: function() {
				if (!isEditting) {

					$('input:nth-of-type(1)', this.$el).val(this.sportName);
				 
					this.$el.show();
					this.isShowing = true;
					isEditting = true;
				}
				
			},
			hide: function() {
				this.isShowing = false;
				isEditting = false;
				this.$el.hide();
			},
			onSubmit: function() {
				this.trigger('submit');
				
				this.hide();
			},
			onCancel: function() {
				this.trigger('cancel');
				this.hide();
			},
			setName: function() {
				this.sportName = $('input[type="text"]', this.$el).val();
			}
		}),

		DatesEdit = Backbone.View.extend({
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
				if (!isEditting) {
					this.setStartDateTag();
					this.setEndDateTag();
					this.$el.show();
					this.isShowing = true;
					isEditting = true;
				}
					
			},
			hide: function() {
				this.$el.hide();
				this.isShowing = false;
				isEditting = false;
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
			isShowing: false,
			wins: 0,
			losses: 0,
			ties: 0,
			events: {
				'click input[value="submit"][type="button"]': 'onSubmit',
				'click input[value="cancel"][type="button"]': 'onCancel',
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
				if (!isEditting) {
					$('input:nth-child(2)', this.$el).val(this.name);
					$('div:nth-child(3) input', this.$el).val(this.wins.toString());
					$('div:nth-child(4) input', this.$el).val(this.losses.toString());
					$('div:nth-child(5) input', this.$el).val(this.ties.toString());
					this.$el.show();
					this.isShowing = true;
					isEditting = true;
				}
					
			},
			hide: function() {
				this.$el.hide();
				this.isShowing = false;
				isEditting = false;
			}
		}),

		GamesEdit = Backbone.View.extend({
			'el': '#gamesEdit',
			//here are the default values if they were
			//not set prior to submission
			isShowing: false,
			homeTeam: 'Home',
			awayTeam: 'Away',
			teamList: ["Lakers", "Spurs", "Clippers", "Grizzlies", "Jazz", "Celtics"],
			homeScore: 0,
			awayScore: 0,
			date: '01/01/2013',
			startTime: '01:00am',
			endTime: '02:00am',
			location: 'Court 1',
			events: {
				'change div:nth-child(2) select': 'dateChanged',
				'change div:nth-child(3) select': 'startTimeChanged',
				'change div:nth-child(4) select': 'endTimeChanged',
				'click input[value="submit"][type="button"]': 'onSubmit',
				'click input[value="cancel"][type="button"]': 'onCancel',
				'blur div:nth-child(5) input': 'homeTeamChanged',
				'blur div:nth-child(6) input': 'awayTeamChanged',
				'blur div:nth-child(7) input:nth-child(1)': 'homeScoreChanged',
				'blur div:nth-child(7) input:nth-child(2)': 'awayScoreChanged',
				'blur div:nth-child(8) input': 'locationChanged'

			},
			
			show: function() {
				if (!isEditting) {

					this.isShowing = true;
					this.$el.show(); 

					//should create setter methods instead
					//of using these here
					this.setDateTag();

					//startTime
					this.setStartTime(this.startTime);

					//endTime
					this.setEndTime(this.endTime);

					$('div:nth-child(5) input', this.$el).val(this.homeTeam);
					$('div:nth-child(6) input', this.$el).val(this.awayTeam);
					$('div:nth-child(8) input', this.$el).val(this.location);
					isEditting = true;
				}
					

			},
			hide: function() {this.$el.hide(); this.isShowing = false; isEditting = false;},
			onSubmit: function() {this.trigger('submit'); this.hide();},
			onCancel: function() {this.trigger('cancel'); this.hide();},

			dateChanged: function() {
				
				var date = this.date.split('/'),
					monthEl = $('div:nth-child(2) select:nth-child(2)', this.$el),
					dayEl = $('div:nth-child(2) select:nth-child(3)', this.$el),
					yearEl = $('div:nth-child(2) select:nth-child(4)', this.$el),
					month = +monthEl.val(), 
					year = +yearEl.val(), 
					days = +dayEl.val();

				while (days > DateHelper.daysForMonth(month - 1, year)) {
					days--;
				}

				if (days <= 9) {
					date[1] = '0' + days.toString();
				} else {
					date[1] = days.toString();
				}
				
				//set the month
				if (month <= 9) {
					date[0] = '0' + month.toString();
				} else {
					date[0] = month.toString();
				}
				//set the year
				date[2] = year.toString();

				this.date = date[0] + '/' + date[1] + '/' + date[2];
				
				this.setDateTag();
				
			},
			setStartTime: function(timeString) {
				var startTime = DateHelper.splitTime(timeString, false);
				this.startTime = timeString;
				$('div:nth-child(3) select:nth-child(2)', this.$el).val(startTime[0]);
				$('div:nth-child(3) select:nth-child(3)', this.$el).val(startTime[1]);
				$('div:nth-child(3) select:nth-child(4)', this.$el).val(startTime[2]);
			},
			setEndTime: function(timeString) {
				var endTime = DateHelper.splitTime(timeString, false);
				this.endTime = timeString;

				$('div:nth-child(4) select:nth-child(2)', this.$el).val(endTime[0]);
				$('div:nth-child(4) select:nth-child(3)', this.$el).val(endTime[1]);
				$('div:nth-child(4) select:nth-child(4)', this.$el).val(endTime[2]);
			},
			setDateTag: function() {
				var date, days, dayEl = $('div:nth-child(2) select:nth-child(3)', this.$el), i, n;

				if (this.date === '' ) {
					throw new Error("the start date is not set correctly within the e_datesEdit");
				}

				date = this.date.split('/');
				days = DateHelper.daysForMonth(+date[0] - 1, + date[2]);

				//make the scores readonly if the game date is before 
				//the current date
				if (DateHelper.dateFromDateString(this.date).getTime() > Date.now()) {
					$('div:nth-child(7) input').val("");
					$('div:nth-child(7) input', this.$el).attr('readonly', true);

				} else {
					$('div:nth-child(7) input', this.$el).attr('readonly', false);
					$('div:nth-child(7) input:nth-child(1)').val(this.homeScore.toString());
					$('div:nth-child(7) input:nth-child(2)').val(this.awayScore.toString());
				}

				//remove all currently existing options

				dayEl.children().remove();

				//fix the options of the start and end days
				for (i=1, n = days; i <= n; ++i) {
					if (i <= 9) {

						dayEl.append('<option value="0' + i + '">' + i + '</option>');
					} else {
						dayEl.append('<option value="' + i + '">' + i + '</option>');
					}
					
				}

				$('div:nth-child(2) select:nth-child(2)', this.$el).val(date[0]);
				dayEl.val(date[1]);
				$('div:nth-child(2) select:nth-child(4)', this.$el).val(date[2]);
				
			},
			//check to make sure that the end time is
			// after the start time
			startTimeChanged: function() {
				var startTime, endTime, endTimeString = "";
				this.startTime = 	$('div:nth-child(3) select:nth-child(2)', this.$el).val() + ':' +
									$('div:nth-child(3) select:nth-child(3)', this.$el).val() +
									$('div:nth-child(3) select:nth-child(4)', this.$el).val();
				//only do this when the start time changes, and not when the end date changes
				//to avoid being too annoying
				if (DateHelper.timeStringInSecs(this.startTime) > DateHelper.timeStringInSecs(this.endTime)) {
					//change the end date
					startTime = DateHelper.splitTime(this.startTime, true);
					endTime = DateHelper.splitTime(this.endTime, true);
					endTime[0] = startTime[0] + 1;
					endTime[1] = startTime[1];
					endTime[2] = startTime[2];
					if (endTime[0] === 13) {
						endTime[0] = 1;
						if (endTime[2] === 'am') {
							endTime[2] = 'pm';
						} else if (endTime[2] === 'pm') {
							endTime[2] = 'am';
						}
					}
					if (endTime[0] <= 9) {
						endTimeString = endTimeString + '0' + endTime[0].toString() + ':';
					} else {
						endTimeString = endTimeString + endTime[0].toString() + ':';
					}

					if (endTime[1] <= 9) {
						endTimeString = endTimeString + '0' + endTime[1].toString();
					} else {
						endTimeString = endTimeString + endTime[1].toString();
					}

					endTimeString = endTimeString + endTime[2];

					this.setEndTime(endTimeString);
				}
			},					
			//check to make sure that the end time is
			//after the start time
			endTimeChanged: function() {

				this.endTime = 	$('div:nth-child(4) select:nth-child(2)', this.$el).val() + ':' +
								$('div:nth-child(4) select:nth-child(3)', this.$el).val() +
								$('div:nth-child(4) select:nth-child(4)', this.$el).val();
			},
			homeTeamChanged: function() {this.homeTeam = $('div:nth-child(5) input', this.$el).val();},
			awayTeamChanged: function() {this.awayTeam = $('div:nth-child(6) input', this.$el).val();},
			homeScoreChanged: function() {
				var scoreEl = $('div:nth-child(7) input:nth-child(1)', this.$el);
				if (this.validateHomeScore()) {
					this.homeScore = +scoreEl.val();
				} else {
					this.homeScore = 0;
					scoreEl.val("0");
				}
			},
			awayScoreChanged: function() {

				var scoreEl = $('div:nth-child(7) input:nth-child(2)', this.$el);
				if (this.validateAwayScore()) {
					this.awayScore = +scoreEl.val();
				} else {
					this.awayScore = 0;
					scoreEl.val("0");
				}
			},
			locationChanged: function() {
				this.location = $('div:nth-child(8) input', this.$el).val();
			},

			//check to see if the home and away scores are
			//numbers
			validateHomeScore: function() {
				var score = $('div:nth-child(7) input:nth-child(1)', this.$el).val();
				return +score === +score;
			},
			validateAwayScore: function() {
				var score = $('div:nth-child(7) input:nth-child(2)', this.$el).val();
				return +score === +score;
			}
		});


	return {
		getInstance: function(elName) {
			var name = elName.toLowerCase();
			switch(elName) {
				case 'name':
					if (!NameEdit.instance) {
						NameEdit.instance = new NameEdit();
					}
					return NameEdit.instance;
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
		},
		isEditting: function() {
			
			return isEditting;
		}
	};

})();


//Script starts here

var sportModel = new IMModel.Sport(JSON.parse(sessionStorage.model)),
	nameView = new NameView(sportModel),
	entryDatesView = new E_DatesView(sportModel),
	seasonDatesView = new S_DatesView(sportModel),
	teamsView = new TeamsView(sportModel),
	gamesEdit = new GamesView(sportModel);



