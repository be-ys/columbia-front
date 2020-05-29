<script>

    var fileDownload = require('js-file-download');

    export default {
        data() {
            return {
                email: '',
                password: '',
                editMail: false,
                editPassword: false,
            }
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
            config() {
                return this.$store.state.config;
            }
        },

        watch: {
            'user.connected': 'getUserInfos',
        },

        methods: {
            getUserInfos: function () {
                if (this.user.connected) {
                    this.axios.get(process.env.VUE_APP_ROOT_API + "/users/self", {headers: {Authorization: localStorage.token}})
                        .then(response => {
                            this.email = response.data.email;
                        })
                }
            },

            updateEmail: function () {
                let obj = { email: this.email };

                this.axios.put(process.env.VUE_APP_ROOT_API + "/users/".concat(this.user.id), obj, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t('account.profile.toaster.mailUpdated'));
                        this.editMail = false;
                        this.getUserInfos();
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('account.profile.toaster.mailError'));
                    })
            },

            updatePassword: function () {
                let obj = { password: this.password};

                this.axios.put(process.env.VUE_APP_ROOT_API + "/users/".concat(this.user.id), obj, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t('account.profile.toaster.passwordUpdated'));
                        this.editPassword = false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('account.profile.toaster.passwordError'));
                    })
            },

            downloadContext: function (id) {
                this.$awn.info(this.$t('account.profile.toaster.waitingDownload'));
                this.axios.get(process.env.VUE_APP_ROOT_API + "/contexts/".concat(id).concat("/export"), {
                    headers: {Authorization: localStorage.token},
                    responseType: 'blob'
                })
                    .then(response => {
                        fileDownload(response.data, 'export.xlsx', 'application/xlsx');
                        this.$awn.success(this.$t('account.profile.toaster.downloadSuccess'));
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('account.profile.toaster.downloadError'));
                    })
            }
        }
    }
</script>

<template>
    <div>
        <b-card>
            <b-card-header>
                <h4>{{$t('account.profile.title')}}</h4>
            </b-card-header>
            <b-card-body v-if="user.connected">
                <div class="border padding-15 border-radius bg-white mb-2 user user-medium flex-row" style="display: flex; align-items: center;">
                    <div>
                        <img :src="user.avatar" alt="avatar" class="rounded-circle" width="120" height="120">
                    </div>
                    <div style="padding-left:15px;">
                        <b>{{user.fullName}}</b><br/>{{user.role}}<br/>

                        <div v-if="user.domain!=='local'" style="padding: 0 10px; margin: 15px 0 0 0 ;">
                            <h5 style="padding: 5px;">
                                <span class="fas fa-info" style="padding-right:5px; font-size: 14px;"></span>
                                {{$t('account.profile.oauthInformation')}}
                            </h5>
                        </div>
                        <div v-else>
                            <span v-if="!editMail">
                                <b>{{$t('account.profile.emailLabel')}}</b> {{email}} <b-button class="fas fa-pencil-alt resultlist-btn" v-on:click.stop="editMail=true"/> <br/>
                            </span>
                            <span v-else style="display:ruby;">
                                <b>{{$t('account.profile.emailLabel')}}</b> <b-form-input v-model="email" type="email" placeholder="dev@local.host" style="max-width: 400px;"/>
                                <b-button class="fas fa-check resultlist-btn" style="padding-left:10px; color: green;" v-on:click.stop="updateEmail()"></b-button>
                                <b-button class="fas fa-times resultlist-btn" style="padding-left:10px; color: red;" v-on:click.stop="editMail=false"></b-button>
                            </span>
                            <span v-if="!editPassword">
                                <b>{{$t('account.profile.passwordLabel')}}</b> **********  <b-button class="fas fa-pencil-alt resultlist-btn" v-on:click.stop="editPassword=true"/>
                            </span>
                            <span v-else style="display:ruby;">
                                <b>{{$t('account.profile.passwordLabel')}}</b> <b-form-input v-model="password" :placeholder="$t('account.profile.passwordPlaceholder')" type="password" style="max-width: 400px;"/>
                                <b-button class="fas fa-check resultlist-btn" style="padding-left:10px; color: green;" v-on:click.stop="updatePassword()"></b-button>
                                <b-button class="fas fa-times resultlist-btn" style="padding-left:10px; color: red;" v-on:click.stop="editPassword=false"></b-button>
                            </span>
                        </div>
                    </div>
                </div>
            </b-card-body>
            <b-card-body v-else>
                {{$t('account.profile.notLoggedIn')}}
            </b-card-body>
        </b-card>
        <b-card v-if="user.connected && (user.role===config.adminRole || user.role===config.moderatorRole)" style="margin-top:25px;">
            <b-card-header>
                <h4>{{$t('account.profile.moderatorRightTitle')}}</h4>
            </b-card-header>
            <b-card-body>
                <ul>
                    <li v-for="e in user.parsedGrantedContexts" v-bind:key="e.id">{{e.name}}
                        <b-button class="fas fa-file-export resultlist-btn" v-on:click.stop="downloadContext(e.id)"/>
                    </li>
                </ul>
            </b-card-body>
        </b-card>
    </div>
</template>
