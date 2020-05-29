<script>

    import definition from './definition';
    import createDefinition from "../editors/definition/createDefinition"
    import Loader from "../../mixins/loader";

    export default {

        components: {
            Loader,
            definition,
            createDefinition
        },

        props: ['termId', 'termName'],

        data() {
            return {
                definitions: [],
                loading: true,
                availableContexts: [],
            }
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        watch: {
            'termId': 'getTerm',
            'user.connected': 'updateUser',
        },

        mounted() {
            this.getTerm();
        },

        methods: {

            updateUser() {
                this.availableContexts = this.user.parsedGrantedContexts;

                this.definitions.map(def => def.id).forEach(def => {
                    for (let k = 0; k < this.availableContexts.length; k++) {
                        if (this.availableContexts[k].id === def) {
                            this.availableContexts.splice(k, 1);
                        }
                    }
                });
            },

            getTerm() {
                this.loading = true;
                //Requête.
                this.axios.get(process.env.VUE_APP_ROOT_API + "/terms/".concat(this.$props.termId))
                    .then(response => {
                        response.data.definitionList.forEach(def => {
                            //Parsing context name to get parents.
                            if (def.context.parentContext) {
                                let parentContextEvaluator = def.context.parentContext;
                                while (parentContextEvaluator) {
                                    def.context.name = parentContextEvaluator.name.concat(" > ").concat(def.context.name);
                                    parentContextEvaluator = parentContextEvaluator.parentContext;
                                }
                            }
                            def.definitionHtml = def.definition.replace(/\n/g, '<br />');
                            def.definition = def.definition.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
                        });
                        this.definitions = response.data.definitionList;
                        this.definitions.sort((a, b) => (a.context.name > b.context.name) ? 1 : ((b.context.name > a.context.name) ? -1 : 0));
                        this.updateUser();
                        this.loading = false;
                    })
            },

            definitionCreated: function () {
                this.getTerm();
            },

        },
    }
</script>

<template>
    <b-card>
        <b-card-text class="results defs">
            <loader :loading="loading"/>
            <p v-if="definitions.length===0 && !loading">{{$t("terms.definitionContent.noDefinition")}}</p>

            <definition v-for="def in definitions" v-bind:key="def.context.id" class="definitionContent"
                        @updated="getTerm" :avcontexts="availableContexts" :def="def"/>

            <b-button v-if="availableContexts.length>0" class="btn-info addTermButton" v-on:click="$refs.cd.display()">
                {{$t("terms.definitionContent.addDefinitionButton")}}
            </b-button>

            <createDefinition ref="cd" :termId="termId" :termName="termName" :contexts="availableContexts"
                              @created="definitionCreated"/>
        </b-card-text>
    </b-card>
</template>
