<script>

    export default {

        data() {
            return {
                mail: ""
            }
        },

        methods: {
            redirectToNSRoute: function () {
                const expression = /\S+@\S+\.\S+/;
                if (expression.test(this.mail)) {
                    this.$store.commit('nsMail', this.mail);
                    this.mail = "";
                    this.$router.push('/newsletter/');
                } else {
                    this.$awn.alert(this.$t('sidebar.searchMode.sidebarNewsletterRegistration.invalidEmail'));
                }
            }
        }
    }
</script>

<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t('sidebar.searchMode.sidebarNewsletterRegistration.title')}}</h3>
        </b-card-header>
        <b-card-text class="sidebar-card-body">
            <b-form @submit.prevent="redirectToNSRoute()" class="input-group mb-3">
                <b-form-input v-model="mail" placeholder="john.doe@example.com"/>
                <b-button class="btn-ns" type="submit" variant="primary"><i class="fas fa-satellite"></i></b-button>
            </b-form>
            <i class="ns-undertext">{{$t('sidebar.searchMode.sidebarNewsletterRegistration.infoText')}}</i>
        </b-card-text>
    </b-card>
</template>