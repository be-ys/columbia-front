<script>
    export default {
        props: ['def', 'avcontexts'],

        computed: {
            user() {
                return this.$store.state.user
            },
            config(){
                return this.$store.state.config
            }
        },

        data() {
            return {
                show: false,
                newContext: 0
            }
        },

        methods: {

            display() {
                this.show = true;
            },


            moveDefinition: function () {
                this.axios.post(process.env.VUE_APP_ROOT_API+"/contexts/".concat(this.newContext).concat("/terms"), this.$props.def, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.axios.delete(process.env.VUE_APP_ROOT_API+"/contexts/".concat(this.$props.def.context.id).concat("/terms/").concat(this.$props.def.term.id), {headers: {Authorization: localStorage.token}})
                            .then(() => {
                                this.show=false;
                                this.$awn.success(this.$t("editors.definition.move.toaster.moved"));
                                this.$emit('updated');
                            })
                            .catch(() => {
                                this.show=false;
                                this.$awn.warning(this.$t("editors.definition.move.toaster.removeError"));
                            })
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t("editors.definition.move.toaster.moveError"));
                    })
            },
        },
    }
</script>

<template>

    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('editors.definition.move.title')}}</template>

        {{$t('editors.definition.move.content', [def.term.name, def.context.name])}}

        <b-form-select v-model="newContext" class="mb-3" :label="$t('editors.definition.move.newContextLabel')">
            <b-form-select-option name="contextSelector" v-for="e in avcontexts" v-bind:key="e.id" :value="e.id">{{e.name}}</b-form-select-option>
        </b-form-select>

        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.definition.move.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-warning" @click="moveDefinition()">{{$t('editors.definition.move.moveButton')}}</b-button>
        </div>
    </b-modal>

</template>
