<script>
    export default {
        props: ['user'],

        data() {
            return {
                show: false
            }
        },

        methods: {

            display(){
                this.show=true;
            },

            deleteUser: function () {
                this.axios.delete(process.env.VUE_APP_ROOT_API + "/users/".concat(this.$props.user.id), {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t("admin.users.modal.remove.toaster.deleted"));
                        this.$root.$emit('updateAll');
                        this.$emit('deleted');
                        this.show=false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t("admin.users.modal.remove.toaster.deleteError"));
                    })
            },

        },
    }
</script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('admin.users.modal.remove.title', [user.username])}}</template>
        <br/>
        <p>{{$t('admin.users.modal.remove.content', [user.username])}}</p>
        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('admin.users.modal.common.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-danger" @click="deleteUser()">{{$t('admin.users.modal.remove.deleteButton')}}</b-button>
        </div>
    </b-modal>
</template>