<script>
    export default {
        props: ['term'],

        data() {
            return {
                show: false
            }
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        methods: {

            display() {
                this.show = true;
            },

            deleteTerm: function () {
                this.axios.delete(process.env.VUE_APP_ROOT_API + "/terms/".concat(this.$props.term.id), {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.show = false;
                        this.$awn.success(this.$t('editors.term.toaster.deleted'));
                        this.$root.$emit('update', 'terms', -1);
                        this.$emit('deleted');
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('editors.term.toaster.deleteError'));
                    })
            }
        },
    }
</script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('editors.term.deleteTitle', [term.name])}}</template>
        <br/>
        <p>{{$t('editors.term.deleteContent', [term.name])}}</p>
        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.term.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-danger" @click="deleteTerm()">{{$t('editors.term.deleteButton')}}</b-button>
        </div>
    </b-modal>
</template>