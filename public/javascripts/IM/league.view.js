if (!this.Intramurals.View) {
	this.Intramurals.View = {};
}


Intramurals.View.Team = Backbone.View.extend({
	tagName: 'tr',
	model: null,
	initialize: function(mObject) {
		if (mObject.model) {
			//bind events here
			this.setModel(mObject.model);
		}
	},
	//returns html as string for parent view to use
	render: function(count) {
		
			this.$el.html("<td style='width: 19px; margin: auto; text-align: center;'>"+this.count+"</td>"+
            		"<td style='width: 200px; margin: auto; text-align: left;'>"+this.model.get('name')+"</td>"+
            		"<td style='width: 127px; margin: auto; text-align: center;'>"+this.numberToTally(this.model.get('wins'))+"</td>"+
            		"<td style='width: 127px; margin: auto; text-align: center;'>"+this.numberToTally(this.model.get('losses'))+"</td>"+
            		"<td style='width: 127px; margin: auto; text-align: center;'>"+this.numberToTally(this.model.get('ties'))+"</td>");
		
	},
	setModel: function(model) {

	},
	numberToTally: function(num) {
		var html = "";
		while (num >= 5) {
			html += "<del>IIII</del>&#32"
			num -= 5;
		}
		while (num) {
			html += "I";
			--num;
		}
		return html;
	}
});

Intramurals.View.Game = Backbone.View.extend({
	tagName: 'tr',
	//returns html as string for parent vew to use
	render: function() {
		
		if (this.model) {
			this.$el.html("<td style='text-align: center;' width='70' height='25'><strong>"+this.model.get('date')+"</strong></td><td style='text-align: center;' width='80' height='25'><strong>"+this.model.get('time')+"</strong></td>" + 
            		"<td style='text-align: center;' width='20' height='25'><strong>"+this.model.get('location')+"</strong></td>"+
            		"<td style='text-align: left;' width='210' height='25'><strong>"+this.model.get('homeTeam').get('name')+"</strong></td>" + 
            		"<td style='text-align: center;' width='30' height='25'><strong>VS </strong></td>" + 
            		"<td style='text-align: left;' width='210' height='25'><span style='color: #ff0000;'><strong>"+this.model.get('awayTeam').get('name')+"</strong><strong> </strong></span></td>"+
            		"<td style='text-align: center;' width='70' height='25'><strong>"+this.model.get('homeScore')+"&#8211;" + this.model.get('awayScore')+ "</strong></td>");
	
		}
	}
});

Intramurals.View.TeamTable = Backbone.View.extend({
	el: '#teamTable',
	collection: null,
	teamsView: [],
	tableHeader: function() {
		return "<tr><td style='width: 19px; margin: auto;'></td><td style='width: 200px; text-align: left;'><strong>Team</strong></td><td style='width: 127px; margin: auto; text-align: center;'><strong>Won</strong></td><td style='width: 127px; margin: auto; text-align: center;'><strong>Lost</strong></td><td style='width: 127px; margin: auto; text-align: center;'><strong>Tied</strong></td></tr>";
	},
	setCollection: function(collection) {
		if (this.collection) this.collection.off();

		this.collection = collection;
		this.teamsView = collection.map(function(team) {
			return new Intramurals.View.Team({model: team});
		});
		collection.on('add', function(team) {
			this.addTeamView(team);
		}, this);
		this.render();
	},
	render: function() {

		this.teamsView.forEach(function(teamView, index) {
			if (index) {
				this.$el.find('tbody').append("<tr></tr>");
			} else {
				this.$el.find('tbody').html(this.tableHeader() + "<tr></tr>");
			}
			
			teamView.count = index + 1;
			teamView.$el = this.$el.find("tbody tr:nth-child(" + (index + 2) + ")");
			teamView.render();
		}.bind(this));
	},
	addTeamView: function(team, options) {
		console.log("Adding team\n" + JSON.stringify(team.toJSON()));
	},
	removeTeamAtIndex: function(index) {

	}
},
{
	instance: null,
	getInstance: function(options) {
		if (!Intramurals.View.TeamTable.instance) {
			Intramurals.View.TeamTable.instance = new Intramurals.View.TeamTable(options);
		}
		return Intramurals.View.TeamTable.instance;
	}
});

Intramurals.View.GameTable = Backbone.View.extend({
	el: '#gameTable',
	collection: null,
	gamesView: [],
	tableHeader: function() {
		return "<tr><td style='text-align: center;' width='70' height='25'><span><strong>Date</strong></span></td><td style='text-align: center;' width='80' height='25'><strong>Time </strong></td><td style='text-align: center;' width='20' height='25'><strong>Field</strong></td><td style='text-align: left;' width='210' height='25'><strong>Home </strong></td><td style='text-align: center;' width='30' height='25'><strong>VS </strong></td><td style='text-align: left;' width='210' height='25'><strong>Away </strong></td><td style='text-align: center;' width='70' height='25'><span><strong>Score </strong></span></td></tr>";
	},
	render: function() {
		this.gamesView.forEach(function(gameView, index) {
			if (index) {
				this.$el.find('tbody').append("<tr></tr>");
			} else {
				//initial element
				this.$el.find('tbody').html(this.tableHeader() + "<tr></tr>");
			}
			gameView.$el = this.$el.find("tbody tr:nth-child("+(index+2)+")");
			gameView.render();
		}.bind(this));
	},
	setCollection: function(collection) {
		if (this.collection) this.collection.off();

		this.collection = collection;
		this.gamesView = collection.map(function(game) {
			return new Intramurals.View.Game({model: game});
		});
		collection.on('add', function(game) {
			this.addGameView(game)
		}, this);
		this.render();
	},
	addGameView: function(game, options) {
		console.log("adding game\n" + JSON.stringify(game.toJSON()));
	},
	removeGameAtIndex: function(index) {

	}
},
{
	instance: null,
	getInstance: function() {
		if (!Intramurals.View.GameTable.instance) {
			Intramurals.View.GameTable.instance = new Intramurals.View.GameTable();
		}
		return Intramurals.View.GameTable.instance;
	}
});

//basic setup

(function() {
	var initialSetup = false,
		splitPath = document.URL.split('/'),
		categoryId = splitPath[splitPath.length - 3],
		leagueId = +splitPath[splitPath.length - 1],
		mLeague = Intramurals.Model.League({categoryId: categoryId, id: leagueId}),
		createTeamName = function() {
			var root = "Team ",
				index = 1;
			while ( mLeague.teams().teamWithName(root + index.toString())) {
				++index;
			}
			return root + index.toString();

		},
		defaultTeam = function() {
			return new Intramurals.Model.Team({
				name: createTeamName(),
				wins: 0,
				losses: 0,
				ties: 0
			});
		},
		defaultGame = function() {
			return new Intramurals.Model.Game({
				homeTeam: mLeague.teams().models[0],
				awayTeam: mLeague.teams().models[1],
				date: DateHelper.dateStringFromDate(new Date()),
				time: "12:00pm",
				homeScore: 0,
				awayScore: 0,
				status: 6 //not yet played
			});
		};

	function addTeam() {
		mLeague.addTeam(defaultTeam());
	};

	function addGame() {
		console.log("Add game is called");
		if (mLeague.teams().length < 2) {
			alert("Must have at least 2 teams before creating a game");
		} else {
			mLeague.addGame(defaultGame());
		}
		
	};
	mLeague.on('sync', function() {
		if (!initialSetup) {
			$('#addTeam').click(addTeam);
			$('#addGame').click(addGame);
			initialSetup = true;
		}
		//this is inefficient, cannot change without fixing the api and how
		//models are defined, would have to make each Game/Team a model that fetches
		//from the server, instead of models that depend on Model.League to do so
		Intramurals.View.TeamTable.getInstance().setCollection(mLeague.teams());
		Intramurals.View.GameTable.getInstance().setCollection(mLeague.games());
		
	});
	mLeague.fetch();
	league = mLeague;
	
})();



