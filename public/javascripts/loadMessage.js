//this is to be used for loading messages
//the styling for this script is in a css stylesheet for quick rendering
var LoadMessage = Backbone.View.extend({
	deleteWhenDone: false,
	initialize: function(options) {
		
		if (typeof option !== 'undefined' && typeof options.deleteWhenDone !== 'undefined') {
			this.deleteWhenDone = options.deleteWhenDone;
		}
		this.render();

	},
	render: function() {
		if ($('#loadMessage').length === 0) {
			console.log('Creating a new element');
			this.$el = $('<div id="loadMessage"></div>');
			this.$el.append('<div id="loadTitle">Loading</div>');
			this.$el.append('<div id="loadProgress"></div>');
			$('body').append(this.$el);
		} else {
			this.$el = $('#loadMessage');
		}	
		
		
		
		

	},
	start: function() {

	},
	stop: function() {

	}
});