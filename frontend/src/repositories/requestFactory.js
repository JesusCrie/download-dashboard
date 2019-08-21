import axios from 'axios';
import * as queryString from 'query-string';

let baseUrl;
if (process.env.NODE_ENV === 'production') {
    baseUrl = `${window.location.protocol}//${window.location.host}/api`;
} else {
    baseUrl = 'http://localhost:8000';
}

const instance = axios.create({
    baseURL: baseUrl
});

const setAuthorizationHeader = header => {
    instance.defaults.headers.common['Authorization'] = header;
};

const requestFactory = (path, method = 'get', axiosConfig = {}, mapper = x => x) => {
    // Build a specialized url builder
    const urlBuilder = query => {
        let url = path;
        if (query) {
            url += '?';
            url += queryString.stringify(query);
        }

        return url;
    };

    // Build the request executor
    const requestExecutor = (() => {

        // No body
        if (method === 'get' || method === 'head') {
            /*async*/
            return query => {
                return instance[method](urlBuilder(query), axiosConfig).then(mapper);
            };

        } else {
            return (body, query) => {
                return instance[method](urlBuilder(query), body, axiosConfig).then(mapper);
            };
        }
    })();

    // *** Polling methods
    // If the function is called multiple times, the old one will be automatically stopped

    requestExecutor.poll = function (interval, onResolved, onReject) {
        // To avoid 'ghost' polling
        this.stopPolling();

        this.pollId = setInterval(() => {
            this().then(onResolved, onReject);
        }, interval);
    };
    requestExecutor.stopPolling = function () {
        if (this.pollId) {
            clearInterval(this.pollId);
            this.pollId = undefined;
        }
    };
    requestExecutor.isPolling = function () {
        return this.pollId !== undefined;
    };

    return requestExecutor;
};

export {
    requestFactory as default,
    setAuthorizationHeader
}
