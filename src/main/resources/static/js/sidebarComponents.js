Vue.component('sidebar_modifs', {

  data(){
    return {
      history: [],
      historyId: [],
      loading: true,
      error: false
    }
  },

  mounted(){
    axios.get("/api/history/definitions")
      .then(response => {
        let nb = 0;
          response.data.forEach(elem => {
            if(nb<4) {
              let text;
              switch (elem[2]) {
                case "ADD":
                  text = "Terme créé";
                  break;
                case "MOD":
                  text = "Terme modifié";
                  break;
                default:
                  text = "Terme supprimé";
              }
              if(!this.historyId.includes(elem[0].context.id+","+elem[0].term.id)) {
                this.historyId.push(elem[0].context.id+","+elem[0].term.id);
                this.history.push({"termName": elem[0].term.name, "contextName": elem[0].context.name, "text": text});
                nb++;
              }
            }

          });
      })
      .catch(() => {
        this.error=true;
      })
  },

  methods:{
    fillSearchField: function (str) {
      let temp = this.$store.state.noChange;
      this.$store.commit('toggleNoChange', false);
      setTimeout(this.$router.push('/search/'+str.replace("/", "")), 50);
      setTimeout(this.$store.commit('toggleNoChange', temp), 100);
    }
  },

  template: `
    <div class="card card-bordered">
      <div class="card-header">
        <h3 class="card-title">Dernières modifications</h3>
      </div>
      <div class="card-body">
        <div v-if="!error">
          <div v-if="history.length==0">
            Aucune modification n'a été effectuée sur Columbia.
          </div>
          <ul>
            <li v-for="hist in history">
              {{hist.text}} : <a v-on:click="fillSearchField(hist.termName)" class="color-primary"><b>{{hist.termName}}</b></a> dans le contexte <i>{{hist.contextName}}</i>
            </li>
          </ul>
          <div style="text-align: right;"><router-link to="/history">En lire +</router-link></div>
        </div>
        <div v-else class="text-center">
          Erreur de chargement du contenu.
        </div>
      </div>
    </div>`
});



Vue.component('sidebar_stats', {
  data(){
    return {
      definitions: 0,
      contexts: 0,
      terms: 0,
      users: 0,
      read: 0,
      error: false,
      moderator_role: '',
    }
  },

  mounted(){
    this.moderator_role=MODERATOR_ROLE.toLowerCase();
    this.updateAll();

    this.$root.$on('update', (val, nb) => {
      this[val]+=nb;
    });

    this.$root.$on('updateAll', () => {
      this.updateAll();
    });
  },

  methods: {
    updateAll: function(){
      axios.get("/api/stats")
          .then(response => {
            this.definitions=response.data.definitionsNumber;
            this.contexts=response.data.contextsNumber;
            this.terms=response.data.termsNumber;
            this.users=response.data.usersNumber;
          })
          .catch(() => {
            this.error=true;
          });
      axios.get("/matomoStats")
          .then(response => {
            this.read=response.data.nb_pageviews;
          });
    }
  },



  template: `
    <div class="card card-bordered">
      <div class="card-header">
        <h3 class="card-title">Statistiques</h3>
      </div>
      <div class="card-body">
        <div v-if="!error">
          <ul>
            <li><b>{{definitions}}</b> définitions réparties dans <b>{{contexts}} </b>contextes pour <b>{{terms}} </b>termes</li>
            <li><b>{{users}}</b> {{moderator_role}}s actifs</li>
            <li><b>{{read}}</b> définitions lues</li>
          </ul>
        </div>
        <div v-else class="text-center">
          Erreur de chargement du contenu.
        </div>
      </div>
    </div>`
});




Vue.component('newsletter', {

  methods: {
    redirectToNSRoute: function() {
      const expression = /\S+@\S+\.\S+/
      if(expression.test(String(this.$refs.mail.value).toLowerCase())){
        this.$store.commit('nsMail', this.$refs.mail.value);
        this.$refs.mail.value="";

        let temp = this.$store.state.noChange;
        this.$store.commit('toggleNoChange', false);
        setTimeout(this.$router.push('/newsletter/'), 50);
        setTimeout(this.$store.commit('toggleNoChange', temp), 100);
      } else {
        notifier.alert("L'adresse mail saisie n'est pas valide.");
      }
    }
  },

  template: `
<div>
    <div class="card card-bordered">
      <div class="card-header">
        <h3 class="card-title">Restez en orbite</h3>
      </div>
      <div class="card-body">       
       <form v-on:submit.prevent="redirectToNSRoute" method="post">

          <div class="input-group mb-3">
            <input ref="mail" type="text" class="form-control form-control-newsletter" placeholder="john.doe@be-ys.com" aria-label="Adresse mail" aria-describedby="button-addon2">
            <div class="input-group-append">
              <button class="btn btn-primary btn-ns" type="button" id="button-addon2" style="font-size: 13px;" v-on:click="redirectToNSRoute()"><i class="fas fa-satellite"></i></button>
            </div>
          </div>
          <i style="font-size: 10px;">Vous recevrez chaque vendredi la liste des modifications du glossaire</i>
        </form>

      </div>
      </div>
    </div>`
});
