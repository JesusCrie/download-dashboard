import numeral from 'numeral';

export const percentage = value => numeral(value).format('0.0 %');
export const bytes = value => numeral(value).format('0.00 ib');
export const time = value => numeral(value).format('00:00:00');
