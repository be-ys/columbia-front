const Newsletter = Vue.component('newsletterCreator', {

  data(){
      return {
          mail: '',
          contexts:[],
          selectedContexts:[],
          alreadyhere:false,
          loading:true,
      }
    },

    computed:{
      email()  { return this.$store.state.nsmail;}
    },

    watch:{
      'email' : 'initialization',
    },

    mounted() {
      this.initialization();
    },

    methods:{
        initialization: function(){
            if(this.$route.params.token){
                //Si le token existe, on le récupère, et on get depuis la bdd
                axios.get("/api/newsletters/".concat(this.$route.params.token))
                    .then(response => {
                        this.mail=response.data.email;
                        response.data.subscribedContexts.forEach(e => { this.selectedContexts.push(e.id) });
                        this.alreadyhere=true;
                    })
                    .catch(() => {
                        notifier.alert("Le token ne correspond a aucun mail dans notre base.");
                        this.$router.push('/search/');
                    });
            } else {
                //Sinon on récupère depuis le store
                this.mail=this.$store.state.nsmail;
                const expression = /\S+@\S+\.\S+/
                if(!expression.test(String(this.mail).toLowerCase())) {
                    notifier.alert("L'adresse mail saisie n'est pas valide.");
                    this.$router.push('/search/');
                }
            }

            //Récupération des contexts.
            axios.get("/api/contexts/?size=2000")
                .then(response => {
                    this.contexts = parseContexts(response.data.content);
                });
            this.loading=false;
        },

        toggleContext: function(id){
            if(this.selectedContexts.includes(id)){
                this.selectedContexts = this.selectedContexts.filter(c => c!=id);
            } else {
                this.selectedContexts.push(id);
            }
        },

        deleteMail: function(){
            this.loading=true;
            axios.delete("/api/newsletters/".concat(this.$route.params.token))
                .then(response => {
                    notifier.success("L'adresse mail a bien été supprimée.");
                    this.$router.push('/search/');
                })
                .catch( () => {
                    this.loading=false;

                    notifier.alert("L'adresse mail n'a pas pu être supprimée. Si le problème persiste, contactez-nous.");
            })
        },

        createMail: function(){
            this.loading=true;

            //Recontruction.
            let obj = {
                email: this.mail,
                subscribedContexts: []
            };

            this.selectedContexts.forEach(e => obj.subscribedContexts.push({id: e}));

            axios.post("/api/newsletters", obj)
                .then(() => {
                    notifier.success("Inscription réussie !");
                    this.$router.push('/search/');

                })
                .catch(() => {
                    this.loading=false;
                    notifier.alert("L'adresse mail n'a pas pu être ajoutée. Si vous êtes déjà inscrit, utilisez le lien envoyé dans les mails.");

                });
        },

        updateMail: function(){
            this.loading=true;


            //Recontruction.
            let obj = {
                email: this.mail,
                subscribedContexts: []
            };

            this.selectedContexts.forEach(e => obj.subscribedContexts.push({id: e}));


            axios.put("/api/newsletters/".concat(this.$route.params.token), obj)
                .then(() => {
                    notifier.success("Inscription mise à jour !");
                    this.$router.push('/search/');
                })
                .catch(() => {
                    this.loading=false;

                    notifier.alert("L'adresse mail n'a pas pu être mise à jour.");

                });
        },
    },


    template: `
      <div>
        <div class="card card-bordered">
            <div class="card-header">
              <h3 class="card-title">Abonnements - {{mail}}</h3>
              <i>Ne rien sélectionner permet de s'abonner à l'ensemble des contextes disponibles.</i>
            </div>
            <div class="card-body" v-if="loading"><div class="spinkit spinkit-primary spinkit-large centered">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
            </div></div>
            <div v-else class="card-body">
              <div v-for="context in contexts">
                    <input type="checkbox" :id="'c'+context.id" name="interest" v-on:change="toggleContext(context.id)" :value="context.id" :checked="selectedContexts.includes(context.id)">
                    <label :for="'c'+context.id"><span v-for="i in (1,context.level)" style="padding-left:15px;"></span> └ {{context.name}}</label>
                </div>
              <div style="float: right;" >
                <button v-if="alreadyhere" class="btn btn-danger" v-on:click="deleteMail()">Se désinscrire</button>
                <button v-if="!alreadyhere" class="btn btn-success" v-on:click="createMail()">S'abonner</button>
                <button v-if="alreadyhere" class="btn btn-info" v-on:click="updateMail()">Mettre à jour</button>
              </div>
                
              <div style="margin-top: 70px;text-align: justify;">
                <i>Votre adresse mail sera utilisée par l'éditeur à des fins de communication de la newsletter. 
                  Vous pouvez vous désinscrire à tout moment en cliquant sur le lien de désabonnement prévu à cet effet. Conformément à la loi Informatique et Libertés et au Règlement Général sur la Protection des Données, vous disposez, en justifiant de votre identité, d’un droit d’accès, de rectification, de modification, de suppression ou de portabilité des données à caractère personnel vous concernant.
                  Vous pouvez également, pour des motifs légitimes, vous opposer totalement ou partiellement à tout traitement de vos données, ou retirer un consentement préalablement donné.
                  Pour exercer vos droits ou pour toute question relative à ce traitement, merci de nous adresser un mail à : //EMAIL-DPO
                </i>
              </div>
            </div>
         
        </div>
      </div>`
});