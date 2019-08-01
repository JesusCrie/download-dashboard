<template>
    <VFlex class="mb-3">
        <!-- Add btn -->
        <VTooltip top>
            <template v-slot:activator="{ on }">
                <VBtn v-on="on" depressed color="primary"
                      @click="onAdd">
                    <VIcon>mdi-plus</VIcon>&nbsp;Add
                </VBtn>
            </template>

            <span>Add a new URI</span>
        </VTooltip>

        <VDivider vertical class="mx-2"/>

        <!-- Start selected -->
        <VTooltip top>
            <template v-slot:activator="{ on }">
                <VBtn v-on="on" depressed color="primary" class="no-radius right"
                      @click="onPlay">
                    <VIcon>mdi-play</VIcon>
                </VBtn>
            </template>

            <span>Resume <span class="underline">{{ selectedText }}</span></span>
        </VTooltip>

        <!-- Pause selected -->
        <VTooltip top>
            <template v-slot:activator="{ on }">
                <VBtn v-on="on" depressed color="primary" tile
                      @click="onPause">
                    <VIcon>mdi-pause</VIcon>
                </VBtn>
            </template>

            <span>Pause <span class="underline">{{ selectedText }}</span></span>
        </VTooltip>

        <!-- Cancel selected -->
        <VTooltip top>
            <template v-slot:activator="{ on }">
                <VBtn v-on="on" depressed color="primary" class="no-radius left"
                      @click="onStop">
                    <VIcon>mdi-stop</VIcon>
                </VBtn>
            </template>

            <span>Stop <span class="underline">{{ selectedText }}</span></span>
        </VTooltip>

    </VFlex>
</template>

<script lang="js">
    export default {
        name: 'DownloadActions',
        props: {
            selected: {
                type: Number,
                required: false,
                default: 0
            }
        },

        computed: {
            selectedText() {
                return this.selected || 'all';
            }
        },

        methods: {
            onAdd() {
                this.$emit('new-uri');
            },

            onPlay() {
                this.$emit(this.selected ? 'play-selected' : 'play-all');
            },

            onPause() {
                this.$emit(this.selected ? 'pause-selected' : 'pause-all');
            },

            onStop() {
                this.$emit(this.selected ? 'stop-selected' : 'stop-all');
            }
        }
    };
</script>
