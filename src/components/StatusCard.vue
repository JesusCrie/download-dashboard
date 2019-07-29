<template>
    <VCard flat outlined>
        <VLayout>

            <VFlex :style="inlineStyle" :class="iconContainerClasses" status-icon>
                <VIcon dark :class="iconClasses">
                    mdi-{{ icon }}
                </VIcon>
            </VFlex>

            <VFlex grow>
                <VCardText class="fill-height d-flex justify-start align-center">
                    <p class="mb-0">
                        <span :class="valueClasses">{{ value || '---' }}</span>
                        <span :class="titleClasses" class="grey--text text--darken-2 text-truncate"> {{ title }} </span>
                    </p>
                </VCardText>
            </VFlex>

        </VLayout>
    </VCard>
</template>

<script lang="js">
    export default {
        name: 'StatusCard',
        props: {
            title: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                required: false,
                default: 'information'
            },
            cssColor: {
                type: String,
                required: false,
                default: 'var(--v-info-base)'
            },
            cssClasses: {
                type: String,
                required: false,
                default: undefined
            }
        },

        computed: {
            isMd() {
                return this.$vuetify.breakpoint.mdAndUp;
            },

            inlineStyle() {
                // Only apply as a fallback
                return this.cssClasses ? {} : {backgroundColor: this.cssColor};
            },

            iconContainerClasses() {
                const classes = this.cssClasses ? this.cssClasses.split(' ') : [];
                if (this.isMd) {
                    classes.push('md');
                }

                return classes;
            },

            iconClasses() {
                return {
                    'display-1': this.$vuetify.breakpoint.smAndDown,
                    'display-3': this.$vuetify.breakpoint.mdAndUp
                };
            },

            valueClasses() {
                return {
                    'title': this.$vuetify.breakpoint.smAndDown,
                    'display-1': this.$vuetify.breakpoint.mdAndUp,
                    'mr-2': this.$vuetify.breakpoint.mdAndUp
                };
            },

            titleClasses() {
                return {
                    'subtitle-1': this.$vuetify.breakpoint.smAndDown,
                    'title': this.$vuetify.breakpoint.mdAndUp
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .status-icon {
        height: 10vmax;
        width: 10vmax;
        flex: 0 0 10vmax;

        &.md {
            height: 10vmin;
            width: 10vmin;
            flex-basis: 10vmin;
        }

        * {
            height: 100%;
            width: 100%;
        }
    }
</style>
