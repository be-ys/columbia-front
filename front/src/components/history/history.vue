<script>

    import historyEntry from "./historyEntry";
    export default {
        components :{
            historyEntry
        },

        data() {
            return {
                resultsId: [],
                results: [],
                page: 0,
                totalFound: 0,
                bottom: false,
            }
        },

        watch: {
            bottom: function () {
                if (this.bottom) {
                    this.continueSearching();
                }
            }
        },

        mounted() {
            this.searching();
        },


        created() {
            window.addEventListener('scroll', () => {
                this.bottom = this.bottomVisible();
            })
        },

        methods: {
            bottomVisible() {
                const scrollY = window.scrollY;
                const visible = document.documentElement.clientHeight;
                const pageHeight = document.documentElement.scrollHeight;
                const bottomOfPage = visible + scrollY >= pageHeight - 50;
                return bottomOfPage || pageHeight < visible
            },

            searching: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API+"/history/definitions?size=20&page=" + this.page)
                    .then(response => {
                        this.resultsid = [];
                        this.page = this.page + 1;
                        response.data.forEach(e => {
                            if (!this.resultsid.includes(e[0].context.id + ":" + e[0].term.id) && (e[2] === "MOD" || e[2] === "ADD")) {
                                this.resultsid.push(e[0].context.id + ":" + e[0].term.id);
                                e[0].definitionHtml = e[0].definition.replace(/\n/g, '<br />');
                                e[0].definition = e[0].definition.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
                                this.results.push(e);
                            }
                        });
                        this.totalFound = response.data.length + this.totalFound;
                    })
            },

            continueSearching: function () {
                if (this.totalFound % 20 === 0) {
                    this.searching();
                }
            }
        }
    }
</script>

<template>
    <div>
        <div v-for="(r, index) in results" v-bind:key="index">
            <historyEntry :r="r"></historyEntry>
        </div>
    </div>
</template>

