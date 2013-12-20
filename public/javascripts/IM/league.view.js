if (!this.Intramurals.View) {
	this.Intramurals.View = {};
}


Intramurals.View.Team = Backbone.View.extend({
	tagName: 'tr',
	model: null,
	initialize: function(mObject) {
		mObject || (mObject = {});
		if (mObject.model) {
			//bind events here
			this.setModel(mObject.model);
		}
	},
	//returns html as string for parent view to use
	render: function() {
		
			this.$el.html("<td style='width: 19px; margin: auto; text-align: center;'>"+this.count+"</td>"+
            		"<td style='width: 200px; margin: auto; text-align: left;'>"+this.model.get('name')+"</td>"+
            		"<td style='width: 127px; margin: auto; text-align: center;'>"+this.numberToTally(this.model.get('wins'))+"</td>"+
            		"<td style='width: 127px; margin: auto; text-align: center;'>"+this.numberToTally(this.model.get('losses'))+"</td>"+
            		"<td style='width: 127px; margin: auto; text-align: center;'>"+this.numberToTally(this.model.get('ties'))+"</td>");
		
	},
	setModel: function(model) {
		if (this.model) this.model.off();

		this.model = model;
		this.model.on({
			'change:name': this.onNameChange.bind(this),
			'change:wins': this.onWinsChange.bind(this),
			'change:losses': this.onLossesChange.bind(this),
			'change:ties': this.onTiesChange.bind(this)
		});

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
	},
	onNameChange: function() {
		this.$el.find('td:nth-child(2)').text(this.model.get('name'));
	},
	onWinsChange: function() {
		this.$el.find('td:nth-child(3)').html(this.numberToTally(this.model.get('wins')));
	},
	onLossesChange: function() {
		this.$el.find('td:nth-child(4)').html(this.numberToTally(this.model.get('losses')));
	},
	onTiesChange: function() {
		this.$el.find('td:nth-child(5)').html(this.numberToTally(this.model.get('ties')));
	}
});

Intramurals.View.Game = Backbone.View.extend({
	tagName: 'tr',
	initialize: function(mObject) {
		mObject || (mObject = {});
		if (mObject.model) {
			this.setModel(mObject.model);
		}
	},
	render: function() {
		
		if (this.model) {
			this.$el.html("<td style='text-align: center;' width='70' height='25'>"+this.model.get('date')+"</td>"+
					"<td style='text-align: center;' width='80' height='25'>"+this.model.get('time')+"</td>" + 
            		"<td style='text-align: center;' width='20' height='25'>"+this.relativeLocation()+"</td>"+
            		"<td style='text-align: left;' width='210' height='25'>"+this.homeTeamHTML()+"</td>" + 
            		"<td style='text-align: center;' width='30' height='25'>VS</td>" + 
            		"<td style='text-align: left;' width='210' height='25'>"+this.awayTeamHTML()+"</td>"+
            		"<td style='text-align: center;' width='70' height='25'>"+this.scoreText()+"</td>");
	
		}
	},

	setModel: function(model) {
		console.log("Setting model");
		if (this.model) this.model.off();
		this.model = model;
		this.model.on({
			'change:date': this.onChangeDate.bind(this),
			'change:time': this.onChangeTime.bind(this),
			'change:location': this.onChangeLocation.bind(this),
			'change:homeTeam': this.onChangeHomeTeam.bind(this),
			'change:awayTeam': this.onChangeAwayTeam.bind(this),
			'change:homeScore': this.onChangeScore.bind(this),
			'change:awayScore': this.onChangeScore.bind(this),
			'change:status': this.onChangeScore.bind(this)
		});

		this.model.get('homeTeam').on('change:name', this.onChangeHomeTeam.bind(this));
		this.model.get('awayTeam').on('change:name', this.onChangeAwayTeam.bind(this));

	},
	relativeLocation: function() {
		var offset = Intramurals.View.GameTable.getInstance().locationRoot.length + 1;
		return this.model.get('location').substr(offset, this.model.get('location').length - offset);
	},
	homeTeamHTML: function() {
		//this is messy, why do I need to check if the model is set correctly?
		if (typeof this.model.get('homeTeam') === 'object') {
			if (this.model.get('status') === 0 || this.model.get('status') === 4) {
				return "<strong><span style='color: red;'>"+this.model.get('homeTeam').get('name')+"</span></strong>";
			} else {
				return "<strong><span>"+this.model.get('homeTeam').get('name')+"</span></strong>"
			}
		}
			
	},
	awayTeamHTML: function() {
		//this is messy, why do I need to check if the model is set correctly?
		if (typeof this.model.get('awayTeam') === 'object') {
			if (this.model.get('status') === 1 || this.model.get('status') === 3) {
				return "<strong><span style='color: red;'>"+this.model.get('awayTeam').get('name')+"</span></strong>";
			} else {
				return "<strong><span>"+this.model.get('awayTeam').get('name')+"</span></strong>";
			}
		}
	},
	scoreText: function() {
		switch(this.model.get('status')) {
			case 0:
			case 1:
			case 2:
				return this.model.get('homeScore') + "-" + this.model.get('awayScore');
			case 3:
				return "F-W";
			case 4:
				return "W-F";
			case 5:
				return "Cancelled";
			case 6: 
				return "NP";
		}
	},

	onChangeDate: function() {
		this.$el.find('td:nth-child(1)').text(this.model.get('date'));
	},
	onChangeTime: function() {
		this.$el.find('td:nth-child(2)').text(this.model.get('time'));
	},
	onChangeHomeTeam:function() {
		this.$el.find('td:nth-child(4)').html(this.homeTeamHTML());
	},
	onChangeAwayTeam: function() {
		this.$el.find('td:nth-child(6)').html(this.awayTeamHTML());
	},
	onChangeScore: function() {
		this.$el.find('td:nth-child(7)').text(this.scoreText());
	},
	onChangeLocation: function() {
		this.$el.find('td:nth-child(3)').text(this.relativeLocation());
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
	locationRoot: "Field",
	tableHeader: function() {
		return "<tr><td style='text-align: center;' width='70' height='25'><span><strong>Date</strong></span></td><td style='text-align: center;' width='80' height='25'><strong>Time</strong></td><td style='text-align: center;' width='20' height='25'><strong>"+this.locationRoot+"</strong></td><td style='text-align: left;' width='210' height='25'><strong>Home </strong></td><td style='text-align: center;' width='30' height='25'><strong>VS </strong></td><td style='text-align: left;' width='210' height='25'><strong>Away </strong></td><td style='text-align: center;' width='70' height='25'><span><strong>Score </strong></span></td></tr>";
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
		console.log("Setting collection");
		if (this.collection) this.collection.off();

		this.collection = collection;
		this.gamesView = collection.map(function(game) {
			console.log(JSON.stringify(game));
			return new Intramurals.View.Game({model: game});
		});
		this.render();
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
				location: Intramurals.View.GameTable.getInstance().locationRoot + " 1",
				status: 6 //not yet played
			});
		};

	function addTeam() {
		mLeague.addTeam(defaultTeam());
	};

	function addGame() {
		
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
