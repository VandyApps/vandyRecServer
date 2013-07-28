var IMModel = {};

IMModel.Sport = Backbone.Model.extend({
	url: '/intramurals',
	idAttribute: '_id',
	entryStart: function() {},
	entryEnd: function() {},
	seasonStart: function() {},
	seasonEnd: function() {},
	//sorts the games in chronological order
	sortGames: function() {}
});

IMModel.Season = Backbone.Collection.extend({
	model: IMModel.Sport,
	//sorts sports based on date the sport is happenning
	sort: function() {

	}
});

IMModel.All = Backbone.Collection.extend({
	url: '/JSON/IM',
	model: IMModel.Sport
});

IMModel.getCollection = function() {
	if (!IMModel.All.instance) {
		IMModel.All.instance = new IMModel.All();
	}
	return IMModel.All.instance;
};
