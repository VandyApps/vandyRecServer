
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
		onChangeHomeTeam: function() {
			if (this.get('status') === 0 || this.get('status') === 4) {
				this.previous('homeTeam').decrementWins();
				this.get('homeTeam').incrementWins();
			} else if (this.get('status') === 1 || this.get('status' === 3)) {
				this.previous('homeTeam').decrementLosses();
				this.get('homeTeam').incrementLosses();
			} else if (this.get('status') === 2) {
				this.previous('homeTeam').decrementTies();
				this.get('homeTeam').incrementTies();
			}
		},
		onChangeAwayTeam: function() {
			
			if (this.get('status') === 0 || this.get('status') === 4) {
				this.previous('awayTeam').decrementLosses();
				this.get('awayTeam').incrementLosses();
			} else if (this.get('status') === 1 || this.get('status') === 3) {
				this.previous('awayTeam').decrementWins();
				this.get('awayTeam').incrementWins();
			} else if (this.get('status') === 2) {
				this.previous('awayTeam').decrementTies();
				this.get('awayTeam').incrementTies();
			}
		},
		onChangeStatus: function() {
			
			var status = this.get('status'),
				prevStatus = this.previous('status'),
				teamsToUpdate = [];

			console.log("Current status: " + this.get('status'));
			console.log("Previous status: " + this.previous('status'));
			if (status === 0 || status === 4) {
				this.get('homeTeam').incrementWins({silent: true});
				this.get('awayTeam').incrementLosses({silent: true});
				teamsToUpdate.push(this.get('homeTeam').id.toString() + " wins");
				teamsToUpdate.push(this.get('awayTeam').id.toString() + " losses");
			} else if (status === 1 || status === 3) {
				this.get('homeTeam').incrementLosses({silent: true});
				this.get('awayTeam').incrementWins({silent: true});
				teamsToUpdate.push(this.get('homeTeam').id.toString() + " losses");
				teamsToUpdate.push(this.get('awayTeam').id.toString() + " wins");
			} else if (status === 2) {
				this.get('homeTeam').incrementTies({silent: true});
				this.get('awayTeam').incrementTies({silent: true});
				teamsToUpdate.push(this.get('homeTeam').id.toString() + " ties");
				teamsToUpdate.push(this.get('awayTeam').id.toString() + " ties");
			}

			if (prevStatus === 0 || prevStatus === 4) {
				this.get('homeTeam').decrementWins({silent: true});
				this.get('awayTeam').decrementLosses({silent: true});
				teamsToUpdate.push(this.get('homeTeam').id.toString() + " wins");
				teamsToUpdate.push(this.get('awayTeam').id.toString() + " losses");
			} else if (prevStatus === 1 || prevStatus === 3) {
				this.get('homeTeam').decrementLosses({silent: true});
				this.get('awayTeam').decrementWins({silent: true});
				teamsToUpdate.push(this.get('homeTeam').id.toString() + " losses");
				teamsToUpdate.push(this.get('awayTeam').id.toString() + " wins");
			} else if (prevStatus === 2) {
				this.get('homeTeam').decrementTies({silent: true});
				this.get('awayTeam').decrementTies({silent: true});
				teamsToUpdate.push(this.get('homeTeam').id.toString() + " ties");
				teamsToUpdate.push(this.get('awayTeam').id.toString() + " ties");
			}

			_.uniq(teamsToUpdate, function(updateHash) {
				console.log("Teams to update called");
				var splitHash = updateHash.split(" ");
				(new Intramurals.Model.Team({id: +splitHash[0]})).trigger('change:'+splitHash[1]);
			});
		},
		save: function() {
			this.trigger("save", this);
		},

		toJSON: function() {	
			return {
				homeTeam: (typeof this.get('homeTeam') === 'number') ? this.get('homeTeam') : this.get('homeTeam').id,
				awayTeam: (typeof this.get('awayTeam') === 'number') ? this.get('awayTeam') : this.get('awayTeam').id,
				homeScore: this.get('homeScore'),
				awayScore: this.get('awayScore'),
				location: this.get('location'),
				time: this.get('time'),
				date: this.get('date'),
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
		var teamsToUpdate = [];
		this.each(function(game) {
			game.get('homeTeam').setWinsToZero({silent: true});
			game.get('homeTeam').setTiesToZero({silent: true});
			game.get('homeTeam').setLossesToZero({silent: true});

			game.get('awayTeam').setWinsToZero({silent: true});
			game.get('awayTeam').setLossesToZero({silent: true});
			game.get('awayTeam').setTiesToZero({silent: true});

			teamsToUpdate.push(game.get('homeTeam').id);
			teamsToUpdate.push(game.get('awayTeam').id);
		});

		this.each(function(game) {
			var status = game.get('status');
			if (status === 0 || status === 4) {
				game.get('homeTeam').incrementWins({silent: true});
				game.get('awayTeam').incrementLosses({silent: true});
			} else if (status === 1 || status === 3) {
				game.get('homeTeam').incrementLosses({silent: true});
				game.get('awayTeam').incrementWins({silent: true});
			} else if (status === 2) {
				game.get('homeTeam').incrementTies({silent: true});
				game.get('awayTeam').incrementTies({silent: true});
			}
		});
		_.uniq(teamsToUpdate).forEach(function(teamId){
			var team = new Intramurals.Model.Team({id: teamId});
			team.trigger('change:wins');
			team.trigger('change:losses');
			team.trigger('change:ties');
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
		initialSetup: true,
		urlRoot: function() {
			return '/JSON/IM/' + this.get('categoryId') + '/league';
		},
		parse: function(response) {
			var self = this;

			//unbind any previously set events

			//assume if teams is collection, everything else is 
			//set correctly
			;
			if (this.teams() instanceof Backbone.Collection) {
				this.teams().off();
				this.games().off();
				this.playoffs().off();
				this.teams().forEach(function(team) {
					team.off();
				});
				this.games().forEach(function(game) {
					game.off();
				});
			}

			//set the new data
			response.teams = new Intramurals.Model.Teams(response.teams);
			response.season = {
				games: new Intramurals.Model.Games(response.season.games.map(function(game) {
					return _.extend(game, {
						homeTeam: new Intramurals.Model.Team({id: game.homeTeam}),
						awayTeam: new Intramurals.Model.Team({id: game.awayTeam})
					});
				})),
				playoffs: new Intramurals.Model.Playoffs(response.season.playoffs)
			};

			//bind events for games
			response.season.games.forEach(function(game) {
				game.on('change:status', game.onChangeStatus.bind(game));
				game.on('change:homeTeam', game.onChangeHomeTeam.bind(game));
				game.on('change:awayTeam', game.onChangeAwayTeam.bind(game));
			});

			//bind events for league
			this.setEventsForResponseObj(response);
			this.initialSetup = false;
			return response;
		},

		setEventsForResponseObj: function(response, setKey) {
			var self = this;
			setKey || (setKey = 'on');

			response.teams[setKey]('add', self.onAddTeam.bind(self));
			response.season.games[setKey]('add', self.onAddGame.bind(self));

			response.teams.each(function(team) {
				team[setKey]('save', self.onSaveTeams.bind(self));
			});
			response.season.games.each(function(game) {
				game[setKey]('save', self.onSaveGames.bind(self));
			});
			response.season.playoffs[setKey]('save', self.onSavePlayoffs.bind(self));
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
			this.save({wait: true});
		},
		onSaveGames: function(model) {
			this.save({wait: true});

		},
		onSavePlayoffs: function(model) {
			this.save({wait: true});
		},
		onAddTeam: function() {
			this.save({wait: true});
		},
		onAddGame: function() {
			this.save({wait: true});
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

