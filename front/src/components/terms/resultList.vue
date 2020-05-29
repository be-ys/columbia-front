<script>

    import Loader from "../../mixins/loader";

    let _ = require('lodash');

    import resultItem from "./resultItem"
    import createTerm from "../editors/term/createTerm"

    export default {
        components: {
            Loader,
            resultItem,
            createTerm
        },

        props: ['search', 'nolag'],

        data() {
            return {
                results: [],
                show: false,
                couldCreateTerm: false,
                nbPerPage: 10,
                page: 0,
                bottom: false,
                loading: true,
            }
        },

        watch: {
            'search': 'onSearchChange',
            bottom(bottom) {
                if (bottom) {
                    this.nbPerPage = 20;
                    this.page = this.page + 1;
                    this.searching(false);
                }
            },
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
        },

        created() {
            window.addEventListener('scroll', () => {
                this.bottom = this.bottomVisible()
            });
            this.searching(true);
        },

        methods: {
            bottomVisible() {
                const scrollY = window.scrollY;
                const visible = document.documentElement.clientHeight;
                const pageHeight = document.documentElement.scrollHeight;
                const bottomOfPage = visible + scrollY >= pageHeight - 50;
                return bottomOfPage || pageHeight < visible
            },

            onSearchChange() {
                this.page = 0;
                this.nbPerPage = 10;
                this.results = [];
                if (this.$props.nolag) {
                    this.searching(true);
                    this.$emit('lag');
                } else {
                    this.loading = true;
                    this.onSearch();
                }
            },

            onSearch: _.debounce(function () {
                this.searching(true);
            }, 500),

            onSearchFinished: _.debounce(function () {
                this.loading = false;
            }, 100),

            searching: function (isFirstSearch) {
                let urlBuilder = process.env.VUE_APP_ROOT_API + "/terms/?size=" + this.nbPerPage + "&page=" + this.page + "&search=".concat(this.$props.search);
                urlBuilder = (!isFirstSearch) ? urlBuilder.concat("*") : urlBuilder;
                this.axios.get(urlBuilder)
                    .then(response => {
                            response.data.content.forEach(e => {
                                if(!this.results.map(v => v.id).includes(e.id)){
                                    this.results.push(e);
                                }
                            });
                    })
                    .finally(() => {
                        if (isFirstSearch && (this.results.length <= 0 || (this.results[0].name.toLowerCase() !== this.$props.search.toLowerCase()))) {
                            this.searching(false);
                            this.trackAndUpdateDisplay();
                        } else {
                            this.trackAndUpdateDisplay();
                        }
                        this.onSearchFinished();
                    });
            },

            trackAndUpdateDisplay: function () {
                if (this.$matomo) {
                    this.$matomo.setCustomUrl(process.env.VUE_APP_SELF_URL + "/?search=" + this.$props.search + "&search_count=" + this.results.length);
                    this.$matomo.trackPageView();
                }
            },

            update: function (args) {
                this.search = args;
                this.searching(true);
            },

            updateTerm: function() {
                this.page = 0;
                this.nbPerPage = 10;
                this.results = [];
                this.loading= true;
                this.searching(true);
            }
        }
    }
</script>

<template>
    <b-card class="result-dialog">
        <b-card-text class="results">
            <loader :loading="loading"/>
            <div v-if="!loading">
                <div v-if="results.length===0" class="text-center">
                    <p>{{$t("terms.resultList.unknownTermMessage")}} <span v-if="couldCreateTerm">{{$t("terms.resultList.unknownTermMessageModerator")}}</span></p>
                </div>

                <b-card no-body class="accordion" v-for="r in results" v-bind:key="r.id">
                    <resultItem :term="r" :nb="results.length" @update="updateTerm()"/>
                </b-card>

                <div v-if="user.grantedContexts.length >= 1 && !results.map(v => v.name.toLowerCase()).includes($props.search.toLowerCase())"
                     class="text-center createTerm-btn">
                    <b-button class="btn-success" @click="$refs.ct.display()">{{$t("terms.resultList.addTermButton")}}</b-button>
                </div>

                <createTerm ref="ct" :termName="search" @created="update($props.search)"/>
            </div>
        </b-card-text>
    </b-card>
</template>