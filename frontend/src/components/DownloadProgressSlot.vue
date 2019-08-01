<template>
    <div>
        <VProgressCircular class="mr-1" :size="spinnerSize"
                           :value="progressNormalized"
                           :indeterminate="isIndeterminate"
                           :color="color">

            <VIcon v-if="isComplete" class="subtitle-1" color="green">mdi-check-bold</VIcon>
        </VProgressCircular>
        {{ progress | percentage }}
    </div>
</template>

<script lang="js">
    import { TrackStatus } from '@/store';

    export default {
        name: 'DownloadProgressSlot',
        props: {
            status: {
                type: /* TrackStatus */ Number,
                required: true
            },
            progress: {
                type: Number,
                required: true
            },

            spinnerSize: {
                type: Number,
                required: false,
                default: 26
            }
        },

        computed: {
            color() {
                switch (this.status) {
                    case TrackStatus.COMPLETE:
                        return 'green';
                    case TrackStatus.ACTIVE:
                    case TrackStatus.WAITING:
                        return 'blue';
                    case TrackStatus.PAUSED:
                        return 'amber';
                    case TrackStatus.ERROR:
                    case TrackStatus.REMOVED:
                    case TrackStatus.UNKNOWN:
                    default:
                        return 'red';
                }
            },

            isIndeterminate() {
                return this.status === TrackStatus.WAITING;
            },

            isComplete() {
                return this.progress >= 1 || this.status === TrackStatus.COMPLETE;
            },

            progressNormalized() {
                return this.progress * 100;
            }
        }
    };
</script>
