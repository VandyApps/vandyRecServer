
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
			if (typeof mJSON.homeTeam === 'number') {
				this.set('homeTeam', new Intramurals.Model.Team({id:mJSON.homeTeam}), {silent: true});
				this.set('awayTeam', new Intramurals.Model.Team({id:mJSON.awayTeam}), {silent: true});
			} 
			this.on('change:homeTeam', this.onChangeHomeTeam.bind(this));
			this.on('change:awayTeam', this.onChangeAwayTeam.bind(this));
			this.on('change:status', this.onChangeStatus.bind(this));	
		},
		setupTeams: function() {
			console.log("Setting up");
			if (typeof this.get('homeTeam') === 'number') {		
				this.set('homeTeam', new Intramurals.Model.Team({id:this.get('homeTeam')}), {silent: true});
				this.set('awayTeam', new Intramurals.Model.Team({id:this.get('awayTeam')}), {silent: true});
			}
			
		},
		onChangeHomeTeam: function() {
			if (typeof this.get('homeTeam') === 'number' || this.previous('homeTeam') === 'number') return;

			if (this.get('status') === 0 || this.get('status') === 4) {
				this.previous('homeTeam').decrementWins();
				this.get('homeTeam').incrementWins();
			} else if (this.get('status') === 1 || this.get('status' === 3)) {
				this.previous('homeTeam').decrementLosses();
				this.get('homeTeam').incrementLosses();
			}
		},
		onChangeAwayTeam: function() {
			if (typeof this.get('awayTeam') === 'number' || typeof this.previous('awayTeam') === 'number') return;
			
			if (this.get('status') === 0 || this.get('status') === 4) {
				this.previous('awayTeam').decrementLosses();
				this.get('awayTeam').incrementLosses();
			} else {
				this.previous('awayTeam').decrementWins();
				this.get('awayTeam').incrementWins();
			}
		},
		onChangeStatus: function() {
			if (typeof this.get('homeTeam') === 'number' || typeof this.get('awayTeam') === 'number') return;

			console.log("Change status called");
			var status = this.get('status'),
				prevStatus = this.previous('status'),
				teamsToUpdate = [];

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
				var splitHash = updateHash.split(" ");
				(new Intramurals.Model.Game({id: +splitHash[0]})).trigger('change:'+splitHash[1]);
			});
		},
		save: function() {
			this.trigger("save", this);
		},

		toJSON: function() {
			//hard-coded for now
			console.log("TO JSON called");
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
	reset: function(rawModels) {
		this.models = rawModels.map(function(model) {
			var game = new Intramurals.Model.Game(model);
			game.setupTeams();
			return game;
			
		});
		models = this.models;
	},
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
		urlRoot: function() {
			return '/JSON/IM/' + this.get('categoryId') + '/league';
		},
		parse: function(response) {
			var self = this;
			response.teams = new Intramurals.Model.Teams(response.teams);
			response.season = {
				games: new Intramurals.Model.Games(response.season.games.map(function(game) {
					return new Intramurals.Model.Game(game);
				})),
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

