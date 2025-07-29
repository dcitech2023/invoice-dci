// utils/dateFormatter.js

import moment from 'moment';

export function formatInvoiceDate(dateString) {
  return moment(dateString).format('D, MMM YYYY');
}
