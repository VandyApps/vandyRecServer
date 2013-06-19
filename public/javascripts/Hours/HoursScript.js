(function(global) {

    //create the table views for backbone
    var tableViews = [],
        hoursCollection = new global.HoursModel.HoursCollection();
      
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
            view = hoursCollection.getClosedHours().map(function(model) {
                return new this.HoursView.HoursItem({model: model});
            });
            break;
        case 3:
            view = hoursCollection.getOtherHours(false).map(function(model) {
                return new this.HoursView.HoursItem({model: model});
            });
            break;
        default:
            console.log("The iterator for creating Table views in hours passed index 3");
            break;
        }
        tableViews.push(new global.HoursView.HoursTable({type: i, views: views}));
    }
    }.bind(global));

    
    

})(this);