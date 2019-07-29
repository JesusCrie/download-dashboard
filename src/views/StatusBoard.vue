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

            <VFlex v-for="(item, index) in statusIndicators" :key="index"
                   xs12 sm6 md4 :class="responsivePadding">
                <StatusCard v-bind="item"/>
            </VFlex>

        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import StatusCard from '@/components/StatusCard.vue';
    import { mapState } from 'vuex';

    export default {
        name: 'StatusBoard',
        components: {StatusCard},

        computed: {
            ...mapState(['statusIndicators']),

            responsivePadding() {
                return {
                    'pa-4': this.$vuetify.breakpoint.mdAndUp,
                    'pa-2': this.$vuetify.breakpoint.smAndDown
                };
            }
        }
    };
</script>
