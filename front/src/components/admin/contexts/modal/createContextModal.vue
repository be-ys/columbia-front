<script>
    export default {
        props: ['contexts'],

        data() {
            return {
                isDisabled: true,
                show: false,
                form: {
                    parentContext: null,
                    name: "",
                    description: "",
                },
                availableContexts: [],
            }
        },

        computed:{
            maxLevel() { return this.$store.state.config.maxLevel;},
        },

        watch: {
          contexts(){this.updateAvailableContexts();}
        },

        mounted(){
            this.updateAvailableContexts();
        },

        methods: {
            updateAvailableContexts() {
                this.availableContexts = this.$props.contexts.filter(e => e.level < this.maxLevel-1);
                this.$forceUpdate();
            },

            display(){
                this.form = {
                    parentContext: null,
                    name: "",
                    description: "",
                };
                this.show=true;
            },

            updateContextName: function () {
                if(this.form.name.length <= 0){
                    this.isDisabled=true;
                } else {
                    //If name is the same AND parentContext is the same... We have to do black magic here because of some contexts does not have parentContext...
                    this.isDisabled = this.$props.contexts.filter(e =>
                        e.name === this.form.name &&
                        ((!e.parentContext && this.form.parentContext===null) || (e.parentContext && e.parentContext.id === this.form.parentContext))
                    ).length !==0;
                }
            },


            createContext: function () {
                if(this.form.parentContext!=null){
                    this.form.parentContext = { id : this.form.parentContext};
                }

                this.axios.post(process.env.VUE_APP_ROOT_API+ "/contexts/", this.form, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t("admin.contexts.modal.create.toaster.created"));
                        this.$root.$emit('update', 'contexts', 1);
                        this.$emit('created');
                        this.show=false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t("admin.contexts.modal.create.toaster.createError"));
                    })
            },

        },
    }
    </script>

<template>
    <b-modal id="bv-modal-example" hide-footer v-model="show">
        <template v-slot:modal-title>{{$t("admin.contexts.modal.create.title")}}</template>
        <br/>

        <b-form-group
                id="input-group-1"
                :label="$t('admin.contexts.modal.common.nameLabel')"
                label-for="input-1">
            <b-form-input
                    id="input-1"
                    class="form-control"
                    type="text"
                    ref="termName"
                    v-model="form.name"
                    v-bind:class="{'is-invalid': isDisabled}"
                    v-on:input="updateContextName"
            />
        </b-form-group>

        <p class="text-danger" v-if="isDisabled && form.name.length !== 0">{{$t('admin.contexts.modal.common.errorContextAlreadyExist')}}</p>

        <b-form-group
                id="input-group-2"
                :label="$t('admin.contexts.modal.common.parentContextLabel')"
                label-for="input-2">

            <b-form-select v-model="form.parentContext" class="mb-3" style="margin-bottom: 0 !important;" v-on:change="updateContextName()">
                <b-form-select-option :value="null">{{$t('admin.contexts.modal.common.defaultContextValue')}}</b-form-select-option>
                <b-form-select-option v-for="e in availableContexts" :value="e.id" v-bind:key="e.id">{{e.name}}</b-form-select-option>
            </b-form-select>
        </b-form-group>

        <b-form-textarea
                style="margin-top:25px;"
                id="textarea"
                v-model="form.description"
                :placeholder="$t('admin.contexts.modal.common.descriptionLabel')"
                rows="3"
                max-rows="6"
        ></b-form-textarea>

        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t("admin.contexts.modal.common.cancelButton")}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3 btn-success" @click="createContext()" :disabled="isDisabled">{{$t("admin.contexts.modal.create.createButton")}}</b-button>
        </div>
    </b-modal>
</template>