<template>
    <VContainer fluid :class="responsivePadding">
        <VLayout :class="responsivePadding">
            <VFlex>
                <p class="mb-4">
                    <span class="display-1 mr-2">Aria2 Downloads</span>
                    <span class="title grey--text text--darken-2">Manage your downloads</span>
                </p>
                <VDivider/>
            </VFlex>
        </VLayout>

        <VLayout wrap :class="responsivePadding">
            <VFlex>

                <VFlex class="mb-3">
                    <!-- Add btn -->
                    <VTooltip top>
                        <template v-slot:activator="{ on }">
                            <VBtn v-on="on" depressed color="primary">
                                <VIcon>mdi-plus</VIcon>&nbsp;Add
                            </VBtn>
                        </template>

                        <span>Add a new URI<br>to the queue</span>
                    </VTooltip>

                    <VDivider vertical class="mx-2"/>

                    <!-- Start selected -->
                    <VTooltip top>
                        <template v-slot:activator="{ on }">
                            <VBtn v-on="on" depressed color="primary" class="no-radius right">
                                <VIcon>mdi-play</VIcon>
                            </VBtn>
                        </template>

                        <span>Resume selected</span>
                    </VTooltip>

                    <!-- Pause selected -->
                    <VTooltip top>
                        <template v-slot:activator="{ on }">
                            <VBtn v-on="on" depressed color="primary" tile>
                                <VIcon>mdi-pause</VIcon>
                            </VBtn>
                        </template>

                        <span>Pause selected</span>
                    </VTooltip>

                    <!-- Cancel selected -->
                    <VTooltip top>
                        <template v-slot:activator="{ on }">
                            <VBtn v-on="on" depressed color="primary" class="no-radius left">
                                <VIcon>mdi-stop</VIcon>
                            </VBtn>
                        </template>

                        <span>Stop selected</span>
                    </VTooltip>

                    <VDivider vertical class="mx-2"/>

                    <!-- Global start -->
                    <VTooltip top>
                        <template v-slot:activator="{ on }">
                            <VBtn v-on="on" depressed color="primary" class="no-radius right">
                                <VIcon>mdi-playlist-play</VIcon>
                            </VBtn>
                        </template>

                        <span>Resume all</span>
                    </VTooltip>

                    <!-- Global pause -->
                    <VTooltip top>
                        <template v-slot:activator="{ on }">
                            <VBtn v-on="on" depressed color="primary" class="no-radius left">
                                <VIcon>mdi-playlist-remove</VIcon>
                            </VBtn>
                        </template>

                        <span>Pause all</span>
                    </VTooltip>

                </VFlex>

                <!-- Downloads -->
                <VDataTable show-select
                            sort-by="status"
                            :headers="headers" :items="items" item-key="guid">
                    <template v-slot:item.status="{ item }">
                        <DownloadStatusBadge :status="item.status"/>
                    </template>

                    <template v-slot:item.progress="{ item }">
                        <DownloadProgressSlot :status="item.status" :progress="item.progress"/>
                    </template>

                    <template v-slot:item.downloadedSize="{ item }">
                        {{ item.downloadedSize | bytes }}
                    </template>

                    <template v-slot:item.totalSize="{ item }">
                        {{ item.totalSize | bytes }}
                    </template>

                    <template v-slot:item.speed="{ item }">
                        {{ item.speed | bytes }}/s
                    </template>

                    <template v-slot:item.elapsed="{ item }">
                        {{ item.elapsed | time }}
                    </template>

                    <template v-slot:item.remaining="{ item }">
                        {{ item.remaining | time }}
                    </template>
                </VDataTable>

            </VFlex>
        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import DownloadStatusBadge from '@/components/DownloadStatusBadge';
    import DownloadProgressSlot from '@/components/DownloadProgressSlot';
    import { TrackStatus } from '@/store';

    export default {
        name: 'AriaBoard',
        components: {DownloadProgressSlot, DownloadStatusBadge},
        data() {
            return {
                btns: null,
                headers: [
                    {text: 'Status', value: 'status'},
                    {text: 'Name', value: 'name'},
                    {text: 'Progress', value: 'progress', sort: (a, b) => b - a},
                    {text: 'Downloaded Size', value: 'downloadedSize'},
                    {text: 'Total Size', value: 'totalSize'},
                    {text: 'Speed', value: 'speed'},
                    {text: 'Elapsed Time', value: 'elapsed'},
                    {text: 'Remaining', value: 'remaining'}
                ],

                items: [
                    {
                        guid: 0,
                        name: 'SomeTotallyLegallyDownloadedMovie.mkv', status: TrackStatus.ACTIVE,
                        progress: 0.49, downloadedSize: 525709420, totalSize: 1072876367,
                        speed: 1960000, elapsed: 35, remaining: 40
                    }, {
                        guid: 1,
                        name: 'SomeLowQualityHentai.avi', status: TrackStatus.COMPLETE,
                        progress: 1, downloadedSize: 204732003, totalSize: 204732003,
                        speed: 15000, elapsed: 125, remaining: 0
                    }
                ]
            };
        },

        computed: {
            responsivePadding() {
                return {
                    'pa-4': this.$vuetify.breakpoint.mdAndUp,
                    'pa-2': this.$vuetify.breakpoint.smAndDown
                };
            }
        },

        methods: {}
    };
</script>

<style lang="scss" scoped>
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
</style>
