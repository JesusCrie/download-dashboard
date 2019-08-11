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

    mutations: {
        setPersister(state, {set}) {
            persister = set;
        },

        loadTokensFromPersistence(state, {get}) {
            state.jwtToken = get(PERSISTENCE_JWT_TOKEN_KEY);
            state.refreshToken = get(PERSISTENCE_REFRESH_TOKEN_KEY);

            if (state.jwtToken) {
                state.isLoggedIn = true;
                state.isExpired = false;
            }
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
        },

        setExpired(state, {expired}) {
            state.isExpired = expired;
        },

        setToken(state, {token}) {
            state.jwtToken = token;
        },

        setRefreshToken(state, {token}) {
            state.refreshToken = token;
        }
    },

    actions: {
        refreshAuthToken(context) {
            // Get a new token with the refresh token
        }
    }
};

export default auth;
