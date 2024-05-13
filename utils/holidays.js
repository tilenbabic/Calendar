
// Holidays are stored as "dd.mm" => {name: string, fixed: boolean, occuringYears: Array(Number)}
const holidays = new Map();


export async function readHolidays(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error('Request Failed');
  }

  const rawData = await response.text();
  const parsedData = rawData.split(/\r?\n/);

  // Store holidays.
  parsedData.forEach(x => {
    const [date, name, status] = x.split(',');
    const [day, month, year] = date.split('.');
    // Store holidays that occur on the same date every year (fixed=true).
    if(status == "fixed"){
      holidays.set(`${day}.${month}`, {name: name, fixed: true, occuringYears: []});
      return;
    }
    // Store holidays that occur on different date every year (fixed=false).
    if(holidays.has(`${day}.${month}`)){
      holidays.get(`${day}.${month}`).occuringYears.push(year);
      return;
    }
    holidays.set(`${day}.${month}`, {name: name, fixed: false, occuringYears: [year]});
  });
};


export function checkIfDateIsHoliday(year, month, day){
  if(!holidays.has(`${day}.${month+1}`)){
    // Date is not a holiday.
    return false;
  }

  const {name, fixed, occuringYears} = holidays.get(`${day}.${month+1}`);
  if (fixed){
    // Date is a fixed holiday.
    return true;
  }
  
  // True if date is not-fixed holiday and occuring year is also right.
  return occuringYears.includes(`${year}`)
}
