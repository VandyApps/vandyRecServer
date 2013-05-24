
var confirmationBox = Backbone.View.extend({


	events: {

	},
	initialize: function(options) {

	},
	render: function() {

	},
	show: function(animated) {

	},
	hide: function(animated) {

	},
	getBoxStyle: function() {
		return "display: block; position: fixed;z-index: 10000;margin-top: -200px;margin-left: -150px;top: 50%;left: 50%;border: solid black; height: 200px; border-radius: 10px;width: 300px;"
	},
	getMessageStyle: function() {
		return "display: block; position: absolute; top: 20px; width: 250px; left: 25px; height: 100px; text-align: center;";
	},
	getButtonStyle: function() {
		return "margin: 0px 15px; width: 60px; height: 30px; border: solid black 1px; border-radius: 10px;"
	},
	getButtonWrapperStyle: function() {
		return "display: block; position: absolute; top: 125px; text-align: center; width: 200px; left: 50px;"
	}
});

/*
		<div id="confirmationBox" style="display: block; 
									position: fixed;
									z-index: 10000;
									margin-top: -200px;
									margin-left: -150px;
									top: 50%;
									left: 50%;
									border: solid black; 
									height: 200px; 
									border-radius: 10px;
									width: 300px;">
			<div id="message" style="display: block;
									position: absolute;
									top: 20px;
									width: 250px;
									left: 25px;
									height: 100px;
									text-align: center;">This is the main message.  It should support something relatively long, like this.</div>
			<div id="inputs" style="display: block;
									position: absolute;
									top: 125px;
									text-align: center;
									width: 200px;
									left: 50px;">
				<input type="button" id="button1" value="Yes" style="margin: 0px 15px; 
																	width: 60px;
																	height: 30px;
																	border: solid black 1px;
																	border-radius: 10px;"/>
				<input type="button" id="button2" value="No" style="margin: 0px 15px;
																	width: 60px;
																	height: 30px;
																	border: solid black 1px;
																	border-radius: 10px;"/>
			</div>
		</div>

*/