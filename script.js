import { readHolidays } from "./utils/holidays.js";
import { displayCalendar, isValidDate } from "./utils/helpers.js";

// DOM elements.
const searchForm = document.getElementById('search-form');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const dateInput = document.getElementById('date-input');

// Variable stores what date is currently displayed. Initial value is todays date.
const displayedDate = new Date();


export const getElementsValue = (element) => { 
  return element.value;
}

export const setElementsValue = (element, val) => {
  element.value = val;
}

// Function is executed when the user searches for a specific date.
function onDateSubmit(e) {
  // Prevents submitting a form and refreshing a site.
  e.preventDefault();

  let date = getElementsValue(dateInput);
  // Check (with regex) that the input is in the format dd.mm.yyyy .
  let dateFormatRegex = /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/;
  if(!dateFormatRegex.test(date)){
    // raise warning
    // dateInput.classList.add('error');
    console.log(`Invalid date format: ${date}`);
    return;
  }
  // Check if date is valid (eg. 30.2.2024 passes first validation, but is not a valid date).
  const [day, month, year] = date.split('.').map(Number);
  if(!isValidDate(year, month-1, day)){
    // raise warning
    console.log(`Invalid date: ${date}`);
    return;
  }

  console.log(`Valid date: ${date}`); 

  // Date is valid, update UI.
  displayedDate.setFullYear(year, month-1, day);
  setElementsValue(monthInput, displayedDate.getMonth());
  setElementsValue(yearInput, displayedDate.getFullYear());
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}

// Function is executed when month is selected through drop-down list.
function onMonthChange() {
  displayedDate.setMonth(getElementsValue(monthInput));
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}

// Function is executed when year is changes through input field.
function onYearChange() {
  let yearValue = getElementsValue(yearInput);
  // Year has to have at least 4 digits.
  if(yearValue.length != 4) {
    return;
  }
  // Year has to be a number. 
  yearValue = Number(yearValue)
  if(isNaN(yearValue)) {
    return;
  }

  displayedDate.setFullYear(yearValue);
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}


async function initHolidays(){
  await readHolidays('data/holidays.txt').catch((error) => console.log(error));
  // Holidays load with delay, so displayCalendar is called one more time.
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}

function onDOMContentLoaded() {
  // Set calendar to todays date.
  setElementsValue(monthInput, displayedDate.getMonth());
  setElementsValue(yearInput, displayedDate.getFullYear());

  initHolidays();
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}


// Initialize app.
function init() {
  // Event Listeners.
  searchForm.addEventListener('submit', onDateSubmit);
  monthInput.addEventListener('change', onMonthChange);
  yearInput.addEventListener('input', onYearChange);
  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
}

init();


// dateInput.setCustomValidity("Lorum Ipsum");

