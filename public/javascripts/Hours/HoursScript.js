(function(global) {

    //create the table views for backbone
    var tableViews = [], i;
    for (i = 0; i < 4; ++i) {
        tableViews.push(new global.HoursView.HoursTable({type: i}));
    }
    //fetch the data from the server and sort the data into the correct tables

    //demo data
    var model1 = new HoursModel.Hours(
        {
            name: 'Summer Hours', 
            priorityNumber: 0, 
            startDate: '05/02/2013',
            endDate: '08/17/2013',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var model2 = new HoursModel.Hours(
        {
            name: 'Spring Hours', 
            priorityNumber: 0, 
            startDate: '01/08/2013',
            endDate: '05/02/2013',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var model3 = new HoursModel.Hours(
        {
            name: 'Winter Hours', 
            priorityNumber: 0, 
            startDate: '12/14/2013',
            endDate: '01/08/2014',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });


    var model4 = new HoursModel.Hours(
        {
            name: 'Pool Hours', 
            priorityNumber: 1, 
            startDate: '01/08/2013',
            endDate: '01/08/2014',
            facilityHours: false,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });
    var model5 = new HoursModel.Hours(
        {
            name: 'Thanksgiving', 
            priorityNumber: 1, 
            startDate: '09/08/2013',
            endDate: '09/17/2013',
            facilityHours: true,
            closedHours: true,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });
    var model6 = new HoursModel.Hours(
        {
            name: 'Christmas', 
            priorityNumber: 2, 
            startDate: '12/25/2013',
            endDate: '12/25/2013',
            facilityHours: true,
            closedHours: true,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var model7 = new HoursModel.Hours(
        {
            name: 'New Hours', 
            priorityNumber: 2, 
            startDate: '02/12/2013',
            endDate: '4/12/2013',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var model8 = new HoursModel.Hours(
        {
            name: 'Contruction Hours', 
            priorityNumber: 2, 
            startDate: '10/12/2013',
            endDate: '09/18/2014',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var hoursItem1 = new global.HoursView.HoursItem({model: model1});
    var hoursItem2 = new global.HoursView.HoursItem({model: model2});
    var hoursItem3 = new global.HoursView.HoursItem({model: model3});
    var hoursCollection = new global.HoursModel.HoursCollection([model1, model2, model3, model4, model5, model6, model7, model8]);
    var hoursTableView = new global.HoursView.HoursTable();
    hoursTableView.add(hoursItem1);
    hoursTableView.add(hoursItem2);
    hoursTableView.add(hoursItem3);

})(this);