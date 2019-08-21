<template>
    <VContainer fluid :class="responsivePadding">
        <VLayout :class="responsivePadding">
            <VFlex>
                <p class="mb-4">
                    <span class="display-1 mr-2">Status Board</span>
                    <span class="title grey--text text--darken-2">Monitor the host's health</span>
                </p>
                <VDivider/>
            </VFlex>
        </VLayout>

        <VLayout wrap>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="OS" icon="raspberry-pi"
                            cssClasses="green" :value="distro"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="Uptime" icon="clock"
                            cssClasses="pink" :value="uptime | timeHuman"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="CPU Load" icon="chip"
                            cssClasses="blue" :value="(cpu / 100) | percentage"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="RAM Usage" icon="memory"
                            cssClasses="teal" :value="(memory / 100) | percentage"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="Network" icon="speedometer"
                            cssClasses="deep-orange lighten-2" :value="netSpeed | bytesSpeed"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="Disk Usage" icon="harddisk"
                            cssClasses="deep-purple" :value="(disk / 100) | percentage"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="Aria2 Status" icon="cloud-tags"
                            cssClasses="cyan" :value="aria"/>
            </VFlex>

            <VFlex xs12 sm6 md4 :class="responsivePadding">
                <StatusCard title="Active Downloads" icon="download-multiple"
                            cssClasses="indigo" :value="ariaActive + ''"/>
            </VFlex>

        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import StatusCard from '@/components/StatusCard.vue';
    import { statusRequest } from '../repositories/repository';
    import { mapState } from 'vuex';

    export default {
        name: 'StatusBoard',
        components: {StatusCard},

        computed: {
            ...mapState({
                distro: state => state.status.distro,
                uptime: state => state.status.uptime,
                cpu: state => state.status.cpu,
                memory: state => state.status.memory,
                netSpeed: state => state.status.netSpeed,
                disk: state => state.status.disk,
                aria: state => state.status.aria,
                ariaActive: state => state.status.ariaActive
            }),

            responsivePadding() {
                return {
                    'pa-4': this.$vuetify.breakpoint.mdAndUp,
                    'pa-2': this.$vuetify.breakpoint.smAndDown
                };
            }
        },

        mounted() {
            statusRequest.poll(1_000, ({data}) => {
                this.$store.commit('status/toState', data);
            }, err => {
                this.$toast(`Failed to retrieve status values: ${err.message | err}`, {color: 'error'});
            });
        },

        beforeDestroy() {
            statusRequest.stopPolling();
        }
    };
</script>
