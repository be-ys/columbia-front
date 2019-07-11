const History = Vue.component('history', {

    data() {
        return {
            resultsId: [],
            results: [],
            page:0,
            totalFound:0,
            bottom: false,
        }
    },

    watch: {
        bottom: function() {
            if(this.bottom) {
                this.continueSearching();
            }
        }
    },

    mounted(){
      this.searching();
    },


    created(){
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

        searching: function() {
            //On regarde en premier si on ne trouve pas le mot directement, sinon on fait une recherche wildcard.
            axios.get("/api/history/definitions?size=20&page="+this.page)
                .then(response => {
                    this.resultsid = [];
                    this.page = this.page + 1;
                    response.data.forEach(e => {
                        if(!this.resultsid.includes(e[0].context.id+":"+e[0].term.id) && (e[2]==="MOD" || e[2]==="ADD")) {
                            this.resultsid.push(e[0].context.id + ":" + e[0].term.id);
                            this.results.push(e);
                        }
                    });
                    this.totalFound = response.data.length + this.totalFound;
                })
        },

        continueSearching: function(){
            if(this.totalFound%20===0){
                this.searching();
            }
        }
    },

    template: `
      <div>
        <div v-for="r in results">
            <historyDetail :r="r"></historyDetail>
        </div>
      </div>`
});

Vue.component("historyDetail", {
    props: ['r'],

    data() {
        return {
            userContexts: [],
            editModal: false,
            date: new Date(),
        }
    },

    mounted() {
        if(this.user.connected) {
            this.updatedUser();
        }
        this.date = new Date(this.r[1].timestamp);
    },

    methods: {
        updatedDef: function() {
            this.editModal=false;
            axios.get("/api/contexts/"+this.r[0].context.id+"/terms/"+this.r[0].term.id)
                .then(response => {
                    this.r[0].definition=response.data.definition;
                })
        },

        updatedUser: function() {
            this.userContexts = [];
            if(this.user.connected){
                this.user.grantedContexts.forEach( e => {
                    this.userContexts.push(e.id);
                });
            }
        },
    },

    computed: {
        user() {return this.$store.state.user},
    },

    watch: {
      'user.connected' : 'updatedUser',
    },

    template: `
    <div class="card" style="margin-bottom: 20px;">
              <div class="card-header history-header">
                <div class="card-actions card-icons">
                  <ul>
                    <li v-if="userContexts.includes(r[0].context.id)"><a v-on:click.stop="editModal=true"><i class="fas fa-edit"></i></a></li>
                  </ul>
                </div>
                <div><h4 class="semibold card-title">Définition <span v-if="r[2]=='MOD'">modifiée</span> <span v-if="r[2]=='ADD'">ajoutée</span> le {{date.getDay()+1}}/{{date.getMonth()+1}}/{{date.getFullYear()}}: {{r[0].term.name}}</h4>
                <sub style="font-size: 14px;">Contexte : {{r[0].context.name}}</sub></div>
              </div>
              <div class="card-body">
                {{r[0].definition}}
                <editDefinitionModal v-if="editModal" :def="r[0]" @canceled="editModal=false" @updated="updatedDef"></editDefinitionModal>
              </div>
            </div>`
});