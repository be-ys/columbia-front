<script>

    export default {

        data() {
            return {
                pendingAction: false,
                error: false,
                oauth2servername : process.env.VUE_APP_OAUTH2_DOMAIN,
                form: {
                    username:null,
                    password:null,
                    domain: "local",
                    serviceName: process.env.VUE_APP_OAUTH2_CLIENT
                }
            }
        },

        computed: {
            isLoggedIn() {
                return this.$store.state.user.connected;
            },
            user() {
                return this.$store.state.user;
            },
            config(){
                return this.$store.state.config;
            },
            delegatedAuth(){
                return this.$store.state.config.delegatedAuth;
            }
        },

        watch: {
            delegatedAuth(){
                this.form.domain = this.config.delegatedAuth ? process.env.VUE_APP_OAUTH2_DOMAIN : 'local';
            },
        },

        methods: {
            sendLostPassword: function () {
                if (this.form.username.length >= 1) {
                    this.$awn.info(this.$t("navigation.topMenu.toaster.sendMail"));
                    this.axios.get(process.env.VUE_APP_ROOT_API + "/accounts/lostPassword/" + this.form.username)
                        .finally(() => {
                            this.$awn.success(this.$t("navigation.topMenu.toaster.mailSent"));
                        })
                }
            },

            login: function() {
                this.pendingAction = true;
                this.error = false;

                //Connexion sur l'API.
                this.axios.post(process.env.VUE_APP_LOGIN_ENDPOINT, this.form)
                    .then(response => {
                        let obj = response.data;
                        obj.token = response.headers.authorization;

                        this.axios.get(process.env.VUE_APP_ROOT_API+"/users/self", {headers: {Authorization: response.headers.authorization}})
                            .then(response2 => {
                                obj.role = response2.data.role;
                                obj.grantedContexts = response2.data.grantedContexts;
                                this.$store.commit('login', obj);
                                this.error = false;
                                this.$awn.success(this.$t("navigation.topMenu.toaster.connected", [response.data.fullName]));
                            })
                            .catch(() => {
                                this.error = true;
                            });
                    })
                    .catch(() => {
                        this.error = true;
                    })
                    .finally(() => {
                        this.pendingAction = false;
                        this.form.password = "";
                    });
            },

            logout: function () {
                this.$store.commit('logout');
                this.$awn.success(this.$t("navigation.topMenu.toaster.disconnected"));
            },
        }
    }
</script>


<template>
    <div class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
        <div class="logo logo-ux-white logo-small">
            <router-link class="nav-link nobg" to="/"></router-link>

        </div>
            <b-navbar-nav>
                <b-nav-item class="nav-item">
                    <router-link class="nav-link" to="/">{{$t("navigation.topMenu.searchMode")}}</router-link>
                </b-nav-item>
                <b-nav-item class="nav-item">
                    <router-link class="nav-link" to="/dictionary">{{$t("navigation.topMenu.dictionaryMode")}}</router-link>
                </b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown  v-if="user.connected && user.role===config.adminRole" :text="$t('navigation.topMenu.administration')" right>
                    <b-dropdown-item to="/admin/contexts" >{{$t("navigation.topMenu.contextManagement")}}</b-dropdown-item>
                    <b-dropdown-item to="/admin/users" >{{$t("navigation.topMenu.userManagement")}}</b-dropdown-item>
                </b-nav-item-dropdown>


                <b-nav-item class="nav-item" v-if="user.connected &&  (user.role===config.adminRole || user.role===config.moderatorRole)">
                    <router-link class="nav-link" to="/importCSV">{{$t("navigation.topMenu.importCSV")}}</router-link>
                </b-nav-item>

                <b-nav-item v-if="user.connected" class="nav-item user menu-user">
                    <router-link class="nav-link" style="line-height: 17px; padding:0" to="/user">
                        <div style="display: flex; flex-direction: row">
                            <div id="avatar"><img :src="user.avatar" alt="avatar" style="height:35px; border-radius: 50%"/></div>
                            <div style="min-width: 10px;"></div>
                            <div style="display: flex; flex-direction: column">
                                <div>{{ user.fullName }}</div>
                                <div><span class="roleInfo" style="font-size: 12px;font-style: italic;">{{ user.role.charAt(0).toUpperCase() +  user.role.slice(1).toLowerCase()}}</span></div>
                            </div>
                        </div>

                    </router-link>
                </b-nav-item>

                <b-nav-item v-if="user.connected" class="nav-item">
                    <a class="nav-link logout-button" style="padding:0;text-align: center;"  v-on:click="logout">
                        <i class="fas fa-power-off"></i>
                        <span class="d-none">{{$t("navigation.topMenu.logout")}}</span>
                    </a>
                </b-nav-item>

                <b-nav-item-dropdown right v-if="!isLoggedIn">
                    <template v-slot:button-content>
                        <span class="fas fa-sign-in-alt"></span> {{$t("navigation.topMenu.login")}}
                    </template>
                    <b-dropdown-form @submit.prevent="login">
                        <b-form-group label="" label-for="dropdown-form-login">
                            <b-form-input id="dropdown-form-login" size="sm" :placeholder="$t('navigation.topMenu.username')" v-model.trim="form.username"></b-form-input>
                        </b-form-group>
                        <b-form-group label="" label-for="dropdown-form-password">
                            <b-form-input id="dropdown-form-password" type="password" size="sm" :placeholder="$t('navigation.topMenu.password')" v-model.trim="form.password"></b-form-input>
                        </b-form-group>

                        <b-form-select id="domain" label="" v-model.trim="form.domain">
                            <b-form-select-option v-if="delegatedAuth" :value="oauth2servername">{{$t("navigation.topMenu.oauthLogin", [oauth2servername])}}</b-form-select-option>
                            <b-form-select-option :value="'local'">{{$t("navigation.topMenu.localLogin")}}</b-form-select-option>
                        </b-form-select>

                        <b-button id="loginbtn" variant="success" size="sm" type="submit">{{$t("navigation.topMenu.login")}}</b-button>
                    </b-dropdown-form>

                    <b-dropdown-divider v-if="config.openRegistration || form.domain==='local'"></b-dropdown-divider>

                    <router-link v-if="config.openRegistration" style="padding: unset;border: unset;" to="/register">
                        <b-dropdown-item-button type="button" class="centered text-center forgotpasswordlink btn-info">
                            {{$t("navigation.topMenu.createAccount")}}
                        </b-dropdown-item-button>
                    </router-link>

                    <b-button v-if="form.domain==='local'" class="centered text-center forgotpasswordlink btn-info" style="border:0;"  v-on:click.stop="sendLostPassword">
                        {{$t("navigation.topMenu.lostPassword")}}
                    </b-button>


                    <div v-if='pendingAction' class="notifications notification-primary login-info">
                        <p>{{$t("navigation.topMenu.loginAwait")}}</p>
                    </div>
                    <div v-if='error' class="notifications notification-error login-info">
                        <p>{{$t("navigation.topMenu.invalidLogin")}}</p>
                    </div>
                </b-nav-item-dropdown>
            </b-navbar-nav>
    </div></div>
</template>