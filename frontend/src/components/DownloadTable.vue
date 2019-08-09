<template>
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
</template>

<script>
    import DownloadStatusChip from './DownloadStatusChip';
    import DownloadProgressSlot from './DownloadProgressSlot';
    import { TrackStatus } from '@/store';
    import axios from 'axios';

    export default {
        name: 'DownloadTable',
        components: {DownloadStatusChip, DownloadProgressSlot},

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

            _selectedItems: []
        }),

        computed: {
            selectedItems: {
                get() {
                    return this._selectedItems;
                },

                set(v) {
                    console.log(v);
                    this._selectedItems = v;
                    this.$emit('selectionChange', v);
                }
            }
        },

        methods: {
            queryTracks() {
                axios.get()
            }
        }
    };
</script>

<style scoped>

</style>
