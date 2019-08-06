import { Signale } from 'signale';

const baseLogger = new Signale();

baseLogger.config({
    displayDate: true,
    displayTimestamp: true,
    uppercaseLabel: true
});

export default baseLogger;
