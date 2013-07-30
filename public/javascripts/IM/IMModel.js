var IMModel = {};

IMModel.Sport = Backbone.Model.extend({
	url: '/intramurals',
	idAttribute: '_id',
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
	//sorts the games in chronological order
	sortGames: function() {
		var games = this.get('games').slice();
		games.sort(function(game1, game2) {
			var time1 = DateHelper.dateFromDateString(game1.date).getTime(),
				time2 = DateHelper.dateFromDateString(game2.date).getTime();
			time1 += DateHelper.timeStringInSecs(game1.startTime) * 1000;
			time2 += DateHelper.timeStringInSecs(game2.startTime) * 1000;
			return time1 - time2;

		});

		this.set('games', games);
	}
});

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
		}).slice();
	},
	getFallSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 0;
		}).slice();
	},
	getWinterSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 1;
		}).slice();
	},
	getSummerSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 3;
		}).slice();
	}
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
