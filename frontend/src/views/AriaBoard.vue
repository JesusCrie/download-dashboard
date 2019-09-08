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
                        :is-play-loading="isPlayLoading"
                        @pause-selected="onPauseSelected"
                        @pause-all="onPauseAll"
                        :is-pause-loading="isPauseLoading"
                        @stop-selected="onDeleteSelected"
                        @stop-all="onDeleteAll"
                        :is-delete-loading="isDeleteLoading"
                />

                <!-- Downloads -->
                <VCard outlined>
                    <DownloadTable v-model="selectedItems"/>
                </VCard>

                <VDialog persistent
                         v-model="dialogOpen" :max-width="responsiveDialogWidth">
                    <NewDownloadFormCard @close="dialogOpen = false"/>
                </VDialog>

            </VFlex>
        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import DownloadStatusChip from '../components/download/DownloadStatusChip.vue';
    import DownloadProgressSlot from '../components/download/DownloadProgressSlot.vue';
    import DownloadActions from '../components/download/DownloadActions.vue';
    import NewDownloadFormCard from '../components/download/NewDownloadFormCard.vue';
    import DownloadTable from '../components/download/DownloadTable.vue';
    import { pauseRequest, purgeRequest, removeRequest, resumeRequest } from '../repositories/ariaRepository';
    import { TrackStatus } from '../store';

    export default {
        name: 'AriaBoard',
        components: {DownloadTable, NewDownloadFormCard, DownloadActions, DownloadProgressSlot, DownloadStatusChip},
        data: () => ({
            selectedItems: [],
            _dialogOpen: false,
            get dialogOpen() {
                return this._dialogOpen;
            },
            set dialogOpen(val) {
                this._dialogOpen = val;
            },

            isPlayLoading: false,
            isPauseLoading: false,
            isDeleteLoading: false
        }),

        computed: {
            updatedSelectedTracks() {
                return this.getUpdatedTrackList(this.selectedItems);
            },

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
            getUpdatedTrackList(tracks) {
                return tracks.map(({gid}) => {
                    return this.$store.state.aria.tracks.find(({gid: otherGid}) => otherGid === gid);
                }).filter(i => i !== undefined);
            },

            onNewUri() {
                this.dialogOpen = true;
            },

            onPlaySelected() {
                this.isPlayLoading = true;

                Promise.all(
                    this.updatedSelectedTracks
                        .filter(({status}) => status !== TrackStatus.ACTIVE)
                        .map(({gid}) => resumeRequest(undefined, {gid}))
                ).then(() => {
                    this.$toast('Successfully resumed tracks');
                }, err => {
                    this.$toast(`Failed to resume: ${err.message || err}`, {color: 'error'});
                }).finally(() => {
                    this.isPlayLoading = false;
                });
            },

            onPlayAll() {
                this.isPlayLoading = true;

                resumeRequest().then(() => {
                    this.$toast('Successfully resumed all tracks');
                }, err => {
                    this.$toast(`Failed to resume: ${err.message || err}`, {color: 'error'});
                }).finally(() => {
                    this.isPlayLoading = false;
                });
            },

            onPauseSelected() {
                this.isPauseLoading = true;

                Promise.all(
                    this.updatedSelectedTracks
                        .filter(({status}) => status === TrackStatus.ACTIVE)
                        .map(({gid}) => pauseRequest(undefined, {gid}))
                ).then(() => {
                    this.$toast('Successfully paused tracks');
                }, err => {
                    this.$toast(`Failed to pause: ${err.message || err}`, {color: 'error'});
                }).finally(() => {
                    this.isPauseLoading = false;
                });
            },

            onPauseAll() {
                this.isPauseLoading = true;

                pauseRequest().then(() => {
                    this.$toast('Successfully paused all tracks');
                }, err => {
                    this.$toast(`Failed to pause: ${err.message || err}`, {color: 'error'});
                }).finally(() => {
                    this.isPauseLoading = false;
                });
            },

            onDeleteSelected() {
                this.isDeleteLoading = true;

                Promise.all(
                    // No need for the `updatedSelectedTracks` here as we only need the gid
                    this.selectedItems.map(({gid}) => removeRequest(gid)())
                ).then(() => {
                    this.$toast('Successfully removed tracks');
                }, err => {
                    this.$toast(`Failed to remove: ${err.message || err}`, {color: 'error'});
                }).finally(() => {
                    this.isDeleteLoading = false;
                });
            },

            onDeleteAll() {
                this.isDeleteLoading = true;

                purgeRequest().then(() => {
                    this.$toast('Successfully purged tracks');
                }, err => {
                    this.$toast(`Failed to purge: ${err}`, {color: 'error'});
                }).finally(() => {
                    this.isDeleteLoading = false;
                });
            }
        }
    };
</script>
