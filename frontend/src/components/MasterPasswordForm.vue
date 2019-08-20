<template>
    <form @submit.prevent="submit()">
        <VLayout align-center>
            <VTextField label="Password" type="password"
                        v-model="password" :error-messages="error"
                        :loading="isLoading" :disabled="isLoading"/>
            <VBtn type="submit" :disabled="!canSubmit || isLoading"
                  color="primary" class="ml-4">
                <VIcon left small>mdi-lock-open</VIcon> Unlock
            </VBtn>
        </VLayout>
    </form>
</template>

<script>
    export default {
        name: 'MasterPasswordForm',

        data: () => ({
            isLoading: false,
            password: null,
            error: null
        }),

        computed: {
            canSubmit() {
                return this.password?.length > 1;
            }
        },

        methods: {
            submit() {
                this.isLoading = true;

                this.$store.dispatch('auth/login', {
                    password: this.password,
                    cb: (err) => {
                        this.isLoading = false;
                        this.error = err !== undefined ? 'Wrong password' : null;
                    }
                })
            }
        }
    };
</script>
