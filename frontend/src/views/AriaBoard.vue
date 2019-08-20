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
                        @stop-selected="onStopSelected"
                        @stop-all="onStopAll"
                        :is-stop-loading="isStopLoading"
                />

                <!-- Downloads -->
                <DownloadTable v-model="selectedItems"/>

                <VDialog persistent
                         v-model="dialogOpen" :max-width="responsiveDialogWidth">
                    <NewDownloadFormCard @cancel="dialogOpen = false"/>
                </VDialog>

            </VFlex>
        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import DownloadStatusChip from '@/components/DownloadStatusChip.vue';
    import DownloadProgressSlot from '@/components/DownloadProgressSlot.vue';
    import DownloadActions from '@/components/DownloadActions.vue';
    import NewDownloadFormCard from '@/components/NewDownloadFormCard.vue';
    import DownloadTable from '@/components/DownloadTable.vue';
    import { pauseRequest, purgeRequest, removeRequest, resumeRequest } from '../repositories/ariaRepository';

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
            isStopLoading: false
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
                this.isPlayLoading = true;

                Promise.all(
                    this.selectedItems.map(({gid}) => resumeRequest({gid}))
                ).finally(() => {
                    this.isPlayLoading = false;
                });
            },

            onPlayAll() {
                this.isPlayLoading = true;

                resumeRequest().finally(() =>
                    this.isPlayLoading = false
                );
            },

            onPauseSelected() {
                this.isPauseLoading = true;

                Promise.all(
                    this.selectedItems.map(({gid}) => pauseRequest({gid}))
                ).finally(() =>
                    this.isPauseLoading = false
                );
            },

            onPauseAll() {
                this.isPauseLoading = true;

                pauseRequest().finally(() =>
                    this.isPauseLoading = false
                );
            },

            onStopSelected() {
                this.isStopLoading = true;

                Promise.all(
                    this.selectedItems.map(({gid}) => removeRequest(gid)())
                ).finally(() =>
                    this.isStopLoading = false
                );
            },

            onStopAll() {
                this.isStopLoading = true;

                purgeRequest().finally(() =>
                    this.isStopLoading = false
                );
            }
        }
    };
</script>
