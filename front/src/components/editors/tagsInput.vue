<script>

    import VueTagsInput from '@johmun/vue-tags-input';

    export default {

        components: {
            VueTagsInput,
        },

        props: ['tags', 'displayText', 'search'],

        data() {
            return {
                tag: '',
                autocompleteItems: [],
            }
        },

        watch: {
            'tag': 'searchTags',
            'tags': 'cleanup',
        },

        methods: {
            cleanup: function () {
                this.tag = "";
            },

            searchTags: function () {
                this.autocompleteItems = [];
                if (this.$props.search && this.tag.length > 2) {
                    this.axios.get(process.env.VUE_APP_ROOT_API+"/terms/?search=".concat(this.tag).concat("*"))
                        .then(response => {
                            this.autocompleteItems = response.data.content.map( e => { return {text: e.name} });
                        })
                }
            },

            updates: function (newTags) {
                this.$emit('update', newTags);
            }
        },
    }
</script>

<template>
    <div class="terminput">
        <div class="input-group-prepend">
            <span class="input-group-text" style="width:170px;">{{displayText}}</span>
        </div>
        <vue-tags-input class="vue-tags-input light ti-focus" style="max-width: 100% !important; width:100% !important;" v-model="tag" placeholder="Ajouter..."
                        :tags="tags" :autocomplete-items="autocompleteItems" :add-only-from-autocomplete="false"
                        @tags-changed="updates"/>
    </div>
</template>