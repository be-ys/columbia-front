<script>
    import {contextParser} from '../../../mixins/contextParser'

    import contextLine from "./contextLine"
    import createContextModal from "./modal/createContextModal"

    export default {

        mixins: [contextParser],

        components: {
            contextLine,
            createContextModal
        },

        data() {
            return {
                contexts: []
            }
        },

        computed: {
            user() {
                return this.$store.state.user
            },
            config(){
                return this.$store.state.config;
            }
        },

        methods: {
            getContexts: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/contexts/?size=2000")
                    .then(response => {
                        this.contexts = this.contextParser(response.data.content);
                    })
            },

            update: function () {
                this.getContexts();
                this.axios.get(process.env.VUE_APP_ROOT_API + "/users/self", {headers: {Authorization: localStorage.token}})
                    .then(response => {
                        this.$store.commit('updateContexts', response.data.grantedContexts);
                    });
            }
        },

        mounted() {
            this.getContexts();
        },
    }
</script>

<template>
    <div>
    <b-card v-if="user.connected && user.role===config.adminRole">
        <b-card-header class="sidebar-card-title resultHeader">
            <h3>{{$t("admin.contexts.contexts.title")}}</h3>
            <b-button type="button" v-on:click="$refs.cc.display()" variant="primary">{{$t("admin.contexts.contexts.addContextButton")}}</b-button>
        </b-card-header>

        <b-card-text style="margin-top: 30px;">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">{{$t("admin.contexts.contexts.table.context")}}</th>
                    <th scope="col">{{$t("admin.contexts.contexts.table.options")}}</th>
                </tr>
                </thead>
                <tbody>
                <contextLine :context="obj" :contexts="contexts" @update="update" v-bind:key="obj.id" v-for="obj in contexts"/>
                </tbody>
            </table>

            <createContextModal :contexts="contexts" @created="update" ref="cc"></createContextModal>
        </b-card-text>
    </b-card>
        <b-card v-else>
            {{$t('csvImporter.csvImporter.pleaseLogin')}}
        </b-card>
    </div>
</template>