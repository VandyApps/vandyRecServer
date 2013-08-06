var IMModel = {};

IMModel.Sport = Backbone.Model.extend({
	url: '/intramurals',
	idAttribute: '_id',
	initialize: function(options) {
		if (options) {
			this.set('sport', options.sport || 'New Sport');
			this.set('season', options.season || 0);
			this.set('entryDates', options.entryDates || {start: '01/01/2013', end: '01/02/2013'});
			this.set('seasonDates', options.seasonDates || {start: '02/01/2013', end: '02/02/2013'});
			this.set('teams', options.teams || []);
			this.set('games', options.games || []);
		} else {
			this.set('sport', 'New Sport');
			this.set('season', 0);
			this.set('entryDates', {start: '01/01/2013', end: '01/02/2013'});
			this.set('seasonDates', {start: '02/01/2013', end: '02/02/2013'});
			this.set('teams',  []);
			this.set('games',  []);
		}
			
	},
	entryStart: function() {
		return DateHelper.dateFromDateString(this.get('entryDates').start);
	},
	entryEnd: function() {
		return DateHelper.dateFromDateString(this.get('entryDates').end);
	},
	seasonStart: function() {
		return DateHelper.dateFromDateString(this.get('seasonDates').start);
	},
	seasonEnd: function() {
		return DateHelper.dateFromDateString(this.get('seasonDates').end);
	},
	//resets the wins, ties, and losses for all teams
	resetWLT: function() {
		//set all the WLT, to 0 for all teams
		this.get('teams').forEach(function(team) {
			this.setWins(team.teamID, 0, true);
			this.setLosses(team.teamID, 0, true);
			this.setTies(team.teamID, 0, true);
		}.bind(this));

		this.get('games').forEach(function(game) {
			if (game.winner === 0) {
				this.incrementWins(game.teams[0], true);
				this.incrementLosses(game.teams[1], true);
			} else if (game.winner === 1) {
				this.incrementWins(game.teams[1], true);
				this.incrementLosses(game.teams[0], true);
			} else {
				//it is a tie
				this.incrementTies(game.teams[0], true);
				this.incrementTies(game.teams[1], true);
			}
		}.bind(this));
		//call events down here
		this.trigger('change');
		this.trigger('change:teams');
		this.get('teams').forEach(function(team) {
			this.trigger('change:teams:'+team.teamID.toString());
		}.bind(this));
	},
	//sorts the games in chronological order
	sortGames: function(silent) {
		var games;
		if (silent) {
			games = this.get('games');
			games.sort(function(game1, game2) {
				var time1 = DateHelper.dateFromDateString(game1.date).getTime(),
					time2 = DateHelper.dateFromDateString(game2.date).getTime();
				time1 += DateHelper.timeStringInSecs(game1.startTime) * 1000;
				time2 += DateHelper.timeStringInSecs(game2.startTime) * 1000;
				return time1 - time2;

			});
		} else {
			games = this.get('games').slice();
			games.sort(function(game1, game2) {
				var time1 = DateHelper.dateFromDateString(game1.date).getTime(),
					time2 = DateHelper.dateFromDateString(game2.date).getTime();
				time1 += DateHelper.timeStringInSecs(game1.startTime) * 1000;
				time2 += DateHelper.timeStringInSecs(game2.startTime) * 1000;
				return time1 - time2;

			});
			this.set('games', games);
		}
		
	},
	teamWithID: function(id) {
		var team;
		this.get('teams').forEach(function(_team) {
			if (_team.teamID === id) {
				team = _team;
				return;
			}
		});
		return team;
	},
	//sets the wins, losses, ties at the specified index
	decrementWins: function(id, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[0] -= 1;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}
			

		}
		
	},
	incrementWins: function(id, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[0] += 1;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}
		}
	},
	setWins: function(id, value, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[0] = value;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	},
	decrementLosses: function(id, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[1] -= 1;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	},
	incrementLosses: function(id, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[1] += 1;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	},
	setLosses: function(id, value, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[1] = value;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	},
	decrementTies: function(id, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[2] -= 1;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	},
	incrementTies: function(id, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[2] += 1;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	},
	setTies: function(id, value, silent) {
		var team;
		if (typeof id === 'number') {
			team = this.teamWithID(id);
			team.WLT[2] = value;
			if (!silent) {
				this.trigger('change');
				this.trigger('change:teams');
				this.trigger('change:teams:'+id.toString());
			}

		}
	}

});

//should not add models to the All collection
//but rather to the collection for the particular
//season, which automatically syncs the model with the
//season collection
IMModel.Season = Backbone.Collection.extend({
	model: IMModel.Sport,
	//sorts sports based on date the sport is happenning
	sort: function() {

	}
});


IMModel.All = Backbone.Collection.extend({
	url: '/JSON/IM',
	model: IMModel.Sport,
	getSpringSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 2;
		});
	},
	getFallSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 0;
		});
	},
	getWinterSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 1;
		});
	},
	getSummerSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 3;
		});
	},
	//should use this method in place of add to make sure
	//all collections are synced with model
	insert: function(model) {
		this.add(model);
		switch(model.get('season')) {
			case 0:
				IMModel.getCollection('fall').add(model);
				break;
			case 1:
				IMModel.getCollection('winter').add(model);
				break;
			case 2:
				IMModel.getCollection('spring').add(model);
				break;
			case 3:
				IMModel.getCollection('summer').add(model);
				break;
			default:
				throw new Error("Model does not have a correct value for season property");
				break;
		}
	},
});

IMModel.getCollection = function(_season) {
	var season = (_season) ? _season.toLowerCase() : "";
	switch(season) {
		case 'fall':
			if (!IMModel.Season.fallInstance) {

				IMModel.Season.fallInstance = new IMModel.Season(IMModel.getCollection().getFallSports());
			}
			return IMModel.Season.fallInstance;
		case 'spring':
			if (!IMModel.Season.springInstance) {
				IMModel.Season.springInstance = new IMModel.Season(IMModel.getCollection().getSpringSports());
			}
			return IMModel.Season.springInstance;
		case 'summer':
			if (!IMModel.Season.summerInstance) {
				IMModel.Season.summerInstance = new IMModel.Season(IMModel.getCollection().getSummerSports());
			}
			return IMModel.Season.summerInstance;
		case 'winter':
			if (!IMModel.Season.winterInstance) {
				IMModel.Season.winterInstance = new IMModel.Season(IMModel.getCollection().getWinterSports());
			}
			return IMModel.Season.winterInstance;
		default:
			if (!IMModel.All.instance) {
				IMModel.All.instance = new IMModel.All();
			}
			return IMModel.All.instance;	
	}
	
};
