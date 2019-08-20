import requestFactory from './requestFactory';

const authRequest = requestFactory('/auth', 'post');
const authRefreshRequest = requestFactory('/auth/refresh', 'post');
const authCheckRequest = requestFactory('/auth/check');

export {
    authRequest,
    authRefreshRequest,
    authCheckRequest
};
