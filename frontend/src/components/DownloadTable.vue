<template>
    <VDataTable show-select sort-by="status"
                :headers="headers" :items="items" item-key="gid"
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

        <template v-slot:item.remaining="{ item }">
            <template v-if="Number.isFinite(item.remaining)">
                {{ item.remaining | time }}
            </template>
            <VIcon v-else>mdi-infinity</VIcon>
        </template>

        <template v-slot:item.elapsed="{ item }">
            {{ item.elapsed | time }}
        </template>
    </VDataTable>
</template>

<script>
    import DownloadStatusChip from './DownloadStatusChip';
    import DownloadProgressSlot from './DownloadProgressSlot';
    import { listRequest } from '../repositories/ariaRepository';
    import { mapState } from 'vuex';

    export default {
        name: 'DownloadTable',
        components: {DownloadStatusChip, DownloadProgressSlot},

        model: {
            prop: 'selected',
            event: 'selectionChange'
        },

        props: {
            selected: Array,
            required: false
        },

        data: () => ({
            headers: [
                {text: 'Status', value: 'status'},
                {text: 'Name', value: 'name'},
                {text: 'Progress', value: 'progress', sort: (a, b) => b - a},
                {text: 'Downloaded Size', value: 'downloadedSize'},
                {text: 'Total Size', value: 'totalSize'},
                {text: 'Speed', value: 'speed'},
                {text: 'Elapsed Time', value: 'elapsed'},
                {text: 'Remaining Time', value: 'remaining'}
            ],

            _selectedItems: []
        }),

        computed: {
            ...mapState({
                items: state => state.aria.tracks
            }),

            selectedItems: {
                get() {
                    return this.selected;
                },

                set(v) {
                    this.$emit('selectionChange', v);
                }
            }
        },

        mounted() {
            listRequest.poll(1_000, ({data}) => {
                this.$store.dispatch('aria/normalizeAndSaveTracks', {tracks: data});
            }, err => {
                this.$store.commit('aria/setTracks', {tracks: []});
            });
        },

        beforeDestroy() {
            listRequest.stopPolling();
        }
    };
</script>
