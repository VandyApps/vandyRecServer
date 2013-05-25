//make sure that the reset event is only being called during server syncing
//animation is turned off during reset events
eventCollection.on('reset', function() {
	var currentAnimationValue = tableView.animate;
	tableView.animate = false;
	//must remove all elements from the table view first
	tableView.removeAllElements();
	//make sure the elements are in the correct order by priority number
	//once they are pulled from the database
	eventCollection.sort();

	//add new elements fetched from the server
	eventCollection.models.forEach(function(model) {
		var newElement = new NewsView.NewsEventView({model: model, appendToTableView: true});
	});
	tableView.animate = currentAnimationValue;
	loading.stop();
});

window.loading = new LoadMessage();
loading.start();
eventCollection.fetch();



