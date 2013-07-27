var IMModel = {};

IMModel.Sport = Backbone.Model.extend({
	url: '/intramurals'
	entryStart: function() {},
	entryEnd: function() {},
	seasonStart: function() {},
	seasonEnd: function() {},
	//sorts the games in chronological order
	sortGames: function() {}
});

IMModel.Season = Backbone.Collection.extend({
	//sorts sports based on date the sport is happenning
	sort: function() {

	}
});

IMModel.All = Backbone.Collection.extend({
	url: '/JSON/intramurals'
});

IMModel.All.getInstance = function() {};