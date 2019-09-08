<template>
    <VForm ref="form" :key="1" @submit.prevent="submit()">
        <VCard>

            <VCardTitle>Add new URI</VCardTitle>

            <VContainer grid-list-lg>
                <VLayout wrap class="mx-1">

                    <!-- URI -->
                    <VFlex xs12>
                        <VTextField prepend-icon="mdi-web"
                                    required
                                    v-model="uri"
                                    :error-messages="uriErrors"
                                    @input="$v.uri.$touch()"
                                    @blur="$v.uri.$touch()">
                            <template v-slot:label>
                                URI*
                            </template>
                        </VTextField>
                    </VFlex>

                    <!-- Destination folder -->
                    <VFlex xs12>
                        <VTextField prepend-icon="mdi-folder"
                                    v-model="destination"
                                    :error-messages="destinationErrors"
                                    @input="$v.destination.$touch()"
                                    @blur="$v.destination.$touch()">
                            <template v-slot:label>
                                Destination
                            </template>
                        </VTextField>
                    </VFlex>

                    <!-- Filename -->
                    <VFlex xs12>
                        <VTextField prepend-icon="mdi-file"
                                    v-model="filename"
                                    :error-messages="filenameErrors"
                                    @input="$v.filename.$touch()"
                                    @blur="$v.filename.$touch()">
                            <template v-slot:label>
                                Filename
                            </template>
                        </VTextField>
                    </VFlex>

                    <!-- Max connections -->
                    <VFlex xs12 md4>
                        <VTextField prepend-icon="mdi-link-variant"
                                    type="number"
                                    v-model="maxConnections"
                                    :error-messages="maxConnectionsErrors"
                                    @input="$v.maxConnections.$touch()"
                                    @blur="$v.maxConnections.$touch()">
                            <template v-slot:label>
                                Max connections
                            </template>
                        </VTextField>
                    </VFlex>

                    <!-- Max retries -->
                    <VFlex xs6 md4>
                        <VTextField prepend-icon="mdi-loop"
                                    type="number"
                                    v-model="maxRetries"
                                    :error-messages="maxRetriesErrors"
                                    @input="$v.maxRetries.$touch()"
                                    @blur="$v.maxRetries.$touch()">
                            <template v-slot:label>
                                Max retries
                            </template>
                        </VTextField>
                    </VFlex>

                    <!-- Max speed -->
                    <VFlex xs6 md4>
                        <VTextField prepend-icon="mdi-speedometer"
                                    v-model="maxSpeed"
                                    :error-messages="maxSpeedErrors"
                                    @input="$v.maxSpeed.$touch()"
                                    @blur="$v.maxSpeed.$touch()">
                            <template v-slot:label>
                                Max speed
                            </template>
                        </VTextField>
                    </VFlex>

                    <VFlex xs12>
                        <span class="caption">* required field</span>
                    </VFlex>

                </VLayout>
            </VContainer>

            <VCardActions>
                <VSpacer/>
                <VBtn text color="error"
                      :disabled="isSending"
                      @click="onCancel">
                    Cancel
                </VBtn>

                <VBtn text color="primary"
                      type="submit"
                      :loading="isSending"
                      :disabled="isInvalid">
                    Start
                </VBtn>
            </VCardActions>

        </VCard>
    </VForm>
</template>

<script lang="js">
    import { validationMixin } from 'vuelidate';
    import { integer, minValue, required, url } from 'vuelidate/lib/validators';
    import { bytes, filename, path } from '../../plugins/vuelidate-custom-validators.js';
    import { newRequest } from '../../repositories/ariaRepository';

    export default {
        name: 'NewDownloadFormCard',
        mixins: [validationMixin],

        data: () => ({
            uri: null,
            destination: null,
            filename: null,
            maxConnections: null,
            maxRetries: null,
            maxSpeed: null,

            isSending: false
        }),

        validations: {
            uri: {required, url},
            destination: {path}, // TODO: validate path with backend
            filename: {filename},
            maxConnections: {integer, minValue: minValue(0)},
            maxRetries: {integer, minValue: minValue(0)},
            maxSpeed: {bytes}
        },

        computed: {
            isInvalid() {
                return this.$v.$invalid;
            },

            uriErrors() {
                return this.errorsShorthand(this.$v.uri, [
                    {prop: 'required', error: 'URI is required'},
                    {prop: 'url', error: 'Must be an URL'}
                ]);
            },

            destinationErrors() {
                return this.errorsShorthand(this.$v.destination, [
                    {prop: 'path', error: 'Must be an alphanumerical path'}
                ]);
            },

            filenameErrors() {
                return this.errorsShorthand(this.$v.filename, [
                    {prop: 'filename', error: 'Must be an alphanumerical filename'}
                ]);
            },

            maxConnectionsErrors() {
                const error = 'Must be a positive integer';
                return this.errorsShorthand(this.$v.maxConnections, [
                    {prop: 'integer', error},
                    {prop: 'minValue', error}
                ]);
            },

            maxRetriesErrors() {
                const error = 'Must be a positive integer';
                return this.errorsShorthand(this.$v.maxRetries, [
                    {prop: 'integer', error},
                    {prop: 'minValue', error}
                ]);
            },

            maxSpeedErrors() {
                return this.errorsShorthand(this.$v.maxSpeed, [
                    {prop: 'bytes', error: 'Must be a positive byte amount (eg. 128, 100K, 1M)'}
                ]);
            }
        },

        methods: {
            submit() {
                this.isSending = true;

                const opts = {
                    dir: this.destination || undefined,
                    out: this.filename || undefined,
                    maxConnectionsPerServer: this.maxConnections || undefined,
                    maxTries: this.maxRetries || undefined,
                    maxSpeed: this.maxSpeed || undefined
                };

                newRequest({uris: this.uri, options: opts}).then(() => {
                    this.$toast('Download queued !');
                }, err => {
                    this.$toast(`An error occurred: ${err.message || err}`);
                }).finally(() => {
                    this.isSending = false;
                    this.$emit('close');
                });
            },

            onCancel() {
                this.$emit('close');
                this.reset();
            },

            errorsShorthand(prop, errorsDef) {
                const errors = [];
                if (!prop.$dirty) return errors;

                errorsDef.forEach(item => {
                    !prop[item.prop] && errors.push(item.error);
                });

                return errors;
            },

            reset() {
                this.$refs.form.reset();
                this.$v.$reset();
            }
        }
    };
</script>
