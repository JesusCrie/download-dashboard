import Vue from 'vue';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import { percentage, bytes, time } from '../filters/numeral-filters-overrides';

Vue.use(vueNumeralFilterInstaller);

Vue.filter('percentage', percentage);
Vue.filter('bytes', bytes);
Vue.filter('time', time);
