<script>
    export default {
        data() {
            return {
                token: '',
                disabled: true,
                form: {
                    password: "",
                    passwordbis: ""
                }
            }
        },

        mounted() {
            if (this.$route.params.to.length <= 1) {
                this.$router.push('/');
            }
            this.token = this.$route.params.to;
        },

        computed: {
            isConnected() {
                return this.$store.state.user.connected;
            },
        },

        methods: {
            updatePassword: function () {
                this.$awn.info("Traitement en cours...");

                let obj = {password: this.form.password};

                this.axios.put(process.env.VUE_APP_ROOT_API + "/accounts/lostPassword/".concat(this.token), obj, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t('account.lostPassword.toaster.updated'));
                        this.$router.push('/');
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('account.lostPassword.toaster.updateError'));
                        this.$router.push('/');
                    })
            },

            checkPasswords: function () {
                this.disabled = this.form.password !== this.form.passwordbis || this.form.password.length === 0 || this.form.passwordbis.length === 0;
            }
        },
    }
</script>

<template>
    <b-card>
        <b-card-header>
            <h4>{{$t('account.lostPassword.title')}}</h4>
        </b-card-header>
        <b-card-body v-if="!isConnected">
            <p>{{$t('account.lostPassword.introduction', [token])}}</p>
            <b-form class="lostpwdform" inline @submit.prevent="updatePassword">
                <b-form-group class="input-group mb-3 lostpwdform">
                    <b-form-input
                            id="input-username" v-model="form.password" type="password" required
                            :placeholder="$t('account.lostPassword.passwordPlaceholder')" v-bind:class="{ 'is-invalid': disabled, 'is-valid': !disabled }"
                            v-on:input="checkPasswords"></b-form-input>
                    <b-form-input
                            id="input-username" v-model="form.passwordbis" type="password" required
                            :placeholder="$t('account.lostPassword.repeatPlaceholder')" v-bind:class="{ 'is-invalid': disabled, 'is-valid': !disabled }"
                            v-on:input="checkPasswords"></b-form-input>
                    <b-button type="submit" variant="primary">{{$t('account.lostPassword.updateButton')}}</b-button>
                </b-form-group>
            </b-form>
            <span v-if="disabled" class="text-danger">{{$t('account.lostPassword.passwordDiffers')}}</span>
            <span v-else class="text-success">{{$t('account.lostPassword.passwordOk')}}</span>
        </b-card-body>
        <b-card-body v-else>
            {{$t('account.lostPassword.alreadyConnected')}}
        </b-card-body>
    </b-card>
</template>