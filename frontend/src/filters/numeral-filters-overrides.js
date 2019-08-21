import numeral from 'numeral';
import moment from 'moment';

export const percentage = value => numeral(value).format('0.0 %');
export const bytes = value => numeral(value).format('0.00 ib');
export const bytesSpeed = value => numeral(value).format('0.00 ib') + '/s';
export const time = value => numeral(value).format('00:00:00');
export const timeHuman = value => {
    return moment.duration(value, 'seconds').humanize();
};
