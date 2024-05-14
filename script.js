import { readHolidays } from "./utils/holidays.js";
import { displayCalendar, isValidDate } from "./utils/helpers.js";

// DOM elements.
const searchForm = document.getElementById('search-form');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const dateInput = document.getElementById('date-input');
const todayBtn = document.getElementById('calendar-today');


// Variable stores what date is currently displayed. Initial value is todays date.
const displayedDate = new Date();


function displayError (errorId, msg) {
  const errorElement = document.getElementById(errorId);
  errorElement.innerHTML = msg;
  errorElement.classList.add("visible");
}

function hideError (errorId) {
  const errorElement = document.getElementById(errorId);
  errorElement.classList.remove("visible");
}

const getElementsValue = (element) => { 
  return element.value;
}

const setElementsValue = (element, val) => {
  element.value = val;
}

function clearUI() {
  hideError('date-input-error');
  hideError('year-input-error');
  setElementsValue(monthInput, displayedDate.getMonth());
  setElementsValue(yearInput, displayedDate.getFullYear());
  setElementsValue(dateInput, "");
}

// Function is executed when the user searches for a specific date.
function onDateSubmit(e) {
  // Prevents submitting a form and refreshing a site.
  e.preventDefault();

  let date = getElementsValue(dateInput);
  if(date.length == 0){
    displayError('date-input-error', "Input Error: Input field is empty, you forgot to select a date!");
    return;
  }
  // Check (with regex) that the input is in the format dd.mm.yyyy .
  let dateFormatRegex = /^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4}$/;
  if(!dateFormatRegex.test(date)){
    displayError('date-input-error', "Input Error: Date format is incorrect, please use dd.mm.yyyy!");
    return;
  }
  const [day, month, year] = date.split('.').map(Number);
  if(!(1900 <= year && year <= 2100)){
    displayError('date-input-error', "Input Error: Please select a date between 1900 and 2100!");
    return;
  }
  // Check if date is valid (eg. 30.2.2024 passes first two validations, but is not a valid date).
  if(!isValidDate(year, month-1, day)){
    displayError('date-input-error', "Input Error: Date does not exist, please select a valid date!");
    return;
  }

  // Date is valid, update UI.
  displayedDate.setFullYear(year, month-1, day);
  hideError('date-input-error');
  hideError('year-input-error');
  setElementsValue(monthInput, displayedDate.getMonth());
  setElementsValue(yearInput, displayedDate.getFullYear());
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}

// Function is executed when month is selected through drop-down list.
function onMonthChange() {
  displayedDate.setMonth(getElementsValue(monthInput));
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
  clearUI();
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

  if(!(1900 <= yearValue && yearValue <= 2100)){
    displayError('year-input-error', "Input Error: Please select a year between 1900 and 2100!");
    return;
  }

  displayedDate.setFullYear(yearValue);
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
  clearUI();
}

function changeCalendarToToday(){
  displayedDate.setTime(new Date().getTime());
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
  clearUI();  
}

async function initHolidays(){
  await readHolidays('data/holidays.txt').catch((error) => console.log(error));
  // Holidays load with delay, so displayCalendar is called one more time.
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
}

function onDOMContentLoaded() {
  // Set calendar to todays date.
  initHolidays();
  displayCalendar('dates', displayedDate.getFullYear(), displayedDate.getMonth());
  clearUI();
}

// Initialize app.
function init() {
  // Event Listeners.
  searchForm.addEventListener('submit', onDateSubmit);
  monthInput.addEventListener('change', onMonthChange);
  yearInput.addEventListener('input', onYearChange);
  todayBtn.addEventListener('click', changeCalendarToToday);
  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
}

init();


