<script>

    export default {
        props: ['context'],

        data() {
            return {
                show: false
            }
        },

        methods: {

            display(){
                this.show=true;
            },

            deleteContext: function () {
                this.axios.delete(process.env.VUE_APP_ROOT_API + "/contexts/".concat(this.$props.context.id), {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t("admin.contexts.modal.remove.toaster.removed"));
                        this.$root.$emit('updateAll');
                        this.$emit('deleted');
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t("admin.contexts.modal.remove.toaster.removeError"));
                    })
            },

        },
    }
</script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t("admin.contexts.modal.remove.title", [context.name])}}</template>
        <br/>
        <p>{{$t("admin.contexts.modal.remove.content", [context.name])}}</p>
        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t("admin.contexts.modal.common.cancelButton")}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-danger" @click="deleteContext()">{{$t("admin.contexts.modal.remove.removeButton")}}</b-button>
        </div>
    </b-modal>
</template>