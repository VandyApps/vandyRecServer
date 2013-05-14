var newsData = $('#newsData').text();

window.newsArray = JSON.parse(newsData);
//sort the news array so that they are in the required order
newsArray.sort(function(newsA, newsB) {
	return (newsA.priorityNumber - newsB.priorityNumber);
});

//add the array to the table view via backbone objects
//add the array to the event collection
newsArray.forEach(function(event) {
	var anEvent = new NewsEvent({description: event.description});
	var anEventView = new NewsEventView({model: anEvent, appendToTableView: true});

	eventCollection.models.push(anEvent);
});


