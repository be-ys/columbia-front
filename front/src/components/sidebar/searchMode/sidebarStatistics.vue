<script>
    export default {
        data() {
            return {
                stats: {},
                read: 0,
                multipleUsers: false,
                error: false,
            }
        },

        computed: {
            config() { return this.$store.state.config;}
        },

        mounted() {
            this.updateAll();

            this.$root.$on('updateAll', () => {
                this.updateAll();
            });
        },

        methods: {
            updateAll: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/stats")
                    .then(response => {
                        this.stats = response.data;
                        this.multipleUsers = this.stats.usersNumber > 1;
                        this.axios.get(process.env.VUE_APP_FRONT_BACKEND + "/matomoStats")
                            .then(response => {
                                this.read = response.data.nb_pageviews;
                            });
                    })
                    .catch(() => {
                        this.error = true;
                    });

            }
        }
    }
</script>


<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t('sidebar.searchMode.sidebarStatistics.title')}}</h3>
        </b-card-header>
        <b-card-text class="sidebar-card-body" v-if="!error">
            <ul>
                <li v-html="$t('sidebar.searchMode.sidebarStatistics.contentStat', [stats.definitionsNumber, stats.contextsNumber, stats.termsNumber])"/>
                <li v-html="$tc('sidebar.searchMode.sidebarStatistics.userStat', stats.usersNumber)"/>
                <li v-html="$tc('sidebar.searchMode.sidebarStatistics.definitionStat', read)"/>
            </ul>
        </b-card-text>
        <b-card-text v-else class="text-center">
            {{$t("errors.onModuleLoad")}}
        </b-card-text>
    </b-card>
</template>