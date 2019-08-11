<template>
    <VApp>
        <VSystemBar v-if="$vuetify.breakpoint.smAndDown"/>

        <!-- Drawer -->
        <TheSidebar/>

        <!-- Toolbar -->
        <TheAppBar/>

        <!-- Content -->
        <VContent>
            <router-view/>
        </VContent>

        <!-- Footer, no really need for now -->
        <!--VFooter app>
            <VFlex text-xs-center xs12>
                &copy; 2019 - <strong>Lucas Malandrino</strong>
            </VFlex>
        </VFooter-->
    </VApp>
</template>

<script lang="js">
    import TheSidebar from '@/components/TheSidebar.vue';
    import TheAppBar from '@/components/TheAppBar.vue';
    import { authCheckRequest, authRefreshRequest } from './repositories/authRepository';

    export default {
        name: 'App',
        components: {TheAppBar, TheSidebar},

        beforeCreate() {
            // Setup local storage
            this.$store.commit('persistence/detectStorage');

            // Load tokens
            if (this.$store.getters['persistence/isAvailable']) {
                const get = this.$store.getters['persistence/retriever'];
                this.$store.commit('auth/loadTokensFromPersistence', {get});
            }

            // Give a way for the auth to persist its tokens
            const set = this.$store.getters['persistence/persister'];
            this.$store.commit('auth/setPersister', {set});

            // Check auth status and try to refresh
            authCheckRequest().catch(err => {
                if (error?.response?.status === 403) {
                    console.warn('Auth token expired, trying to refresh...');

                    authRefreshRequest({refreshToken: this.$store.state.auth.refreshToken}).then(res => {
                        console.log('Auth token successfully refreshed !');
                    }, err => {
                        console.warn('Failed to refresh auth token, login required');
                        this.$store.commit('auth/setExpired', {isExpired: true});
                    });
                }
            });
        }
    };
</script>

<!-- Global non scoped styles -->
<style lang="scss">
    .no-radius {
        &.left {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        &.right {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }
    }

    .underline {
        text-decoration: underline;
    }
</style>
