<template>
    <VContainer fluid :class="responsivePadding">
        <VLayout :class="responsivePadding">
            <VFlex>
                <p class="mb-4">
                    <span class="display-1 mr-2">File explorer</span>
                    <span class="title grey--text text--darken-2">Explore your files</span>
                </p>
                <VDivider/>
            </VFlex>
        </VLayout>

        <VLayout :class="responsivePadding" ele>
            <VFlex>

                <VFlex mb-3>
                    <VBtn depressed color="primary">
                        Delete
                    </VBtn>
                </VFlex>

                <FileTree :items="items" v-model="selection"/>
            </VFlex>
        </VLayout>
    </VContainer>
</template>

<script lang="js">
    import FileTree from '../components/explorer/FileTree';

    export default {
        name: 'FilesView',
        components: {FileTree},
        data: () => ({
            items: [
                {
                    name: 'etc',
                    path: '/etc',
                    children: [
                        {name: 'nginx', path: '/etc/nginx'},
                        {
                            name: 'default',
                            path: '/etc/default',
                            children: [{name: 'grub', path: '/etc/default/grub', file: true}]
                        }
                    ]
                },
                {
                    name: 'home',
                    path: '/home',
                    children: [
                        {
                            name: 'lucas',
                            path: '/home/lucas',
                            children: [{name: '.zshrc', path: '/home/lucas/.zshrc', file: true}]
                        },
                        {name: 'root', path: '/home/root'}
                    ]
                }
            ],

            selection: []
        }),

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
