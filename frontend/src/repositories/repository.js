import requestFactory from './requestFactory';
import * as auth from './authRepository';

// Metrics
const healthRequest = requestFactory('/health', 'head');
const statusRequest = requestFactory('/status');

export {
    healthRequest,
    statusRequest,
    auth
};
