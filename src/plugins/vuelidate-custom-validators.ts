import { helpers } from 'vuelidate/lib/validators';

export const path = helpers.regex('path', /^[a-z0-9-_/.]*$/i);

export const filename = helpers.regex('filename', /^[a-z0-9-_.]*$/i);

export const bytes = helpers.regex('bytes', /^(?:[0-9]+ *[km]?)?$/i);
