<script>

    import {contextParser} from '../../mixins/contextParser'
    import Loader from "../../mixins/loader";


    export default {
        mixins: [contextParser],

        components: {
            Loader
        },

        data() {
            return {
                mail: '',
                contexts: [],
                selected: [],
                loading: true,
            }
        },

        computed: {
            email() {
                return this.$store.state.nsmail;
            }
        },

        watch: {
            'email': 'initialization',
        },


        mounted() {
            this.initialization();
        },

        methods: {
            initialization: function () {
                if (this.$route.params.token) {
                    //Si le token existe, on le récupère, et on get depuis la bdd
                    this.axios.get(process.env.VUE_APP_ROOT_API + "/newsletters/".concat(this.$route.params.token))
                        .then(response => {
                            this.mail = response.data.email;
                            this.selected = response.data.subscribedContexts.map(e => e.id);
                        })
                        .catch(() => {
                            this.$awn.alert(this.$t("newsletter.newsletterRegistrator.toaster.InvalidToken"));
                            this.$router.push('/');
                        });
                } else {
                    //Sinon on récupère depuis le store
                    this.mail = this.$store.state.nsmail;
                    const expression = /\S+@\S+\.\S+/;
                    if (!expression.test(String(this.mail).toLowerCase())) {
                        this.$awn.alert(this.$t("newsletter.newsletterRegistrator.toaster.InvalidMail"));
                        this.$router.push('/');
                    }
                }

                //Récupération des contexts.
                this.axios.get(process.env.VUE_APP_ROOT_API + "/contexts/?size=2000")
                    .then(response => {
                        this.contexts = this.contextParser(response.data.content);
                    });
                this.loading = false;
            },

            deleteMail: function () {
                this.loading = true;
                this.$awn.info("Suppression en cours...");
                this.axios.delete(process.env.VUE_APP_ROOT_API + "/newsletters/".concat(this.$route.params.token))
                    .then(() => {
                        this.$awn.success(this.$t("newsletter.newsletterRegistrator.toaster.Unregistered"));
                        this.$router.push('/');
                    })
                    .catch(() => {
                        this.loading = false;
                        this.$awn.alert(this.$t("newsletter.newsletterRegistrator.toaster.UnregisterError"));
                    })
            },

            createMail: function () {
                this.$awn.info("Inscription en cours...");
                this.loading = true;

                //Recontruction.
                let obj = {
                    email: this.mail,
                    subscribedContexts: this.selected.map(e => {return {id: e}})
                };


                this.axios.post(process.env.VUE_APP_ROOT_API + "/newsletters", obj)
                    .then(() => {
                        this.$awn.success(this.$t("newsletter.newsletterRegistrator.toaster.Registered"));
                        this.$router.push('/');
                    })
                    .catch(() => {
                        this.loading = false;
                        this.$awn.alert(this.$t("newsletter.newsletterRegistrator.toaster.RegisterError"));
                    });
            },

            updateMail: function () {
                this.loading = true;

                //Recontruction.
                let obj = {
                    email: this.mail,
                    subscribedContexts: this.selected.map(e => {return {id: e}})
                };

                this.axios.put(process.env.VUE_APP_ROOT_API + "/newsletters/".concat(this.$route.params.token), obj)
                    .then(() => {
                        this.$awn.info(this.$t("newsletter.newsletterRegistrator.toaster.Updated"));
                        this.$router.push('/');
                    })
                    .catch(() => {
                        this.loading = false;
                        this.$awn.alert(this.$t("newsletter.newsletterRegistrator.toaster.UpdateError"));
                    });
            },
        },
    }
</script>

<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t('newsletter.newsletterRegistrator.title', [mail])}}</h3>
            <i style="color:#333;">{{$t('newsletter.newsletterRegistrator.subtitle')}}</i>
        </b-card-header>
        <b-card-text class="sidebar-card-body" v-if="!loading">
            <b-form-group>
                <b-form-checkbox v-for="context in contexts" v-model="selected" :key="context.id" :value="context.id">
                    <span v-for="i in (context.level)" v-bind:key="i" style="padding-left:15px;"></span>
                    └ {{context.name}}
                </b-form-checkbox>
            </b-form-group>

            <div style="float: right;">
                <b-button v-if="$route.params.token" v-on:click="deleteMail()" variant="danger"
                          style="margin-right: 15px;">{{$t('newsletter.newsletterRegistrator.unregisterButton')}}
                </b-button>
                <b-button v-if="$route.params.token" v-on:click="updateMail()" variant="info">{{$t('newsletter.newsletterRegistrator.updateButton')}}</b-button>
                <b-button v-if="!$route.params.token" v-on:click="createMail()" variant="success">{{$t('newsletter.newsletterRegistrator.registerButton')}}</b-button>
            </div>

            <div style="margin-top: 70px;text-align: center;font-style: italic; font-weight: bold">
                <b-link href='/legal#newsletter' v-html="$t('newsletter.newsletterRegistrator.checkLegalMentions')">
                </b-link>
            </div>
        </b-card-text>
        <loader :loading="loading"/>
    </b-card>
</template>