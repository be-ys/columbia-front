<script>

    import randomTerm from "../terms/randomTerm";
    import resultList from "../terms/resultList";

    export default {
        components: {
            randomTerm,
            resultList
        }
        ,
        data() {
            return {
                search: "",
                nolag: false,
            }
        },

        computed: {
            storesearch() {
                return this.$store.state.search
            },
            searchroute() {
                return this.$route.params.se
            }
        },


        created() {
            this.search = this.$route.params.se ? this.$route.params.se : "";
        },


        watch: {
            'storesearch': 'updateSearch',
            'searchroute': 'updateSearchRoute',
        },

        methods: {
            updateSearchRoute: function () {
                if (!this.$store.state.noChange) {
                    if (this.searchroute) {
                        this.search = this.searchroute;
                        this.nolag = true;
                    }
                }
                if (!this.searchroute) {
                    this.search = "";
                }
            },

            updateSearch: function () {
                this.nolag = true;
                this.search = this.storesearch;
            }
        },
    }
</script>

<template>
    <div>
        <b-card class="no-border searchcard">
            <b-card-body class="card-body-search">
                <div class="search search-line">
                    <span class="fas fa-search"></span>
                    <input class="form-control" v-model="search" type="search" :placeholder="$t('search.search.search')">
                </div>
            </b-card-body>
        </b-card>
        <randomTerm v-if="search.length < 2"/>
        <resultList v-else :nolag="nolag" @lag="nolag=false" :search="search"/>
    </div>
</template>