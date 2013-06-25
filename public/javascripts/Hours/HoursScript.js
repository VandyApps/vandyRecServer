(function(global) {

    //create the table views for backbone
    global.tableViews = [];
        var hoursCollection = new global.HoursModel.HoursCollection();
    
    global.hoursCollection = hoursCollection;

    hoursCollection.fetch();
    hoursCollection.on('reset' , function() {
        var i, views;
        for (i = 0; i < 4; ++i) {
        switch(i) {
        case 0:
            views = hoursCollection.getBaseHours().map(function(model) {
                return new this.HoursView.HoursItem({model: model});
            });
            break;
        case 1:
            views = hoursCollection.getOtherHours(true).map(function(model) {
                return new this.HoursView.HoursItem({model: model});
            });
            break;
        case 2:
            views = hoursCollection.getClosedHours().map(function(model) {
                return new this.HoursView.HoursItem({model: model});
            });
            break;
        case 3:
            views = hoursCollection.getOtherHours(false).map(function(model) {
                return new this.HoursView.HoursItem({model: model});
            });
            break;
        default:
            console.log("The iterator for creating Table views in hours passed index 3. Should never happen");
            break;
        }
        global.tableViews.push(new global.HoursView.HoursTable({type: i, views: views}));
    }
    }.bind(global));

    
    

})(this);