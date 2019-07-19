<template>
    <v-app>

        <!-- Drawer -->
        <v-navigation-drawer app permanent
                             v-model="drawer"
                             :mini-variant.sync="miniDrawer">

            <!-- Header -->
            <v-toolbar flat class="transparent">
                <v-list>
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="@/assets/logo.png"/>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>Menu</v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-btn icon @click.stop="miniDrawer = !miniDrawer">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>

            <!-- Links -->
            <v-list>
                <v-divider></v-divider>


            </v-list>

        </v-navigation-drawer>

        <!-- Toolbar -->
        <v-toolbar app flat>
            <v-toolbar-title class="headline">
                <span>Downloader Dashboard</span>
            </v-toolbar-title>
        </v-toolbar>

        <!-- Content -->
        <v-content>
            <v-container>
                <!-- TODO: router -->
            </v-container>
        </v-content>

        <!-- Footer -->
        <v-footer app></v-footer>

    </v-app>
</template>

<script>
    export default {
        name: 'App',
        components: {},

        data() {
            // No need to use the store for this
            return {
                miniDrawer: true,
                drawer: true
            };
        }
    };
</script>
