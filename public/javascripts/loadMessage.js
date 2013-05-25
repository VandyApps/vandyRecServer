//this is to be used for loading messages
//the styling for this script is in a css stylesheet for quick rendering
var LoadMessage = Backbone.View.extend({
	deleteWhenDone: false,
	timeLoop: null,
	numberOfDots: 0,

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
		this.$el.show();
		var self = this;
		var showProgress = function() {
			
			self.numberOfDots = (self.numberOfDots + 1) % 10;
			var progressElement = '';
			for (var i = 0; i < self.numberOfDots; ++i) {
				progressElement = progressElement + '.';
			}
			$('#loadProgress').text(progressElement);
		}
		
		this.timeLoop = setInterval(showProgress, 100);

	},
	stop: function() {
		clearInterval(this.timeLoop);
		this.$el.hide();
		if (this.deleteWhenDone === true) {
			this.delete();
		}
	},
	delete: function() {
		this.$el.remove();
	}
});