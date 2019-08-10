import Request from 'axios-request-handler/src/axios-request';

let baseUrl;
if (process.env.NODE_ENV === 'production') {
    baseUrl = `${window.location.protocol}//${window.location.host}/api`;
} else {
    baseUrl = 'http://localhost:8000';
}

const healthCheck = new Request('/health', {
    baseUrl: baseUrl
});
