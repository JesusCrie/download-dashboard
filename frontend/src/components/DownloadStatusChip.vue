<template>
    <div>
        <VTooltip top>
            <template v-slot:activator="{ on }">
                <VIcon v-on="on" :color="color">mdi-{{ icon }}</VIcon>
            </template>

            <span class="font-weight-bold text-center">{{ title }}</span>
            <span v-if="subtitle" class="text-center"><br>{{ subtitle }}</span>
        </VTooltip>
    </div>
</template>

<script lang="js">
    import { TrackStatus } from '../store';

    export default {
        name: 'DownloadStatusChip',
        props: {
            status: {
                type: /* TrackStatus */ Number,
                required: true
            },
            error: {
                type: String,
                required: false
            }
        },

        data() {
            return {
                icon: null,
                color: null,
                title: null,
                subtitle: this.error || null
            };
        },

        created() {
            switch (this.status) {
                case TrackStatus.COMPLETE:
                    this.title = 'Complete';
                    this.icon = 'check-underline-circle';
                    this.color = 'green';
                    break;
                case TrackStatus.ACTIVE:
                    this.title = 'Downloading';
                    this.icon = 'arrow-down-bold-circle';
                    this.color = 'blue';
                    break;
                case TrackStatus.WAITING:
                    this.title = 'Waiting';
                    this.icon = 'dots-horizontal-circle';
                    this.color = 'cyan';
                    break;
                case TrackStatus.PAUSED:
                    this.title = 'Paused';
                    this.icon = 'pause-circle';
                    this.color = 'amber';
                    break;
                case TrackStatus.ERROR:
                    this.title = 'Errored';
                    this.icon = 'alert-circle';
                    this.color = 'red';
                    break;
                case TrackStatus.REMOVED:
                    this.title = 'Removed';
                    this.icon = 'delete-circle';
                    this.color = 'grey';
                    break;
                case TrackStatus.UNKNOWN:
                default:
                    this.title = 'Unknown Status';
                    this.icon = 'help-circle';
                    this.color = 'black';
                    break;
            }
        }
    };
</script>
