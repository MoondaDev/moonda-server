import * as moment from 'moment';

export const getCurrentDate = () => {
  return new Date();
};

export const getNextYearDate = () => {
  return moment(getCurrentDate()).add(1, 'years').toDate();
};
