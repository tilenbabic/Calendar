import {checkIfDateIsHoliday} from "./holidays.js";

// Predefined size of the calendar.
const calendarColumns = 7;
const calendarRows = 6;

const daysInMonth = (year, month) => {
  // parameter date=0 gives the last day of previous month.
  return new Date(year, month + 1, 0).getDate();
}

// Returns (Monday = 0, ..., Sunday = 6).
const firstWeekdayInMonth = (year, month) => {
  let weekday = new Date(year, month, 1).getDay();
  // Shift weekday from (Sunday=0, ..., Saturday=6) to (Monday=0, ..., Sunday=6).
  return (weekday + 6) % 7;
}

const isSameDate = (date1, date2) => 
  date1.getFullYear() === date2.getFullYear() && 
  date1.getMonth() === date2.getMonth() && 
  date1.getDate() === date2.getDate();


export const isValidDate = (year, month, day) => {
  let date = new Date(year, month, day);
  return date.getFullYear() == year && date.getMonth() == month && date.getDate() == day;
}

// Returns string with classes if date is a holiday or a current day.
function getDateElementClass (todaysDate, date){
  let classNames = [];
  if (isSameDate(todaysDate, date)){
    classNames.push("today");
  }
  if(checkIfDateIsHoliday(date.getFullYear(), date.getMonth(), date.getDate())) {
    classNames.push("holidays");
  }
  return classNames.join(' ');
}

export function displayCalendar(calendarElementId, year, month) {
  const firstWeekdayOfCurrMonth = firstWeekdayInMonth(year, month);
  const numOfDaysInCurrMonth = daysInMonth(year, month);
  const numOfDaysInPastMonth = daysInMonth(year, month - 1);
  const todaysDate = new Date();
  let calendarContent = ``; 
  let className = "";

  // Append days before the current month.
  for (let i = (numOfDaysInPastMonth - firstWeekdayOfCurrMonth) + 1; i <= numOfDaysInPastMonth; i++) {
    className = getDateElementClass (todaysDate, new Date(year, month - 1, i));
    calendarContent += `<div class="inactive-month ${className}"> ${i} </div>`;
  }

  // Append days of the current month.
  for (let i = 1; i <= numOfDaysInCurrMonth; i++) {
    className = getDateElementClass (todaysDate, new Date(year, month, i));
    calendarContent += `<div class="${className}"> ${i} </div>`;
  }

  // Append days after the current month.
  const numOfDaysLeft = (calendarColumns * calendarRows) - firstWeekdayOfCurrMonth - numOfDaysInCurrMonth;
  for (let i = 1; i <= numOfDaysLeft; i++) {
    className = getDateElementClass (todaysDate, new Date(year, month + 1, i));
    calendarContent += `<div class="inactive-month ${className}"> ${i} </div>`;
  }

  // Display the month.
  document.getElementById(calendarElementId).innerHTML = calendarContent;
}