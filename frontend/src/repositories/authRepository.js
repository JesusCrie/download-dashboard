import store from '../store/index';
import requestFactory, { setBearerToken } from './requestFactory';

const authRequest = requestFactory('/auth', 'post', {}, ({data}) => {
    setBearerToken(data.token);
    store.commit('auth/setToken', {token: data.token});
    store.commit('auth/setRefreshToken', {token: data.refreshToken});
    store.commit('auth/saveTokensToPersistence');
    store.commit('auth/setLogged', {loggedIn: true});
    store.commit('auth/setExpired', {expired: false});

    return true;
});

const authRefreshRequest = requestFactory('/auth/refresh', 'post', {}, ({data}) => {
    setBearerToken(data.token);
    store.commit('auth/setToken', {token: data.token});
    store.commit('auth/saveTokensToPersistence');
    store.commit('auth/setLogged', {loggedIn: true});
    store.commit('auth/setExpired', {expired: false});

    return true;
});

const authCheckRequest = requestFactory('/auth/check');

export {
    authRequest,
    authRefreshRequest,
    authCheckRequest
};
