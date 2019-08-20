<template>
    <div>
        <template v-if="!isOnline">
            <h1 class="text-center display-4 ma-10">App Offline</h1>
            <h2 class="text-center display-1 font-weight-thin font-italic">Can't reach server</h2>
        </template>
        <template v-else-if="!isLoggedIn">
            <VContainer>
                <VLayout wrap mt-12>
                    <VFlex xs12>
                        <h2 class="text-center display-3 font-weight-bold">App locked</h2>
                    </VFlex>
                    <VFlex xs12 mt-4 text-center>
                        <span class="title font-weight-light">Enter the master password to gain access to the app</span>
                    </VFlex>
                    <VFlex xs12 md6 offset-md3 mt-10>
                        <MasterPasswordForm/>
                    </VFlex>
                </VLayout>
            </VContainer>
        </template>
        <!-- If the app is unlocked, the default page is /status -->
        <!-- so no default view here -->
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import MasterPasswordForm from '../components/MasterPasswordForm';

    export default {
        name: 'Home',
        components: {MasterPasswordForm},
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
