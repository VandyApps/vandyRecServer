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
	},
	//sets the wins, losses, ties at the specified index
	decrementWins: function(index) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[0] -= 1;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
		
	},
	incrementWins: function(index) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[0] += 1;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	setWins: function(index, value) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[0] = value;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	decrementLosses: function(index) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[1] -= 1;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	incrementLosses: function(index) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[1] += 1;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	setLosses: function(index, value) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[1] = value;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	decrementTies: function(index) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[2] -= 1;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	incrementTies: function(index) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[2] += 1;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	},
	setTies: function(index, value) {
		if (typeof index === 'number') {
			this.attributes.teams[index].WLT[2] = value;
			this.trigger('change');
			this.trigger('change:teams');
			this.trigger('change:teams:'+index.toString());

		}
	}

});

//should not add models to the All collection
//but rather to the collection for the particular
//season, which automatically syncs the model with the
//season collection
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
		});
	},
	getFallSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 0;
		});
	},
	getWinterSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 1;
		});
	},
	getSummerSports: function() {
		return this.models.filter(function(sport) {
			return sport.get('season') === 3;
		});
	},
	//should use this method in place of add to make sure
	//all collections are synced with model
	insert: function(model) {
		this.add(model);
		switch(model.get('season')) {
			case 0:
				IMModel.getCollection('fall').add(model);
				break;
			case 1:
				IMModel.getCollection('winter').add(model);
				break;
			case 2:
				IMModel.getCollection('spring').add(model);
				break;
			case 3:
				IMModel.getCollection('summer').add(model);
				break;
			default:
				throw new Error("Model does not have a correct value for season property");
				break;
		}
	},
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
