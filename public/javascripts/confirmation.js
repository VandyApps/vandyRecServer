
var ConfirmationBox = Backbone.View.extend({

	message: '',
	button1Name: '',
	button2Name: '',
	animate: true,
	initialize: function(options) {
		this.message = options.message;
		this.button1Name = options.button1Name;
		this.button2Name = options.button2Name;
		if (typeof options.animated !== 'undefined') {
			this.animated = options.animated;
		}
		this.render();
		$('#button1').click($.proxy(this.clickedButton1, this));
		$('#button2').click($.proxy(this.clickedButton2, this));
	},
	render: function() {
		this.$el = $('<div id="confirmationBox"></div>');

		this.$el.append('<div id="message">'+this.message+'</div>');
		this.$el.append('<div id="inputs"></div>');
		this.$el.children('#inputs').append('<input id="button1" type="button" />');
		this.$el.children('#inputs').children('#button1').val(this.button1Name);
		this.$el.children('#inputs').append('<input id="button2" type="button" />');
		this.$el.children('#inputs').children('#button2').val(this.button2Name);

		this.$el.attr('style', this.getBoxStyle());
		$('#message', this.$el).attr('style', this.getMessageStyle());
		this.$el.children('#inputs').attr('style', this.getButtonWrapperStyle());
		this.$el.children('#inputs').children('#button1').attr('style', this.getButtonStyle());
		this.$el.children('#inputs').children('#button2').attr('style', this.getButtonStyle());
		$('body').append(this.$el);
	},
	show: function(animated) {
		if (animated) {
			this.$el.fadeIn();
		} else {
			this.$el.show();
		}
	},
	hide: function(animated) {
		if (animated) {
			this.$el.fadeOut();
		} else {
			this.$el.hide();
		}
	},
	getBoxStyle: function() {
		return "display: block; position: fixed;z-index: 10000;margin-top: -200px;margin-left: -150px;top: 50%;left: 50%; background-color: #efefef; border: solid black; height: 200px; border-radius: 10px;width: 300px;"
	},
	getMessageStyle: function() {
		return "display: block; position: absolute; top: 20px; width: 250px; left: 25px; height: 100px; text-align: center;";
	},
	getButtonStyle: function() {
		return "margin: 0px 15px; width: 60px; height: 30px; border: solid black 1px; border-radius: 10px; cursor: pointer;"
	},
	getButtonWrapperStyle: function() {
		return "display: block; position: absolute; top: 125px; text-align: center; width: 200px; left: 50px;"
	},
	delete: function() {
		this.$el.remove();
	},
	clickedButton1: function() {
		this.trigger('clicked1', this);
		this.hide(this.animate);
	},
	clickedButton2: function() {
		this.trigger('clicked2', this);
		this.hide(this.animate);
	}
});

