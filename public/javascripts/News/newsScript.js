//make sure that the reset event is only being called during server syncing
//animation is turned off during reset events
eventCollection.on('reset', function() {
	console.log("This method was called: " + eventCollection.models);
	var currentAnimationValue = tableView.animate;
	tableView.animate = false;
	//must remove all elements from the table view first
	tableView.removeAllElements();
	//make sure the elements are in the correct order by priority number
	//once they are pulled from the database
	eventCollection.sort();

	//add new elements fetched from the server
	eventCollection.each(function(model) {
		console.log("Inside each");
		var view = new NewsView.NewsEventView({model: model});
		tableView.back(view);
	});
	tableView.animate = currentAnimationValue;
	
});

eventCollection.fetch();



