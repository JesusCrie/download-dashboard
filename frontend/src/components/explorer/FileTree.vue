<template>
    <VCard outlined class="pa-5">

        <VTreeview activatable return-object
                   :items="itemsAugmented" item-children="children" item-key="path" item-text="name"
                   :value="value" @input="$emit('input', $event)"
                   :open-on-click="true" :open-all="true"
                   hoverable :transition="true" selected-color="primary">

            <template v-slot:prepend="{ item, open }">
                <VIcon v-if="!item.file">mdi-{{ open ? 'folder-open' : 'folder' }}</VIcon>
                <VIcon v-else>mdi-{{ item.icon }}</VIcon>
                {{ item['icon'] }}
            </template>

        </VTreeview>

    </VCard>
</template>

<script>
    import mimeTypes from 'mime-types';

    const fileTypeLookupTable = [
        {category: 'document', test: /^text\/.+$/}, // text/*
        {category: 'image', test: /^image\/.+$/},   // image/*
        {category: 'video', test: /^video\/.+$/},   // video/*
        {category: 'audio', test: /^(?:audio\/.+)|(?:application\/ogg)$/}, // audio/* + application/ogg
        {category: 'pdf', test: /^application\/pdf$/}, // application/pdf
        {category: 'json', test: /^application\/json$/}, // application/json
        // application/zip + /gzip + /x-rar-compressed + /x-7z-compressed + /x-tar + /x-xz
        {category: 'archive', test: /^application\/(?:g?zip|x-(?:rar-compressed|7z-compressed|tar|xz))$/},
        {category: 'code-like', test: /^application\/.+$/} // application/*
    ];

    const filenameFallbackTable = [
        {category: 'config', test: /(?:^.+\.(?:conf|ini))$|(?:^\.(?:.+rc|env(?:\..+)?)$)/}
    ];

    export default {
        name: 'FileTree',

        props: {
            items: {
                type: Array,
                required: true
            },
            value: {
                type: Array,
                required: false
            }
        },

        model: {
            prop: 'value',
            event: 'input'
        },

        computed: {
            itemsAugmented() {
                return this.items.map(item => {
                    if (item.file) {
                        this.$set(item, 'icon', this.fileToIcon(item.name));
                        console.log(item);
                    }
                    return item;
                });
            }
        },

        methods: {
            fileToIcon(filename) {
                const mimeType = mimeTypes.lookup(filename) || '';

                // Try to make sense of the file
                let category = fileTypeLookupTable.find(({test}) => test.test(mimeType));
                if (!category) {
                    category = filenameFallbackTable.find(({test}) => test.test(filename));
                    console.log(category);
                }

                switch (category) {
                    case 'document':
                        return 'file-document';
                    case 'image':
                        return 'image';
                    case 'video':
                        return 'movie-open';
                    case 'audio':
                        return 'music';
                    case 'pdf':
                        return 'adobe-acrobat';
                    case 'json':
                        return 'json';
                    case 'archive':
                        return 'zip-box';
                    case 'code-like':
                        return 'code-tags';
                    case 'config':
                        return 'settings';
                    default:
                        return 'file';
                }
            }
        }
    };
</script>

<style scoped>

</style>
