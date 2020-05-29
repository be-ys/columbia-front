<script>
    import {contextParser} from '../../../../mixins/contextParser'


    export default {

        mixins: [contextParser],

        props: ['user'],

        data() {
            return {
                fullUser: {
                    grantedContextsId: []
                },
                show:false,
                contexts: []
            }
        },

        computed: {
            config() {return this.$store.state.config;}
        },

        mounted() {
            this.getUser();
            this.getContexts();
        },

        methods: {

            display() {
                this.show=true;
            },

            getContexts: function() {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/contexts/?size=2000", {headers: {Authorization : localStorage.token}})
                    .then(response => {
                        this.contexts = this.contextParser(response.data.content);
                    })
            },

            getUser: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/users/".concat(this.$props.user.id), {headers: {Authorization: localStorage.token}})
                    .then(response => {
                        this.fullUser = response.data;
                        this.fullUser.grantedContextsId = response.data.grantedContexts.map(e => e.id);
                        this.fullUser.password= null;
                    })
            },

            updateUser: function () {
                //Parsing data before sending to server
                this.fullUser.isActiv = this.fullUser.activ;
                this.fullUser.username = null;

                if(this.fullUser.role !== this.config.moderatorRole){
                    this.fullUser.grantedContextsId = null;
                    this.fullUser.grantedContexts = null;
                } else {
                    this.fullUser.grantedContexts = this.fullUser.grantedContextsId.map(e => { return { "id" : e }});
                }

                this.axios.put(process.env.VUE_APP_ROOT_API + "/users/".concat(this.$props.user.id), this.fullUser, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t("admin.users.modal.edit.toaster.updated"));
                        this.$emit("updated");
                        this.show=false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t("admin.users.modal.edit.toaster.updateError"));
                    });
            },
        }
    }
</script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('admin.users.modal.edit.title')}}</template>

        <b-form-checkbox id="checkbox-1" v-model="fullUser.activ" name="checkbox-1">
            {{$t('admin.users.modal.common.activatedLabel')}}
        </b-form-checkbox>
        <br/>
        <b-form-group id="input-group-1" :label="$t('admin.users.modal.common.usernameLabel')" label-for="input-1">
            <b-form-input id="input-1" v-model="fullUser.username" type="text" required disabled/>
        </b-form-group>

        <br />
        <b-form-group id="input-group-2" :label="$t('admin.users.modal.common.emailLabel')" label-for="input-2" v-if="fullUser.domain==='local'">
            <b-form-input id="input-2" v-model="fullUser.email" type="email" required/>
            <br />
        </b-form-group>

        <b-form-group id="input-group-3" :label="$t('admin.users.modal.common.passwordLabel')" label-for="input-3" v-if="fullUser.domain==='local'">
            <b-form-input id="input-3" v-model="fullUser.password" type="password" required placeholder="*********"/>
            <br />
        </b-form-group>


        <b-form-group :label="$t('admin.users.modal.common.roleLabel')">
            <b-form-radio-group id="radio-group-2" v-model="fullUser.role" name="radio-sub-component">
                <b-form-radio :value="config.userRole">{{config.userRole}}</b-form-radio>
                <b-form-radio :value="config.moderatorRole">{{config.moderatorRole}}</b-form-radio>
                <b-form-radio :value="config.adminRole">{{config.adminRole}}</b-form-radio>
            </b-form-radio-group>
        </b-form-group>

        <b-form-select v-if="fullUser.role===config.moderatorRole" v-model="fullUser.grantedContextsId" multiple class="mb-6" :select-size="10">
            <b-form-select-option v-for="context in contexts" v-bind:key="context.id" :value="context.id" :selected="fullUser.grantedContextsId.includes(context.id)">
                <span v-for="i in context.level" v-bind:key="i" style="padding-left:15px;"></span> └ {{context.name}}
            </b-form-select-option>
        </b-form-select>
        <br />

        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('admin.users.modal.common.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-warning" @click="updateUser()">{{$t('admin.users.modal.edit.updateButton')}}</b-button>
        </div>
    </b-modal>
</template>