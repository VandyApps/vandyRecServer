//setup the MonthView instance
var currentDate = new Date();
var fitnessClasses = new FitnessClasses({month: currentDate.getMonth(), year: currentDate.getYear() + 1900});
var monthView = new MonthView({month: currentDate.getMonth(), year: currentDate.getYear() + 1900, fitnessClasses: fitnessClasses});