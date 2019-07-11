const User = Vue.component('account', {
    data(){
        return {
            email:'',
            editMail: false,
            editPassword: false,
        }
    },

    mounted() {
        if (this.user.domain==="local"  || this.user.domain=="") {
            this.getUserInfos();
        }
    },

    computed: {
        user() {
            return this.$store.state.user;
        },
    },

    watch: {
        'user.connected' : 'getUserInfos',
    },

    methods: {
        getUserInfos: function(){
            if(this.user.connected) {
                axios.get("/api/users/self", {headers: {Authorization: localStorage.token}})
                    .then(response => {
                        this.email = response.data.email;
                    })
            }
        },

        updateEmail: function(){
            let obj={};
            obj.email=this.$refs.emailInput.value;

            axios.put("/api/users/".concat(this.user.id), obj, {headers: { Authorization: localStorage.token} })
                .then(response => {
                    notifier.success("Adresse mail mise à jour !");
                    this.getUserInfos();
                    this.editMail=false;
                })
                .catch(() => {
                    notifier.alert("Erreur lors de la mise à jour. Vérifiez que l'adresse mail est valide.");
                })
        },

        updatePassword: function(){
            let obj={};
            obj.password=this.$refs.passwordInput.value;

            axios.put("/api/users/".concat(this.user.id), obj, {headers: { Authorization: localStorage.token} })
                .then(response => {
                    notifier.success("Mot de passe mis à jour !");
                    this.editPassword=false;
                })
                .catch(() => {
                    notifier.alert("Erreur lors de la mise à jour.");
                })
        },

      downloadContext: function(id){
          notifier.info("Préparation du téléchargement...");
          axios.get("/api/contexts/".concat(id).concat("/export"), {headers: { Authorization: localStorage.token}, responseType: 'blob'})
              .then(response => {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'context.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  notifier.success("Le téléchargement a démarré...");
              })
              .catch(error => {
                  notifier.alert("Erreur lors du téléchargement.");
              })
      }
    },

    template: `
      <div>
        <div class="card card-bordered">
          <div v-if="user.connected">
            <div class="card-header">
              <h3 class="card-title">Compte - {{user.name}}</h3>
            </div>
            <div class="card-body">
              <div class="border padding-15 border-radius bg-white mb-2">
                <div class="user user-medium">
                  <div class="flex-row" style="display: flex; align-items: center;">
                    <div>
                      <img :src="user.avatar" alt="avatar" class="rounded-circle">
                    </div>
                    <div style="padding-left:15px;">
                      <b>{{user.name}}</b><br />{{user.role}}<br />
                      <div v-if="user.domain!=='local'" style="padding: 0 10px; margin: 15px 0 0 0 ;">
                        <h5 style="padding: 5px;"><span data-toggle="tooltip" data-placement="left"  
                          style="padding-left:5px; font-size: 14px;"><span class="fas fa-info" style="padding-right:5px;"></span> Ce compte est en délégation depuis l'authentification centralisée. Pour éditer vos données de connexion, mettez à jour vos identifiants centralisés.</span>
                        </h5>
                      </div>
                      <div v-else>
                        <span v-if="!editMail">
                        <b>Adresse mail :</b> {{email}}  <i class="fas fa-pencil-alt" v-on:click="editMail=true"></i> <br />
                        </span>
                        <span v-else style="display:ruby;">
                          <b>Adresse mail : </b> <input class="form-control" type="email" ref="emailInput" :value="email" style="max-width: 400px;"/> 
                          <i class="fas fa-check" style="padding-left:10px; color: green;" v-on:click="updateEmail()"></i> 
                          <i class="fas fa-times" style="padding-left:10px; color: red;" v-on:click="editMail=false"></i>
                        </span>
                        
                        <span v-if="!editPassword">
                          <b>Mot de passe :</b> **********  <i class="fas fa-pencil-alt"  v-on:click="editPassword=true" ></i>
                        </span>
                        <span v-else style="display:ruby;">
                          <b>Mot de passe : </b> <input class="form-control" type="password" ref="passwordInput" style="max-width: 400px;"/> 
                          <i class="fas fa-check" style="padding-left:10px; color: green;" v-on:click="updatePassword()"></i> 
                          <i class="fas fa-times" style="padding-left:10px; color: red;" v-on:click="editPassword=false"></i>
                        </span>
                        
                      </div>
                    </div>
                  </div>
                  <div v-if="user.role.toLowerCase()==ADMIN_ROLE.toLowerCase() || user.role.toLowerCase()==MODERATOR_ROLE.toLowerCase()">
                  <h3>Liste des droits de glossateur</h3>
                    <ul>
                      <li v-for="e in user.parsedGrantedContexts">{{e.name}} <a style="display: inline;padding-left: 10px;" class="fas fa-file-export" v-on:click.stop="downloadContext(e.id)"></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="card-header">
              <h3 class="card-title">Erreur de chargement</h3>
            </div>
            <div class="card-body">
              Il semblerait que vous ne soyiez pas connecté. Revenez ici une fois connecté.
            </div>
          </div>
        </div>
      </div>`
});