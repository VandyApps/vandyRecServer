
var Intramurals = {};

Intramurals.Model = {};

Intramurals.Model.Team = Backbone.UniqueModel(
	Backbone.Model.extend({
		incrementWins: function() {

		},
		incrementLosses: function() {

		},
		incrementTies: function() {

		},

		decrementWins: function() {

		},
		decrementLosses: function() {

		},
		decrementTies: function() {

		}

	})
);

Intramurals.Model.Game = Backbone.UniqueModel(
	Backbone.Model.extend({

		getWinner: function() {
			//returns null if no winners
		},

		isCancelled: function() {

		},

		isPlayed: function() {

		}
	})
);

Intramurals.Model.Teams = Backbone.Collection.extend({
	model: Intramurals.Model.Team,
	teamWithName: function(name) {

	}
});

Intramurals.Model.Games = Backbone.Collection.extend({
	model: Intramurals.Model.Game,
	
	//reset the wins, losses, and ties for all teams based on current games stats
	resetWLT: function() {

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
		initialize: function() {
			
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
		initialize: function() {

		},
		getLeagues: function() {
			var leagues = new Intramurals.Model.Leagues();
			leagues.categoryId = this.id;
			return leagues;
		}
	})
);

Intramurals.Model.Categories = Backbone.Collection.extend({
	url: '/JSON/IM/',
	model: Intramurals.Model.Category,
	initialize: function() {

	}
});



