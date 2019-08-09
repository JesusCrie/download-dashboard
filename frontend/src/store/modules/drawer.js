const drawer = {
    state: {
        isVisible: true,
        isMini: true
    },

    mutations: {
        setDrawerState(state, {isVisible, isMini}) {
            if (isVisible != null) {
                state.isVisible = isVisible;
            }

            if (isMini != null) {
                state.isMini = isMini;
            }
        },

        toggleDrawerVisible(state) {
            state.isVisible = !state.isVisible;
        }
    }
};

export default drawer;
