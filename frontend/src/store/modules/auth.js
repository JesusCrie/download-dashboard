import { authCheckRequest, authRefreshRequest, authRequest } from '../../repositories/authRepository';
import { setAuthorizationHeader } from '../../repositories/requestFactory';

const PERSISTENCE_JWT_TOKEN_KEY = 'auth:jwtToken';
const PERSISTENCE_REFRESH_TOKEN_KEY = 'auth:refreshToken';

let persister = null;

const auth = {
    namespaced: true,

    state: {
        isLoggedIn: false, // Whether the user is considered logged in
        isExpired: false, // Whether the user session is considered to be in its 'expired' state
        jwtToken: null,
        refreshToken: null
    },

    getters: {
        bearerToken(state) {
            return `Bearer ${state.jwtToken}`;
        }
    },

    mutations: {
        setPersister(state, {set}) {
            persister = set;
        },

        loadTokensFromPersistence(state, {get}) {
            state.jwtToken = get(PERSISTENCE_JWT_TOKEN_KEY);
            state.refreshToken = get(PERSISTENCE_REFRESH_TOKEN_KEY);
        },

        saveTokensToPersistence(state) {
            if (!persister) {
                return;
            }

            persister(PERSISTENCE_JWT_TOKEN_KEY, state.jwtToken);
            persister(PERSISTENCE_REFRESH_TOKEN_KEY, state.refreshToken);
        },

        setLogged(state, {loggedIn}) {
            state.isLoggedIn = loggedIn;

            // Reset expired state automatically
            if (loggedIn) {
                state.isExpired = false;
            }
        },

        setExpired(state, {expired}) {
            state.isExpired = expired;

            // Reset logged in state automatically
            if (expired) {
                state.isLoggedIn = false;
            }
        },

        setToken(state, {token}) {
            state.jwtToken = token;
        },

        setRefreshToken(state, {token}) {
            state.refreshToken = token;
        }
    },

    actions: {
        checkAuth({commit, dispatch}) {
            // Get a new token with the refresh token
            authCheckRequest().then(() => {
                commit('setLogged', {loggedIn: true});
            }, err => {
                if (err?.response?.status === 403) {
                    console.warn('Auth token expired, trying to refresh...');
                    // Don't flag as disconnected yet, first try to refresh
                    dispatch('refreshToken');
                }
            });
        },

        login({commit, getters}, {password, cb}) {
            authRequest({password}).then(({data}) => {
                console.log('Successfully logged in !');
                commit('setToken', {token: data.token});
                commit('setRefreshToken', {token: data.refreshToken});
                commit('saveTokensToPersistence');
                commit('setLogged', {loggedIn: true});
                setAuthorizationHeader(getters.bearerToken);

                // Call callback with no args for success
                if (cb) cb();
            }, err => {
                if (err?.response?.status === 403) {
                    console.warn('Failed to login likely due to wrong password');
                } else {
                    console.error('Login failed due to undetermined reason !');
                }
                commit('setLogged', {loggedIn: false});

                // Call callback with args for error
                if (cb) cb(err);
            });
        },

        refreshToken({commit, getters, state}) {
            if (!state.refreshToken) {
                commit('setLogged', {loggedIn: false});
                return;
            }

            authRefreshRequest({refreshToken: state.refreshToken}).then(({data}) => {
                console.log('Auth token successfully refreshed !');
                commit('setToken', {token: data.token});
                commit('saveTokensToPersistence');
                commit('setLogged', {loggedIn: true});

                setAuthorizationHeader(getters.bearerToken);
            }, err => {
                console.warn('Failed to refresh auth token, login required');
                commit('setExpired', {expired: true});
            });
        }
    }
};

export default auth;
