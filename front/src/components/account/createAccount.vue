<script>

    import Loader from "../../mixins/loader";


    export default {
        components: {
            Loader
        },

        data() {
            return {
                sending: false,
                form: {}
            }
        },

        computed: {
            connected() {
                return this.$store.state.user.connected;
            },
            openRegistration() {
                return this.$store.state.config.openRegistration;
            }
        },

        watch: {
            connected: function () {
                this.checkConnected();
            },
            openRegistration: function () {
                this.checkRegistration();
            }
        },

        methods: {

            checkRegistration() {
                if (!this.openRegistration) {
                    this.$awn.alert(this.$t('account.createAccount.closedRegistration'));
                    this.$router.push('/');
                }
            },

            checkConnected() {
                if (this.connected) {
                    this.$awn.alert(this.$t('account.createAccount.alreadyConnected'));
                    this.$router.push("/");
                }
            },

            register: function () {
                if (this.openRegistration) {
                    this.sending = true;

                    this.axios.post(process.env.VUE_APP_ROOT_API + "/users", this.form)
                        .then(() => {
                            this.$awn.success(this.$t('account.createAccount.registered'));
                            this.$router.push('/');
                        })
                        .catch(() => {
                            this.$awn.alert(this.$t('account.createAccount.registerError'));
                            this.sending = false;
                        })
                } else {
                    this.$awn.alert(this.$t('account.createAccount.closedRegistration'));
                }
            }
        },
    }
</script>

<template>
        <b-card>
            <b-card-header>
                <h4>{{$t('account.createAccount.title')}}</h4>
            </b-card-header>
            <b-card-body v-if="sending">
            <loader :loading="sending"></loader>
            </b-card-body>
            <b-card-body v-else>
                <b-form class="registerform" @submit.prevent="register">
                    <b-form-group
                            class="input-group mb-3"
                            id="input-username-label"
                            :label="$t('account.createAccount.usernameLabel')"
                            label-for="input-username"
                    >
                        <b-form-input
                                id="input-username"
                                v-model="form.username"
                                type="text"
                                required
                                placeholder="John Doe"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                            class="input-group mb-3"
                            id="input-mail-label"
                            :label="$t('account.createAccount.emailLabel')"
                            label-for="input-mail"
                    >
                        <b-form-input
                                id="input-mail"
                                v-model="form.email"
                                type="text"
                                required
                                placeholder="John.Doe@localhost.fr"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                            class="input-group mb-3"
                            id="input-password-label"
                            :label="$t('account.createAccount.passwordLabel')"
                            label-for="input-password"
                    >
                        <b-form-input
                                id="input-password"
                                v-model="form.password"
                                type="password"
                                required
                                placeholder="**********"
                        ></b-form-input>
                    </b-form-group>


                    <b-form-checkbox
                            id="checkbox-1"
                            name="checkbox-1"
                            required
                    >
                        <router-link to="/legal">{{$t('account.createAccount.cguLabel')}}</router-link>
                    </b-form-checkbox>

                    <div class="text-center" style="margin-top:15px;">
                        <b-button type="submit" variant="primary">{{$t('account.createAccount.registerButton')}}</b-button>
                    </div>
                </b-form>
            </b-card-body>
        </b-card>
</template>