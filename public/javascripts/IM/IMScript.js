(function() {

	var instance = IMModel.getCollection(),
		collection, table, i, n;
	instance.fetch();
	instance.on('sync', function() {
		var seasons = ["fall", "winter", "summer", "spring"];
		for (i = 0, n = 4; i < n; ++i) {
			
			collection = IMModel.getCollection(seasons[i]);
			table = IMView.getTable(i);
			collection.each(function(model) {
				table.append(model);
			});
		}
	});
		

})();