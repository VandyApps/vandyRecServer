//make sure that the reset event is only being called during server syncing
eventCollection.on('reset', function() {
	
	//must remove all elements from the table view first

	//add new elements fetched from the server
	eventCollection.models.forEach(function(model) {
		var newViewElement = new NewsEventView({model: model, appendToTableView: true});
	});

});


eventCollection.fetch();


