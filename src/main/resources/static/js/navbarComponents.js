Vue.component('topmenu', {

    data(){
        return {
            pendingAction:false,
            error:false,
            selected:"",
        }
    },

    computed: {
        isLoggedIn() {
            return this.$store.state.user.connected;
        },
        user() {
            return this.$store.state.user;
        },
    },

    watch: {
        isLoggedIn() {
            this.updateLoginNav();
        },
    },

    mounted() {

        this.selected = (DELEGATED_AUTH)?this.$refs.domain.value:"local";

        this.updateLoginNav();
    },

    methods: {
        updateSelected: function(){
          this.selected = this.$refs.domain.value;
        },

        updateLoginNav: function () {
            this.$refs.loginForm.style.display = (this.isLoggedIn) ? "none" : "block";
            this.$refs.usernameForm.value="";
            this.$refs.passwordForm.value="";
            this.error=false;
        },

        sendLostPassword: function() {
            if(this.$refs.usernameForm.value.length>=1) {
                axios.get("/api/accounts/lostPassword/" + this.$refs.usernameForm.value)
                    .then(response => {
                        notifier.info("Un email avec des informations de réinitialisation vient de vous être envoyé");
                    })
                    .catch(() => {
                        notifier.alert("Impossible de démarrer la procédure de mot de passe perdu : L'utilisateur n'existe pas, n'est pas activé, ou une procédure est déjà en cours.");
                    })
            }
        },

        login: function () {
            let postdata = new URLSearchParams();

            //Récupération des paramètres
            postdata.append("username", this.$refs.usernameForm.value);
            postdata.append("password", this.$refs.passwordForm.value);
            postdata.append("domain", this.$refs.domain.value);
            this.pendingAction=true;
            this.error=false;

            //Connexion sur l'API.
            axios.post("/auth", postdata)
                .then(response => {
                    this.$refs.loginForm.style.display = "none";
                    let obj = {
                        role: response.data.role.charAt(0).toUpperCase() + response.data.role.slice(1).toLowerCase(),
                        name: response.data.fullName,
                        avatar: response.data.avatar,
                        token: response.headers.authorization,
                        id: response.data.id,
                        domain: response.data.domain,
                        grantedContexts: JSON.parse(response.data.grantedContexts),
                    };

                    this.$store.commit('login', obj);
                    this.updateLoginNav();
                    notifier.success("Bienvenue, "+response.data.fullName+".");
                })
                .catch(() => {
                    this.error=true;
                })
                .finally(() => {
                    this.pendingAction=false;
                });
        },
        logout: function () {
            this.$store.commit('logout');
            notifier.success("Vous avez été déconnecté.");
        },
    },


    template: `
    <div class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <div class="logo logo-ux-white logo-small">
          <router-link class="nav-link nobg" to="/"></router-link>
        </div>
        <nav class="ml-auto" style="margin-right: 30px;" aria-label="Navigation principale">
          <ul class="navbar-nav">
            <li class="nav-item" v-if="user.connected && user.role=='Admin'" >
              <router-link class="nav-link" to="/admin">Espace Admin</router-link>
            </li>
            <li v-if="user.connected" class="nav-item"  v-if="user.connected &&  (user.role=='Admin' || user.role=='Glossateur')">
              <router-link class="nav-link" to="/importCSV">Importer un CSV</router-link>
            </li>
            
             <li v-if="user.connected" class="nav-item user menu-user">
             <router-link class="nav-link" style="padding:0" to="/user" id="User">
                {{ user.name }} - {{ user.role }}
             </router-link>            
              </li>
              
              <li v-if="user.connected" class="nav-item">
              <a class="nav-link logout-button" style="padding:0;text-align: center;"  v-on:click="logout">
                        <i class="fas fa-power-off"></i>
                        <span class="d-none">Déconnexion</span>
                      </a>
              </li>

            <li ref="loginForm" style="display: none;" class="nav-item dropdown user menu-user" >
              <a class="nav-link dropdown-toggle" href="#userhover" id="User" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                Connexion/Inscription
              </a>
              <ul class="dropdown-menu dropdown-menu-right" ref="userhover" id="userhover" style="display: none;">
                  <li class="list-user">
                  <li class="list-user">
                    <div class="login">
                      <form v-on:submit.prevent="login" method="post"> 
                        <input aria-label="Nom d'utilisateur" ref="usernameForm" :disabled="pendingAction" name="username" type="text" placeholder="Nom d'utilisateur">
                        <input aria-label="Mot de passe" ref="passwordForm" :disabled="pendingAction" name="password" type="password" placeholder="Mot de passe">
                        <select class="form-control" ref="domain" v-on:change="updateSelected">
                          <option v-if="DELEGATED_AUTH" value="central">Connexion centralisée</option>
                          <option value="local">Connexion locale</option>
                        </select>
                        
                        <input type="submit" class="btn btn-success" :disabled="pendingAction" v-on:submit.prevent="login"/>
                        
                        <a v-if="selected=='local'" class="centered text-center forgotpasswordlink" v-on:click.stop="sendLostPassword">Mot de passe oublié ?</a>

                        <router-link v-if="OPEN_REGISTRATION" style="padding: unset;border: unset;" to="/register">
                          <button type="button" class="btn btn-info" style="padding: 5px; margin: 0px; margin-top:10px"">Créer un compte local</button>
                        </router-link>
                      </form>
                    </div>

                    <div v-if='pendingAction' class="notifications notification-primary login-info">
                      <p>Connexion...</p>
                    </div>
                    <div v-if='error' class="notifications notification-error login-info">
                      <p>Identifiants invalides</p>
                    </div>
                  </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>`
});
