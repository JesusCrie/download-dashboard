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

        <VLayout wrap>

            <div style="background-color: darkred; height: 100vh; width: 100%;"></div>

        </VLayout>
    </VContainer>
</template>

<script lang="js">
    export default {
        name: 'AriaBoard',

        computed: {
            responsivePadding() {
                return {
                    'pa-4': this.$vuetify.breakpoint.mdAndUp,
                    'pa-2': this.$vuetify.breakpoint.smAndDown
                };
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
