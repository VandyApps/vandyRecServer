console.log("Calling the script");

//setup the MonthView instance
var currentDate = new Date();
var fitnessClasses = new GFModel.FitnessClasses({month: currentDate.getMonth(), year: currentDate.getYear() + 1900});
console.log("Created fitness classes");
var monthView = new GFView.MonthView({month: currentDate.getMonth(), year: currentDate.getYear() + 1900, fitnessClasses: fitnessClasses});
console.log("Created month view");