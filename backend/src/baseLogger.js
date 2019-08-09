import { Signale } from 'signale';
import figures from 'figures';

const globalConfig = {
    displayDate: true,
    displayTimestamp: true,
    underlineLabel: false
};

// Base logger
const baseLogger = new Signale();
baseLogger.config(globalConfig);

const SCOPE_LENGTH = 10;
const baseScope = baseLogger.scope.bind(baseLogger);
baseLogger.scope = name => {
    if (!name || !name.length) {
        name = Array(SCOPE_LENGTH).fill('_').join('');

    } else if (name.length > SCOPE_LENGTH) {
        name = name.slice(0, SCOPE_LENGTH);
        baseLogger.warn(`Scope '${name}' too long, truncated`);

    } else if (name.length < SCOPE_LENGTH) {
        name = [
            ...name,
            ...Array(SCOPE_LENGTH - name.length).fill('_')
        ].join('');
    }

    return baseScope(name);
};

// Download logger
const downloadLogger = new Signale({
    types: {
        complete: {
            badge: figures.tick,
            color: 'green',
            label: 'complete',
            logLevel: 'info'
        },
        active: {
            badge: figures.play,
            color: 'green',
            label: 'active',
            logLevel: 'info'
        },
        paused: {
            badge: '⏸',
            color: 'blue',
            label: 'paused',
            logLevel: 'info'
        },
        error: {
            badge: figures.cross,
            color: 'red',
            label: 'error',
            logLevel: 'error'
        }
    }
});
downloadLogger.config(globalConfig);

// Tracker logger
const trackerLogger = new Signale({
    types: {
        error: { //
            badge: figures.warning,
            color: 'red',
            label: 'Error',
            logLevel: 'error'
        },
        track: {
            badge: figures.pointer,
            color: 'yellow',
            label: 'Potential bug',
            logLevel: 'warn'
        }
    }
}).scope('Tracking');

if (process.env.NODE_ENV === 'production') {
    trackerLogger.disable();
}

export {
    baseLogger as default,
    downloadLogger,
    trackerLogger
};
