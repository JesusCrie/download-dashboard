import Vue from 'vue';
import Vuetify, { VBtn, VIcon, VSnackbar } from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.min.css';
import colors from 'vuetify/lib/util/colors';
import VuetifyToast from 'vuetify-toast-snackbar';

Vue.use(Vuetify, {
    components: {
        VSnackbar, VBtn, VIcon
    }
});

// Plugin toast
Vue.use(VuetifyToast, {
    x: 'center',
    y: 'bottom',
    color: ''
});

const baseTheme = {
    error: colors.red.accent2,
    info: colors.blue.base,
    success: colors.green.base,
    warning: colors.amber.base
};

const lightTheme = {
    primary: colors.teal.base,
    secondary: colors.grey.darken3,
    accent: colors.blue.accent1,
    ...baseTheme
};

const darkTheme = {
    primary: lightTheme.secondary,
    secondary: lightTheme.primary,
    accent: lightTheme.accent,
    ...baseTheme
};

export default new Vuetify({
    theme: {
        dark: false,
        themes: {
            light: lightTheme,
            dark: darkTheme
        }
    },
    options: {
        customProperties: true
    },
    icons: {
        iconfont: 'mdi'
    }
});
