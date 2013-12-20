
var Intramurals = {};

Intramurals.Model = {};

Intramurals.Model.Team = Backbone.UniqueModel(

	Backbone.Model.extend({
		idAttribute: "id",
		incrementWins: function(options) {
			this.set('wins', this.get('wins') + 1, {silent: options && options.silent});
		},
		incrementLosses: function(options) {
			this.set('losses', this.get('losses') + 1, {silent: options && options.silent});
		},
		incrementTies: function(options) {
			this.set('ties', this.get('ties') + 1, {silent: options && options.silent});
		},

		decrementWins: function(options) {
			this.set('wins', this.get('wins') - 1, {silent: options && options.silent});
		},
		decrementLosses: function(options) {
			this.set('losses', this.get('losses') - 1, {silent: options && options.silent});
		},
		decrementTies: function(options) {
			this.set('ties', this.get('ties') - 1, {silent: options && options.silent});
		},

		setWinsToZero: function(options) {
			this.set('wins', 0, {silent: options && options.silent});
		},
		setLossesToZero: function(options) {
			this.set('losses', 0, {silent: options && options.silent});
		},
		setTiesToZero: function(options) {
			this.set('ties', 0, {silent: options && options.silent});
		},

		save: function() {
			this.trigger('save', this);
		}
	})
);

Intramurals.Model.Game = Backbone.UniqueModel(
	
	Backbone.Model.extend({
		idAttribute: "id",
		initialize: function(mJSON) {
			this.set('homeTeam', new Intramurals.Model.Team({id:mJSON.homeTeam}));
			this.set('awayTeam', new Intramurals.Model.Team({id:mJSON.awayTeam}));
		},
		getWinner: function() {
			//returns null if no winners
			var status = this.get('status');
			if (status == 0 || status == 4) {
				return this.get('homeTeam');
			} else if (status == 1 || status ==  3) {
				return this.get('awayTeam');
			} else {
				return null;
			}
		},
		save: function() {
			this.trigger("save", this);
		},
		isCancelled: function() {
			return this.get('status') == 5;
		},

		isPlayed: function() {
			return this.get('status') != 6;
		},
		toJSON: function() {
			//reduce the home and away teams down to just their id's
			return {
				id: this.id,
				date: this.get('date'),
				time: this.get('time'),
				homeTeam: this.get('homeTeam').id,
				awayTeam: this.get('awayTeam').id,
				homeScore: this.get('homeScore'),
				awayScore: this.get('awayScore'),
				status: this.get('status')
			};
		}
	})
);

Intramurals.Model.Teams = Backbone.Collection.extend({
	model: Intramurals.Model.Team,
	teamWithName: function(name) {
		var team = null,
			regexp = new RegExp(name, 'i');
		this.each(function(team_it) {
			if (regexp.test(team_it.get('name'))) {
				team = team_it;
			}
		});
		return team;
	}
});

Intramurals.Model.Games = Backbone.Collection.extend({
	model: Intramurals.Model.Game,
	
	//reset the wins, losses, and ties for all teams based on current games stats
	resetWLT: function() {
		this.each(function(game) {
			game.get('homeTeam').setWinsToZero({silent: true});
			game.get('homeTeam').setTiesToZero({silent: true});
			game.get('homeTeam').setLossesToZero({silent: true});
			game.get('awayTeam').setWinsToZero({silent: true});
			game.get('awayTeam').setLossesToZero({silent: true});
			game.get('awayTeam').setTiesToZero({silent: true});
		});
		this.each(function(game) {
			var status = game.get('status');
			if (status === 0 || status === 4) {
				game.get('homeTeam').incrementWins();
				game.get('awayTeam').incrementLosses();
			} else if (status === 1 || status === 3) {
				game.get('homeTeam').incrementLosses();
				game.get('awayTeam').incrementWins();
			} else if (status === 2) {
				game.get('homeTeam').incrementTies();
				game.get('awayTeam').incrementTies();
			}
		});
	},
	comparator: function(game) {	
		return DateHelper.dateFromDateString(game.get('date')).getTime();
	}
	
});

Intramurals.Model.Playoffs = Backbone.Model.extend({
	
});

Intramurals.Model.League = Backbone.UniqueModel(
	Backbone.Model.extend({
		idAttribute: 'id',
		urlRoot: function() {
			return '/JSON/IM/' + this.get('categoryId') + '/league';
		},
		parse: function(response) {
			var self = this;
			response.teams = new Intramurals.Model.Teams(response.teams);
			response.season = {
				games: new Intramurals.Model.Games(response.season.games),
				playoffs: new Intramurals.Model.Playoffs(response.season.playoffs)
			};

			//bind all relevant events here

			response.teams.on('add', self.onAddTeam.bind(self));
			response.season.games.on('add', self.onAddGame.bind(self));

			response.teams.each(function(team) {
				team.on('save', self.onSaveTeams.bind(self));
			});
			response.season.games.each(function(game) {
				game.on('save', self.onSaveGames.bind(self));
			});
			response.season.playoffs.on('save', self.onSavePlayoffs.bind(self));

			return response;
		},

		//get collection of teams
		teams: function() {
			return this.get('teams');
		},
		//get collection of games
		games: function() {
			return this.get('season').games;
		},
		//get collection for playoffs
		playoffs: function() {
			return this.get('season').playoffs;
		},
		addTeam: function(team) {
			this.teams().add(team);
		},
		addGame: function(game) {
			this.games().add(game);
		},
		
		onSaveTeams: function(model) {
			this.save();
		},
		onSaveGames: function(model) {
			this.save();
		},
		onSavePlayoffs: function(model) {
			this.save();
		},
		onAddTeam: function() {
			this.save();
		},
		onAddGame: function() {
			this.save();
		}
	})
);

Intramurals.Model.Leagues = Backbone.Collection.extend({
	model: Intramurals.Model.League,
	url: function() {
		return '/JSON/IM/' + this.categoryId + '/leagues';
	},
	parse: function(response) {
		var cId = this.categoryId;
		response.forEach(function(modelHash) {
			modelHash.categoryId = cId;
		});
		return response;
	}
});

Intramurals.Model.Category = Backbone.UniqueModel(
	Backbone.Model.extend({
		idAttribute: '_id',
		getLeagues: function() {
			if (!this.get('leagues')) {
				this.set('leagues', new Intramurals.Model.Leagues());
				this.get('leagues').categoryId = this.id;
			}
			return this.get('leagues');
		}

	})
);

Intramurals.Model.Categories = Backbone.Collection.extend({
	url: '/JSON/IM/',
	model: Intramurals.Model.Category,
	comparator: 'season',

	summerSports: function() {
		return this.filter(function(category) {
			return category.get('season') === 0;
		});
	},
	fallSports: function() {
		return this.filter(function(category) {
			return category.get('season') === 1;
		});
	},
	winterSports: function() {
		return this.filter(function(category) {
			return category.get('season') === 2;
		});
	},
	springSports: function() {
		return this.filter(function(category) {
			return category.get('season') === 3;
		});
	}
});

