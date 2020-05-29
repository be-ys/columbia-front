<script>
    let _ = require('lodash');

    import tagsInput from "../tagsInput";

    export default {

        components: {
            tagsInput
        },

        props: ['term'],

        data() {
            return {
                editable: true,
                show: false,
                loading: false,
                termEdition: JSON.parse(JSON.stringify(this.$props.term)),
            }
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        mounted() {
            this.termEdition.abbreviations = this.termEdition.abbreviations.map(e => { return {text: e}});
        },

        watch: {
            'editable': 'updateForm',
        },

        methods: {
            display(){
                this.show=true;
            },


            updateTerm: function () {
                this.termEdition.abbreviations = this.termEdition.abbreviations.map(e => e.text);

                this.axios.put(process.env.VUE_APP_ROOT_API+"/terms/".concat(this.termEdition.id), this.termEdition, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.show=false;
                        this.$awn.success(this.$t('editors.term.toaster.updated'));
                        this.$emit('updated');
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('editors.term.toaster.updateError'));
                    })

            },


            update: function (args) {
                this.termEdition.abbreviations = args;
            },

            search: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API+"/terms/?search=".concat(this.termEdition.name))
                    .then(response => {
                        this.editable = (response.data.content.length <= 0 || response.data.content[0].id === this.termEdition.id);
                        this.loading=false;
                    })
            },

            deb: function () {
                this.loading=true;
                this.editable = false;
                this.debo();
            },

            debo: _.debounce(function () {
                this.search();
            }, 400),

        },
    }
</script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('editors.term.editTitle', [termEdition.name])}}</template>
        <b-input class="form-control" type="text" ref="termName" v-model="termEdition.name" v-bind:class="{'is-invalid': !editable}" v-on:input="deb"/>
        <p v-if="!editable && !loading" class="text-danger">{{$t('editors.term.alreadyInBase')}}</p>
        <br/>
        <tagsInput :displayText="$t('editors.term.abbreviations')" :tags="termEdition.abbreviations" :search="false" @update="update(...arguments)"></tagsInput>
        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.term.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-success" @click="updateTerm()" :disabled="!editable || loading">{{$t('editors.term.updateButton')}}</b-button>
        </div>
    </b-modal>
</template>