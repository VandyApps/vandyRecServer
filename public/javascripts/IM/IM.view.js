//Intramurals should be defined within model
Intramurals.View = {};
Intramurals.View.Categories = Backbone.View.extend(
{
	el: '#intramurals',
	initialize: function(options) {
		//collection should be of type Intramurals.Model.Categories
		//it is the views job to sync the collection
		
		this.collection = null || (options && options.collection);
		if (this.collection) {
			this.collection.on('sync', this.onCollectionSync.bind(this));
		}	
	},
	init: function() {
		this.collection.fetch();
	},
	generateList: function() {
		
		var self = this,
			listItem = function(category, league) {
				return "<li><a href="+self.linkForLeague(category, league)+">" + league.get('name') + "</a></li>";
			},
			html = 
			this.collection.summerSports().reduce(function(memo, category) {
				return "<ul>" + category.getLeagues().reduce(function(memo, league) {
					return listItem(category,league);
				}, "") + "</ul>";
			}, "<li>Summer</li>") + 

			
			this.collection.fallSports().reduce(function(memo, category) {
				return "<ul>" + category.getLeagues().reduce(function(memo, league) {
					return listItem(category, league);
				}, "") + "</ul>";
			}, "<li>Fall</li>") + 

			this.collection.winterSports().reduce(function(memo, category) {
				return "<ul>" + category.getLeagues().reduce(function(memo, league) {
					return listItem(category,league);
				}, "") + "</ul>";
			}, "<li>Winter</li>") + 

			this.collection.springSports().reduce(function(memo, category) {
				return "<ul>" + category.getLeagues().reduce(function(memo, league) {
					return listItem(category, league);
				}, "") + "</ul>";
			}, "<li>Spring</li>");

		this.$el.html(html);
		
	},

	linkForLeague: function(category, league) {
		return './intramurals/category/' + category.id + '/league/' + league.id;
	},

	clearList: function() {
		this.$el.html('<li>Summer</li><ul></ul><li>Fall</li><ul></ul><li>Winter</li><ul></ul><li>Spring</li><ul></ul>');
	},
	


	onCollectionSync: function() {
		var self = this,
			count = this.collection.length;
		function onSyncLeagues() {
			--count;
			if (!count) {
				self.generateList();
			}
		};
		this.collection.each(function(category) {
			category.getLeagues().on('sync', onSyncLeagues.bind(self))
			category.getLeagues().fetch();
		});
	}
},
{
	instance: null,
	getInstance: function() {
		if (!Intramurals.View.Categories.instance) {
			Intramurals.View.Categories.instance = new Intramurals.View.Categories(
				{
					collection: new Intramurals.Model.Categories()
				});
		}
		return Intramurals.View.Categories.instance;
	}
});