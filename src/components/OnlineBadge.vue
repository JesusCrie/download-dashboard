<template>
    <VChip :color="isOnline ? 'success' : 'error'" dark>
        <VIcon left>mdi-{{ isOnline ? 'check' : 'close' }}-circle</VIcon>

        <template v-if="isOnline">
            <strong>Online</strong>&nbsp;at {{ host }}
        </template>
        <template v-else>
            <string>Offline</string>
        </template>
    </VChip>
</template>

<script lang="ts">
    export default {
        name: 'OnlineBadge',
        props: {
            isOnline: {
                type: Boolean,
                required: true
            }
        },

        computed: {
            host() {
                return window.location.host;
            }
        }
    };
</script>
