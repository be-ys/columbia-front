<script>
    import {contextParser} from '../../../mixins/contextParser'

    export default {
        mixins: [contextParser],

        mounted() {
            this.getContexts();
            this.selectedContext = this.$store.state.dictionary.context;
        },

        data() {
            return {
                contexts: [],
                selectedContext: 0,
            }
        },

        watch: {
            selectedContext() {
                this.$store.commit('updateDictionaryContext', this.selectedContext);
            }
        },

        methods: {
            getContexts: function() {
                this.axios.get(process.env.VUE_APP_ROOT_API+"/contexts/?size=2000")
                    .then(response => {
                        this.contexts = this.contextParser(response.data.content);
                    })
            },
        }
    }
</script>

<template>
    <b-card>
        <b-card-text class="sidebar-card-body">
            <b-form-select v-model="selectedContext" class="mb-3">
                <b-form-select-option value="0">{{$t("sidebar.dictionaryMode.contextSelector.all")}}</b-form-select-option>
                <b-form-select-option name="contextSelector" v-for="e in contexts" :value="e.id" v-bind:key="e.id">{{e.name}}</b-form-select-option>
            </b-form-select>
        </b-card-text>
    </b-card>
</template>