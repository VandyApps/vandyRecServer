
var Intramurals = {};

Intramurals.Model = {};

Intramurals.Model.Team = Backbone.UniqueModel(

	Backbone.Model.extend({
		idAttribute: "id",
		incrementWins: function() {
			this.set('wins', this.get('wins') + 1);
		},
		incrementLosses: function() {
			this.set('losses', this.get('losses') + 1);
		},
		incrementTies: function() {
			this.set('ties', this.get('ties') + 1);
		},

		decrementWins: function() {
			this.set('wins', this.get('wins') - 1);
		},
		decrementLosses: function() {
			this.set('losses', this.get('losses') - 1);
		},
		decrementTies: function() {
			this.set('ties', this.get('ties') - 1);
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

		isCancelled: function() {
			return this.get('status') == 5;
		},

		isPlayed: function() {
			return this.get('status') != 6;
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
	},

	generateUniqueId: function() {
		var nextId = 1;
		this.each(function(team) {
			if (team.id >= nextId) {
				nextId = team.id + 1;
			}
		});
		return nextId;
	}
});

Intramurals.Model.Games = Backbone.Collection.extend({
	model: Intramurals.Model.Game,
	
	//reset the wins, losses, and ties for all teams based on current games stats
	resetWLT: function() {

	},

	generateUniqueId: function() {
		var nextId = 1;
		this.each(function(game) {
			if (game.id >= nextId) {
				nextId = game.id + 1;
			}
		});
		return nextId;
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
			response.teams = new Intramurals.Model.Teams(response.teams);
			response.season = {
				games: new Intramurals.Model.Games(response.season.games),
				playoffs: new Intramurals.Model.Playoffs(response.season.playoffs)
			};
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
			var leagues = new Intramurals.Model.Leagues();
			leagues.categoryId = this.id;
			return leagues;
		}
	})
);

Intramurals.Model.Categories = Backbone.Collection.extend({
	url: '/JSON/IM/',
	model: Intramurals.Model.Category	
});

/*temp script*/

var a = new Intramurals.Model.Categories();
a.fetch();

a.on('sync', function() {
	b = a.models[0],
	c = b.getLeagues();
	c.fetch();
	c.on('sync', function() {
		d = c.models[0];
	});
});




