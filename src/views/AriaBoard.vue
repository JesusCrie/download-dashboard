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

                <DownloadActions
                        :selected="selectedItems.length"
                        @new-uri="onNewUri"
                        @play-selected="onPlaySelected"
                        @play-all="onPlayAll"
                        @pause-selected="onPauseSelected"
                        @pause-all="onPauseAll"
                        @stop-selected="onStopSelected"
                        @stop-all="onStopAll"
                />

                <!-- Downloads -->
                <VDataTable show-select sort-by="status"
                            :headers="headers" :items="items" item-key="guid"
                            v-model="selectedItems">
                    <template v-slot:item.status="{ item }">
                        <DownloadStatusChip :status="item.status"/>
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

                <VDialog persistent
                         v-model="dialogOpen" :max-width="responsiveDialogWidth">
                    <NewDownloadFormCard @cancel="dialogOpen = false"/>
                </VDialog>

            </VFlex>
        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import DownloadStatusChip from '@/components/DownloadStatusChip';
    import DownloadProgressSlot from '@/components/DownloadProgressSlot';
    import { TrackStatus } from '@/store';
    import DownloadActions from '@/components/DownloadActions';
    import NewDownloadFormCard from '@/components/NewDownloadFormCard';

    export default {
        name: 'AriaBoard',
        components: {NewDownloadFormCard, DownloadActions, DownloadProgressSlot, DownloadStatusChip},
        data: () => ({
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
            ],

            selectedItems: [],
            _dialogOpen: false,
            get dialogOpen() {
                return this._dialogOpen;
            },
            set dialogOpen(val) {
                this._dialogOpen = val;
            }
        }),

        computed: {
            responsivePadding() {
                return {
                    'pa-4': this.$vuetify.breakpoint.mdAndUp,
                    'pa-2': this.$vuetify.breakpoint.smAndDown
                };
            },

            responsiveDialogWidth() {
                return this.$vuetify.breakpoint.mdAndUp ? '40vw' : '100vw';
            }
        },

        methods: {
            onNewUri() {
                this.dialogOpen = true;
            },

            onPlaySelected() {

            },

            onPlayAll() {

            },

            onPauseSelected() {

            },

            onPauseAll() {

            },

            onStopSelected() {

            },

            onStopAll() {

            }
        }
    };
</script>
