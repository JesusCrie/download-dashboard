import Vue from 'vue';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import { bytes, bytesSpeed, percentage, time, timeHuman } from '../filters/numeral-filters-overrides';

Vue.use(vueNumeralFilterInstaller);

Vue.filter('percentage', percentage);
Vue.filter('bytes', bytes);
Vue.filter('bytesSpeed', bytesSpeed);
Vue.filter('time', time);
Vue.filter('timeHuman', timeHuman);
