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
			this.collection.fetch();
		}

		
	},

	generateList: function() {
		
	},
	clearList: function() {
		this.$el.html('<li>Fall</li><ul></ul><li>Winter</li><ul></ul><li>Spring</li><ul></ul><li>Summer</li><ul></ul>');
	},
	


	onCollectionSync: function() {
		this.generateList();
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