<script>
    import Loader from "../../mixins/loader";

    export default {
        components: {Loader},
        mounted() {
            if (this.$route.params.to.length <= 1) {
                this.$awn.alert(this.$t('account.activateAccount.toaster.invalidToken'));
                this.$router.push('/');
            }
            this.axios.put(process.env.VUE_APP_ROOT_API + "/accounts/activate/".concat(this.$route.params.to))
                .then(() => {
                    this.$awn.success(this.$t('account.activateAccount.toaster.activated'));
                })
                .catch(() => {
                    this.$awn.alert(this.$t('account.activateAccount.toaster.activateError'));
                })
                .finally(() => {
                    this.$router.push('/');
                });
        },
    }
</script>

<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t('account.activateAccount.loading')}}</h3>
        </b-card-header>
        <b-card-text class="sidebar-card-body">
            <loader :loading="true"/>
        </b-card-text>
    </b-card>
</template>