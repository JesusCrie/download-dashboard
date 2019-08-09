<template>
    <div>
        <template v-if="!isOnline">
            App offline
        </template>
        <template v-else-if="!isLoggedIn">
            <VContainer>
                <VLayout column align-center mt-12>
                    <VFlex>
                        <h2 class="text-center display-3 font-weight-bold">App locked</h2>
                    </VFlex>
                    <VFlex mt-4>
                        <span class="text-center title font-weight-light">Enter the master password to gain access to the app</span>
                    </VFlex>
                </VLayout>
            </VContainer>
        </template>
        <template v-else>
            <VContainer>
                <h1 class="text-center display-4"></h1>
            </VContainer>
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: 'Home',

        computed: {
            ...mapState({
                isOnline: state => state.isOnline,
                isLoggedIn: state => state.auth.isLoggedIn
            }),

            responsiveSubtext: () => ({
                'display-1': this.$vuetify.breakpoint.mdAndUp,
                'title': this.$vuetify.breakpoint.smAndDown
            })
        }
    };
</script>

<style scoped>

</style>
