import moment from 'moment';

export function getCurrentAndNextYearShort() {
  const currentYear = moment().year(); // e.g., 2025
  const nextYear = currentYear + 1;
  return `${currentYear % 100}-${nextYear % 100}`;
}

export function getCurrentMonthNumber() {
  return moment().format('MM'); // Always 2 digits: '07'
}