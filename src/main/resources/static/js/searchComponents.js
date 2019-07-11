const Search = Vue.component('search', {
  data(){
    return {
      search:"",
      nolag:false,
    }
  },

  mounted(){
    if(this.$route.params.se){
      this.search=this.$route.params.se;
      this.nolag=true;
    }
  },

  computed: {
    storesearch() { return this.$store.state.search},
    searchroute() { return this.$route.params.se},
  },

  watch:{
    'storesearch': 'updateSearch',
    'searchroute': 'updateSearchRoute',
  },

  methods: {
    updateSearchRoute: function(){
      if(!this.$store.state.noChange){
        if(this.searchroute) {
          this.search = this.searchroute;
          this.$refs.searchField.value = this.searchroute;
          this.nolag = true;
        }
      }
      if(!this.searchroute){
          this.search="";
          this.$refs.searchField.value="";
      }
      this.$store.commit('toggleNoChange', false);
    },

    updateSearch: function(){
      this.nolag=true;
      this.search=this.storesearch;
      this.$refs.searchField.value=this.storesearch;
    },
  },

  template: `
  <div>
    <div class="card no-border">   
      <div class="card-body" style="padding: 0 0 30px 0;">
        <div class="search search-line">
          <input class="form-control" style="width: 100%;height: 50px;font-size: 18px;" v-model="search" type="search" ref="searchField" aria-label="Rechercher dans le glossaire" placeholder="Rechercher...">
        </div>
      </div>
    </div>
    <resultlist v-show="search.length !== 0" :nolag="nolag" @lag="nolag=false" :search="search"></resultlist>
    <randomTerm v-show="search.length == 0"></randomTerm>
  </div>`
});

Vue.component('randomTerm', {
  data(){
    return {
      id:0,
      name:"",
      abbrs: "",
    }
  },

  mounted(){
    axios.get("/api/terms/?search=random")
        .then(response => {
          this.id = response.data.id;
          this.name = response.data.name;

          if(response.data.abbreviations.length>0){
            this.abbrs="(";
            response.data.abbreviations.forEach(e => this.abbrs = this.abbrs.concat(e).concat(" ,"));
            this.abbrs = this.abbrs.substring(0, this.abbrs.length-2);
            this.abbrs=this.abbrs.concat(")");
          }

        })
  },

  template: `
    <div class="card card-bordered">
      <div class="card-header">
        <h3 class="card-title">{{name}} {{abbrs}}</span>
          <span data-toggle="tooltip" data-placement="right" title="En attendant votre recherche, nous avons magiquement (et un peu au hasard) trouvé ce mot." class="fas fa-magic" style="padding-left:5px; font-size: 14px;"></span>
        </h3>
      </div>
      
      <div class="card-body results">
        <definitionContent v-if="id!=0" :termId="id" :termName="name"></definitionContent>
      </div>
    </div>`
});

Vue.component('resultlist', {
  props:['search', 'nolag'],

  data(){
    return {
      results:[],
      show:false,
      couldCreateTerm:false,
      createTerm:false,
      nbPerPage:10,
      page:0,
      loading:true,
      bottom:false,
      totalFound:0,
    }
  },

  watch: {
    'search':'onSearchChange',
    'user.connected':'updateCreateTermButton',
    bottom(bottom) {
      if (bottom && this.results.length<=this.totalFound) {
        this.nbPerPage=20;
        this.page=this.page+1;
        this.continueSearching();
      }
    }
  },

  computed: {
    user() {return this.$store.state.user},
  },

  created(){
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
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

    onSearchChange(){
      this.page=0;
      this.nbPerPage=20;
      this.results=[];
      this.resultsid=[];
      this.loading=true;
      if(this.$props.nolag){
        this.searching();
        this.$emit('lag');
      } else {
        this.deb();
      }
    },

    deb: _.debounce(function() { this.searching(); }, 600),


    searching: function(){
      //On regarde en premier si on ne trouve pas le mot directement, sinon on fait une recherche wildcard.
      axios.get("/api/terms/?size="+this.nbPerPage+"&page="+this.page+"&search=".concat(this.$props.search))
          .then(response => {
            this.resultsid=[];
            response.data.content.forEach(e => {
              this.resultsid.push(e.id);
              this.results.push(e);
            });
            this.totalFound=response.data.totalElements+1;

          })
          .finally(f => {

            if(this.results.length<=0 || (this.results.length===1 && this.results[0].name.toLowerCase()!==this.$props.search.toLowerCase())){
              axios.get("/api/terms/?size="+this.nbPerPage+"&page="+this.page+"&search=".concat(this.$props.search).concat('*'))
                  .then(response => {
                    let rem=0;
                    response.data.content.forEach(e => {
                      if(!this.resultsid.includes(e.id)) {
                        this.resultsid.push(e.id);
                        this.results.push(e)
                      } else {
                        rem+=1;
                      }
                    });
                    this.totalFound+=response.data.totalElements-rem;
                  })
                  .finally(f => {
                    this.trackAndUpdateDisplay();

                  });
            } else {
              this.totalFound=this.totalFound-1;
              this.trackAndUpdateDisplay();
            }
            this.loading=false;
          });

    },

    continueSearching: function(){
      //On regarde en premier si on ne trouve pas le mot directement, sinon on fait une recherche wildcard.
      if(this.totalFound>this.results.length) {
        axios.get("/api/terms/?size=" + this.nbPerPage + "&page=" + this.page + "&search=".concat(this.$props.search).concat('*'))
            .then(response => {
              response.data.content.forEach(e => {
                if (!this.results.includes(e)) {
                  this.resultsid.push(e.id);
                  this.results.push(e)
                }
              }).finally(e => {
                this.trackAndUpdateDisplay();
              });
            })
      }
    },

    trackAndUpdateDisplay: function(){
      this.updateCreateTermButton();
      if (this.results.length === 1) {
        $("#term_" + this.results[0].id).popover('hide').collapse("show");
        if(this.$matomo) {
          this.$matomo.setCustomUrl(FRONT_URL + "/?search=" + this.$props.search + "&search_count=" + this.totalFound);
          this.$matomo.trackPageView();
        }
      } else {
        $('*').popover('hide');

        if(this.results.length<=20) {
          $('*').popover('hide').collapse('hide');

          if(this.$matomo) {
            this.$matomo.setCustomUrl(FRONT_URL + "/?search=" + this.$props.search + "&search_count=" + this.totalFound);
            this.$matomo.trackPageView();
          }
        }
      }
    },

    updateCreateTermButton: function() {
      if(this.user.grantedContexts.length>=1) {
        this.couldCreateTerm = true;
        this.results.forEach(e => {
          if(e.name.toLowerCase() === this.$props.search.toLowerCase()) {
            this.couldCreateTerm = false;
          }
        });
      } else {
        this.couldCreateTerm = false;
      }
    },

    termCreated: function(){
      this.searching();
      this.createTerm=false;
    },

    termCanceled: function(){
      this.createTerm=false;
    },

    update: function(args){
      this.search=args;
      this.searching();
    }

  },

  template: `
    <div class="card card-bordered">
      <div class="card-body results">
        <div v-if="loading"><div class="spinkit spinkit-primary spinkit-large centered">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
            </div></div>
        <div :class="{'invisible': loading}">
        <div v-if="results.length==0" class="text-center">
          <p>Désolé, ce terme est inconnu <span v-if="couldCreateTerm">... pour le moment ?</span></p>
        </div>
        <div class="accordion accordion-border"  id="accordion" role="tablist" aria-multiselectable="true">
          <div v-for="r in results" class="card">
            <resultItem :term="r" :nb="totalFound" @update="update(... arguments)"></resultItem>
          </div>
        </div>
        <div class="text-center">
          <button v-if="couldCreateTerm" class="btn btn-success" @click="createTerm=true;" style="margin-top:10px;">Ajouter un terme</button>
        </div>
        <createTerm v-if="createTerm" :termName="search" @created="termCreated" @canceled="termCanceled"></createTerm>
      </div>
      </div>
    </div>`
});

Vue.component('resultItem', {

  props:['term', 'nb'],

  data(){
    return {
      show:false,
      editModal:false,
      deleteModal:false,
    }
  },

  computed: {
    user() {return this.$store.state.user},
  },

  watch: {
    'nb':'updateChange',
  },

  mounted(){
    this.updateChange();
  },


  methods:{
    updateChange() {
      if(this.$props.nb<=1){
        this.$store.commit('toggleNoChange', true);
        this.$router.push('/search/'+this.term.name.replace("/", ""));
        this.show=true;
        this.$store.commit('toggleNoChange', false);
      }
    },

    updateAccordion() {
      $('*').popover('hide').collapse('hide');
      this.show=true;
      this.$store.commit('toggleNoChange', true);
      this.$router.push('/search/'+this.term.name.replace("/", ""));
    },


    update(text){
      this.$emit('update', text);
      this.editModal=false;
      this.deleteModal=false;
    }
  },

  template: `
    <div>
      <div class="card-header" role="tab">
        <h5 class="card-result">
          <a v-on:click="updateAccordion()" class="collapsed" :id="'head_'+term.id" :href="'#term_'+term.id" data-toggle="collapse" data-parent="#accordion" aria-expanded="false">
            {{term.name}} 
            <span v-if="term.abbreviations.length!==0"> 
              ( <span v-for="(a, index) in term.abbreviations">{{a}}<span v-if="(index+1)!==term.abbreviations.length"> , </span></span> )
            </span>
            <i class="icons icon-chevron_up size-16 color-primary"></i>
            <a style="display: inline;border: none;" v-if="user.role=='Admin'" v-on:click.stop="editModal=true" class="reset fas fa-pen editbuttons"></a>
            <a style="display: inline;border: none;" v-if="user.role=='Admin'" v-on:click.stop="deleteModal=true" class="reset fas fa-trash editbuttons"></a>
          
          </a>
        </h5>
      </div>
      <div v-bind:id="'term_'+term.id" class="collapse" :aria-labelledby="'#headterm_'+term.id" style="">
        <div v-if="show || nb<=2">
          <definitionContent :termId="term.id" :termName="term.name"></definitionContent>
        </div>
      </div>
      
      <edittermmodal v-if="editModal" @canceled="editModal=false" @updated="update(... arguments)" :term="term"></edittermmodal>
      <deletetermmodal v-if="deleteModal" @canceled="deleteModal=false" @deleted="update(... arguments)" :term="term"></deletetermmodal>
    </div>`
});


Vue.component('definitionContent', {

  props:['termId', 'termName'],

  data() {
    return {
      definitions: [],
      loading: true,
      creatingDefinition: false,
      availableContexts: [],
    }
  },

  computed:{
    user() {return this.$store.state.user;},
  },

  watch: {
    'termId': 'getTerm',
    'user.connected': 'updateUser',
  },

  mounted(){
    this.getTerm();
  },

  methods:{
    parseArrayToHTMLList(array){
      let str = '';
      if (array.length > 0) {
        str = "<ul>";
        array.forEach(e => {
          str=(e.startsWith("http")
              ?str.concat("<li><a target='_blank'  rel=\"nofollow\" href='" + e + "'>" + e + "</a></li>")
              :str.concat("<li>" + e + "</li>"));
        });
        str=str.concat("</ul>");
      }
      return str;
    },

    updateUser(){
      this.availableContexts = JSON.parse(JSON.stringify(this.user.parsedGrantedContexts));
      for(let j=0; j<this.definitions.length; j++){
        for(let k=0; k<this.availableContexts.length; k++){
          if(this.availableContexts[k].id===this.definitions[j].context.id){
            this.availableContexts.splice(k, 1);
          }
        }
      }
    },

    getTerm(){
      this.loading=true;
      //Requête.
      axios.get("/api/terms/".concat(this.$props.termId))
        .then(response => {
          let pc;
          response.data.definitionList.forEach(def => {

            //Parsing context name to get parents.
            if (def.context.parentContext) {
              pc = def.context.parentContext;
              while (pc) {
                def.context.name = pc.name.concat(" > ").concat(def.context.name);
                pc = pc.parentContext;
              }
            }
            def.htmlbib = this.parseArrayToHTMLList(def.bibliography);
            def.htmlsources = this.parseArrayToHTMLList(def.sources);
            def.definitionHtml = def.definition.replace(/\n/g, '<br />');
            def.definition = def.definition.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
          });

          this.definitions=response.data.definitionList;
          this.definitions.sort((a,b) => (a.context.name > b.context.name) ? 1 : ((b.context.name > a.context.name) ? -1 : 0));
          this.updateUser();
          this.loading=false;
        })
    },

    definitionCreated: function(){
      this.creatingDefinition=false;
      this.getTerm();
    },

  },

  template: `
    <div class="card-block" >
      <div class="card no-border">
        <div class="card-body defs">
          <div v-if="loading">
            <div class="spinkit spinkit-primary spinkit-large centered">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
            </div>
          </div>
          <div v-else-if="definitions.length==0">
            <p>Désolé, aucune définition pour ce terme n'est encore présent dans la base de données.</p>
          </div>
        
          <div v-for="def in definitions" :id="'def_'+def.context.id">
            <definition @updated="getTerm" :avcontexts="availableContexts" :def="def"></definition>
          </div>
          <button v-if="availableContexts.length>0" class="btn btn-success" style="float: right;" v-on:click="creatingDefinition=true">Ajouter une définition</button>
          <createDefinition v-if="creatingDefinition" :termId="termId" :termName="termName" :contexts="availableContexts" @created="definitionCreated" @canceled="creatingDefinition=false"></createDefinition>
        </div>
      </div>
    </div>`
});

Vue.component('definition', {
  props:['def', 'avcontexts'],

  data(){
    return{
      contexts:[],
      deleteModal:false,
      editModal:false,
      display:true,
      moveModal:false,
    }
  },

  computed: {
    user() { return this.$store.state.user; },
  },

  watch:{
    'user.connected': 'updateUser',
  },

  created(){
    this.updateUser();
  },

  methods:{
    updateUser: function(){
      this.contexts=[];

      for(let j=0; j<this.user.grantedContexts.length; j++){
        this.contexts.push(this.user.grantedContexts[j].id);
      }

    },

    showPopover(val) {
      let attr = $(val).attr('aria-describedby');
      let display=(!(typeof attr !== typeof undefined && attr !== false));

      $(val).popover('enable');
      $('*').popover('hide');

      (display)?$(val).popover('show'):$(val).popover('disable');
    },

    fillSearchField: function (str) {
      this.$router.push('/search/'+str.replace("/", ""));
      this.$store.commit('search', str);
    },

    updateDefinition(){
      this.editModal=false;
      this.deleteModal=false;
      this.moveModal=false;
      this.$emit('updated');
    }
  },

  template:`
    <div v-if="display">
      <h3>
        <span class="label label-secondary">{{ def.context.name }}</span> 
        <span v-if="def.gdpr" class="label label-error">Terme RGPD</span>
        <span v-if="contexts.includes(def.context.id)">
          <a v-on:click="editModal=true"  class="fas fa-pen editbuttons"></a>
          <a v-on:click="deleteModal=true" class="fas fa-trash editbuttons"></a>
          <a v-if="user.role=='Admin'" v-on:click="moveModal=true" class="fas fa-sign-out-alt editbuttons"></a>
        </span>
      </h3>
      <p v-html="def.definitionHtml"></p>
      <span v-if="def.synonymsTermList.length>0" class="infos">
        <span>
          <span class="label label-default synonyms">Synonymes :</span> 
          <span v-for="a in def.synonymsTermList">
            <span class="label"><a class="color-primary" v-on:click="fillSearchField(a.name)">{{a.name}}</a></span>
          </span>
        </span>
        </span>
        <span v-if="def.antonymsTermList.length>0" class="infos">
          <span>
            <span class="label label-default antonyms">Antonymes :</span> 
            <span v-for="a in def.antonymsTermList">
              <span class="label"><a class="color-primary" v-on:click="fillSearchField(a.name)">{{a.name}}</a></span>
            </span>
          </span>
        </span>
        <div v-if="def.synonymsTermList.length!=0 || def.antonymsTermList.length!=0"><br /></div>
        <span v-if="def.relatedTermList.length>0" class="infos">
          <span>
            <span class="label label-default related">Termes connexes :</span> 
            <span v-for="a in def.relatedTermList">
              <span class="label"><a class="color-primary" v-on:click="fillSearchField(a.name)">{{a.name}}</a></span>
            </span>
          </span>
        </span>
        <span class="infos">
          <span v-if="def.sources.length>0">
            <button :container="'def_'+def.context.id" data-placement="bottom" v-on:click.stop="showPopover('#source_c'+def.context.id+'_d'+def.term.id)" :id="'source_c'+def.context.id+'_d'+def.term.id" class=" btn resources label label-default" data-toggle="popover" title="Sources" :data-content="def.htmlsources" data-html="true">Sources <i class="fas fa-location-arrow"></i></button>
          </span>    
          <span v-if="def.bibliography.length>0">
            <button :container="'def_'+def.context.id" data-placement="bottom" v-on:click.stop="showPopover('#bib_c'+def.context.id+'_d'+def.term.id)" :id="'bib_c'+def.context.id+'_d'+def.term.id" class=" btn resources label label-default" data-toggle="popover" :data-content="def.htmlbib" title="Bibliographie" data-html="true">Bibliographie <i class="fas fa-location-arrow"></i></button>
          </span>
        </span>
      </span>
           
      <deleteDefinitionModal v-if="deleteModal" @deleted="updateDefinition" @canceled="deleteModal=false" :def="def"></deleteDefinitionModal>
      <editDefinitionModal v-if="editModal" @canceled="editModal=false" @updated="updateDefinition" :def="def"></editDefinitionModal>
      <moveDefinitionModal v-if="moveModal" @canceled="moveModal=false" @updated="updateDefinition" :def="def" :avcontexts="avcontexts"></moveDefinitionModal>
      <hr>
    </div>`
});