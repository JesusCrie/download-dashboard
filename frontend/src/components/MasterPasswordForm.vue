<template>
    <form @submit.prevent="submit()">
        <VLayout align-center>
            <VTextField label="Password" type="password"
                        v-model="password"
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
            password: null
        }),

        computed: {
            canSubmit() {
                return this.password?.length > 1;
            }
        },

        methods: {
            submit() {
                this.isLoading = true;

                setTimeout(() => {
                    this.isLoading = false;
                }, 2000);
            }
        }
    };
</script>
