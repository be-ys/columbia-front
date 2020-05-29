<script>
    import userLine from "./userLine"
    import createUserModal from "./modal/createUserModal"




    export default {


        components: {
            userLine,
            createUserModal
        },

        data() {
            return {
                users: []
            }
        },

        methods: {
            getUsers: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/users/?size=2000", {headers: { Authorization: localStorage.token}})
                    .then(response => {
                        this.users = response.data.content;
                    })
            },



            update() {
                this.getUsers();
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

        mounted() {
            this.getUsers();
        },
    }
</script>

<template>
    <div>
    <b-card v-if="user.connected && user.role===config.adminRole">
        <b-card-header class="sidebar-card-title resultHeader">
            <h3>{{$t('admin.users.users.title')}}</h3>
            <b-button type="button" v-on:click="$refs.cu.display()" variant="primary">{{$t('admin.users.users.addUserButton')}}</b-button>
        </b-card-header>

        <b-card-text style="margin-top: 30px;">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">{{$t('admin.users.users.table.username')}}</th>
                    <th scope="col">{{$t('admin.users.users.table.role')}}</th>
                    <th scope="col">{{$t('admin.users.users.table.domain')}}</th>
                    <th scope="col">{{$t('admin.users.users.table.options')}}</th>
                </tr>
                </thead>
                <tbody>
                <userLine v-for="obj in users" :user="obj" @update="update" v-bind:key="obj.id"/>
                </tbody>
            </table>

            <createUserModal @update="update" ref="cu"></createUserModal>
        </b-card-text>
    </b-card>
    <b-card v-else>
        {{$t('csvImporter.csvImporter.pleaseLogin')}}
    </b-card>
</div>
</template>