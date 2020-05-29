<script>
    export default {
        data() {
            return {
                history: [],
                error: false
            }
        },

        mounted() {
            this.axios.get(process.env.VUE_APP_ROOT_API + "/history/definitions")
                .then(response => {
                    response.data.forEach(elem => {
                        if (this.history.length < 4) {
                            let text = "Terme ";
                            text += (elem[2] === "ADD") ? this.$t("words.added").toLowerCase() :
                                (elem[2] === "MOD") ? this.$t("words.edited").toLowerCase() : this.$t("words.deleted").toLowerCase();

                            if (!this.history.map(e => e.id).includes(elem[0].context.id + elem[0].term.id)) {
                                this.history.push({
                                    "termName": elem[0].term.name,
                                    "contextName": elem[0].context.name,
                                    "text": text,
                                    "id": elem[0].context.id + elem[0].term.id
                                })
                            }
                        }
                    });
                })
                .catch(() => {
                    this.error = true;
                })
        },

        methods: {
            fillSearchField: function (str) {
                this.$router.push('/search/' + str.replace("/", ""));
            }
        }
    }
</script>

<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t("sidebar.searchMode.sidebarLastModifications.title")}}</h3>
        </b-card-header>
        <b-card-text class="sidebar-card-body">
            <div v-if="!error">
                <div v-if="history.length===0">
                    {{$t("sidebar.searchMode.sidebarLastModifications.noHistory")}}
                </div>
                <ul>
                    <li v-for="hist in history" :key="hist.id">
                        {{hist.text}} :
                        <b-link v-on:click="fillSearchField(hist.termName)" class="font-weight-bold">{{hist.termName}}</b-link>
                        {{$t("sidebar.searchMode.sidebarLastModifications.inContext")}} <i>{{hist.contextName}}</i>
                    </li>
                </ul>
                <div class="text-right">
                    <router-link to="/history">{{$t("sidebar.searchMode.sidebarLastModifications.readMore")}}</router-link>
                </div>
            </div>
            <div v-else class="text-center">
                {{$t("errors.onModuleLoad")}}
            </div>
        </b-card-text>
    </b-card>
</template>