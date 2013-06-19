(function(global) {

    //create the table views for backbone
    var tableViews = [], i;
    global.hoursCollection = new global.HoursModel.HoursCollection()
        
    for (i = 0; i < 4; ++i) {
        tableViews.push(new global.HoursView.HoursTable({type: i}));
    }
    //fetch the data from the server and sort the data into the correct tables

    
    global.hoursCollection.fetch();

})(this);