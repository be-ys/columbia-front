<script>
    export default {
        props: ['def'],

        data() {
            return {
                show: false
            }
        },

        methods: {
            deleteDefinition: function () {
                this.axios.delete(process.env.VUE_APP_ROOT_API+"/contexts/".concat(this.def.context.id).concat("/terms/").concat(this.def.term.id), {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.show = false;
                        this.$awn.success(this.$t('editors.definition.remove.toaster.deleted'));
                        this.$root.$emit('update', 'definitions', -1);
                        this.$emit('deleted');
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('editors.definition.remove.toaster.deleteError'));
                    });
            },
            display() {
                this.show = true;
            },
        },
    }
    </script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('editors.definition.remove.title')}}</template>
        {{$t('editors.definition.remove.content', [def.term.name, def.context.name])}}
        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.definition.remove.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-danger" @click="deleteDefinition()">{{$t('editors.definition.remove.deleteButton')}}</b-button>
        </div>
    </b-modal>
</template>