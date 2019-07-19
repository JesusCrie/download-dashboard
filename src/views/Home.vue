<template>
    <div>
        <VChip color="green" text-color="white">
            <VAvatar>
                <VIcon>mdi-check-circle</VIcon>
            </VAvatar>
            Online
        </VChip>

        <VChip color="red" text-color="white">
            <VAvatar>
                <VIcon>mdi-close-circle</VIcon>
            </VAvatar>
            Offline
        </VChip>

        <VDivider class="mt-2"/>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'Home'
    };
</script>
