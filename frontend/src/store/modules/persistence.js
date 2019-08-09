import storageAvailable from 'storage-available';

const persistence = {
    namespaced: true,

    state: {
        storage: null
    },

    getters: {
        isAvailable(state) {
            return state.storage === null;
        },

        retriever: (state, getters) => key => {
            if (getters.isAvailable) {
                return state.storage.getItem(key);
            }
        },

        persister: (state, getters) => (key, value) => {
            if (getters.isAvailable) {
                if (typeof value !== 'string'){
                    value = JSON.stringify(value);
                }
                state.storage.setItem(key, value);
            }
        }
    },

    mutations: {
        detectStorage(state) {
            if (storageAvailable('localStorage')) {
                state.storage = localStorage;
            //} else if (storageAvailable('sessionStorage')) {
            //    state.storage = sessionStorage;
            //    console.warn('WARNING: localStorage is not available: sessionStorage will be used !');
            } else {
                console.warn('WARNING: localStorage is not available !');
                console.warn('WARNING: You will be disconnected when you will close this tab !');
                console.warn('WARNING: Calls to the persistence module will be silently ignored.');
            }
        },

        persist(state, {key, data}) {
            if (!state.storage) {
                return;
            }

            if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }

            state.storage.setItem(key, data);
        },

        clear(state) {
            if (!state.storage) {
                return;
            }

            state.storage.clear();
        }
    }
};

export default persistence;
