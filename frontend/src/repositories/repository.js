import requestFactory from './requestFactory';

// Metrics
const healthRequest = requestFactory('/health', 'head');
const statusRequest = requestFactory('/status');

export {
    healthRequest,
    statusRequest
};
