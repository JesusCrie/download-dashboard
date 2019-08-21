const status = {
    namespaced: true,

    state: {
        distro: '',
        uptime: 0,
        cpu: 0,
        memory: 0,
        netSpeed: 0,
        disk: 0,
        aria: '',
        ariaActive: 0
    },

    mutations: {
        toState(state, {distro, uptime, cpu, memory, netSpeed, disk, aria, ariaActive}) {
            state.distro = distro;
            state.uptime = uptime;
            state.cpu = cpu;
            state.memory = memory;
            state.netSpeed = netSpeed;
            state.disk = disk;
            state.aria = aria;
            state.ariaActive = ariaActive;
        }
    }
};

export default status;
