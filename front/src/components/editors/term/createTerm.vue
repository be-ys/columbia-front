<script>

    import tagsInput from "../tagsInput";

    export default {

        components: {
            tagsInput
        },

        props: ['termName'],

        data() {
            return {
                tagsAbbreviation: [],
                show: false
            }
        },

        methods: {

            display() {
                this.show = true;
            },

            createTerm: function () {
                let objectToSend = {
                    name: this.$props.termName,
                    abbreviations: [],
                };
                this.tagsAbbreviation.forEach(e => objectToSend.abbreviations.push(e.text));

                this.axios.post(process.env.VUE_APP_ROOT_API + "/terms", objectToSend, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t('editors.term.toaster.created'));
                        this.$root.$emit('update', 'terms', 1);
                        this.$emit('created');
                        this.show = false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('editors.term.toaster.createError'));
                    })
            },

            update: function (arg) {
                this.tagsAbbreviation = arg;
            }
        },
    }
</script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('editors.term.createTitle', [termName])}}</template>
        <input class="form-control" type="text" disabled :value="termName"/>
        <br/>
        <tagsInput :displayText="$t('editors.term.abbreviations')" :search="false" @update="update(...arguments)"></tagsInput>
        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.term.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-success" @click="createTerm()">{{$t('editors.term.createButton')}}</b-button>
        </div>
    </b-modal>
</template>