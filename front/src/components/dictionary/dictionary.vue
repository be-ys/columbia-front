
<script>
    import loader from "../../mixins/loader";
    import resultItem from "../terms/resultItem";

    export default {
        components: {
            loader,
            resultItem
        },

        data(){
            return {
                results:[],
                nbPerPage:20,
                page:0,
                loading:true,
                bottom:false,
                totalFound:0,
            }
        },

        computed: {
                contextName() {return this.$store.state.dictionary.context},
                contextLetter() {return this.$store.state.dictionary.letter},
        },


        watch: {
            'contextName':'onSearchChange',
            'contextLetter':'onSearchChange',
            bottom(bottom) {
                if (bottom) {
                    this.page=this.page+1;
                    this.loading=true;
                    this.searching();
                }
            }
        },

        created(){
            window.addEventListener('scroll', () => {
                this.bottom = this.bottomVisible()
            });

        },

        mounted(){
            this.onSearchChange();
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
                this.nbPerPage = 20;
                this.results = [];
                this.loading = true;
                this.searching();
            },

            createURL: function(){
                let letter = this.contextLetter==="@" ? "" : this.contextLetter;

                if(this.contextName===0 || this.contextName==='0'){
                    return "/terms/?size="+this.nbPerPage+"&page="+this.page+"&disableMetaphone=true&sort=name,ASC&search=".concat(encodeURI(letter)).concat('*')
                } else {
                    return "/contexts/"+this.contextName+"/terms/?size="+this.nbPerPage+"&page="+this.page+"&disableMetaphone=true&sort=name,ASC&search=".concat(encodeURI(letter)).concat('*')
                }
            },

            searching() {
                this.axios.get(process.env.VUE_APP_ROOT_API + this.createURL())
                    .then(response => {
                        response.data.content.forEach( e => {
                            if(!this.results.map(f => f.id).includes(e.id)){
                                this.results.push(e);
                            }});
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
        }


        }
</script>


<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t('dictionary.dictionary.title')}}</h3>
        </b-card-header>
        <b-card-text class="sidebar-card-body">
            <div>
                <div v-if="results.length===0 && !loading" class="text-center">
                    <p>{{$t('dictionary.dictionary.noTermFound')}}</p>
                </div>

                <b-card no-body class="accordion accordion-border" v-for="r in results" v-bind:key="r.id">
                    <resultItem :term="r" :nopropagate="true" :nb="totalFound"/>
                </b-card>
            </div>
            <loader :loading="loading"/>
        </b-card-text>
    </b-card>
</template>
