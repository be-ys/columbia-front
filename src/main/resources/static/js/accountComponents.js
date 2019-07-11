const LostPassword = Vue.component('lostpassword', {
    data() {
        return {
            token: '',
            disabled: true,
        }
    },

    mounted() {
        if (this.$route.params.to.length<=1) {
            notifier.alert("URL invalide.");
            this.$router.push('/');
        }
        this.token=this.$route.params.to;
    },

    computed: {
        user() {
            return this.$store.state.user;
        },
    },

    methods: {
        updatePassword: function(){
            if(this.$refs.password.value === this.$refs.confirmPassword.value) {
                let obj = {};
                obj.password = this.$refs.password.value;

                axios.put("/api/accounts/lostPassword/".concat(this.token), obj, {headers: {Authorization: localStorage.token}})
                    .then(response => {
                        notifier.success("Mot de passe mis à jour, vous pouvez vous connecter avec vos nouveaux identifiants.");
                        this.$router.push('/');
                    })
                    .catch(() => {
                        notifier.alert("Le token est invalide.");
                        this.$router.push('/');
                    })
            }
        },

        checkPasswords: function(){
            this.disabled = this.$refs.password.value !== this.$refs.confirmPassword.value || this.$refs.password.value.length===0 || this.$refs.confirmPassword.value.length===0;
        }
    },

    template: `
      <div>
        <div class="card card-bordered">
          <div v-if="!user.connected">
            <div class="card-header">
              <h3 class="card-title">Réinitialiser votre mot de passe</h3>
            </div>
            <div class="card-body">
              <p>Veuillez saisir le nouveau mot de passe à associer au compte ayant pour clef {{token}}.</p>
              <div class="input-group mb-3">
      <div class="custom-file">
        <input class="form-control" type="password" id="password" ref="password" placeholder="Nouveau mot de passe" v-on:input="checkPasswords" v-bind:class="{ 'is-invalid': disabled }">
        <input class="form-control" type="password" id="confirmPassword" ref="confirmPassword" placeholder="Confirmez" v-on:input="checkPasswords" v-bind:class="{ 'is-invalid': disabled }">
      </div>
      <div class="input-group-append">
        <button class="btn btn-secondary" :disabled="disabled" ref="sendButton" v-on:click="updatePassword">Réinitialiser le mot de passe ></button>
      </div>
      
    </div>
    <span v-if="disabled" class="text-danger">Les mots de passe saisis sont différents.</span>
            </div>
          </div>
          <div v-else>
            <div class="card-header">
              <h3 class="card-title">Vous êtes connecté.</h3>
            </div>
            <div class="card-body">
              Vous êtes déjà connecté. Pour modifier votre mot de passe, merci d'utiliser <router-link to="/user">la page de votre profil</router-link>.
            </div>
          </div>
        </div>
      </div>`
});

const ActivateAccount = Vue.component('activateaccount', {
    mounted() {
        if (this.$route.params.to.length <= 1) {
            notifier.alert("Le token n'est pas valide.");
            this.$router.push('/');
        }
        axios.put("/api/accounts/activate/".concat(this.$route.params.to))
            .then(() => {
                notifier.success("Le compte a été activé, vous pouvez vous connecter.");
                this.$router.push('/');
            })
            .catch(() => {
                notifier.alert("Erreur à l'activation : Le token est invalide.");
                this.$router.push('/');
            })
    },

    template: `
      <div>
        <div class="card card-bordered">
            <div class="card-header">
              <h3 class="card-title">Chargement en cours</h3>
            </div>
            <div class="card-body">
              <p>Veuillez patienter...</p>
            </div>
          </div>
         
        </div>`
});



const Register = Vue.component('register', {
    data(){
        return{
            sending:false,
        }
    },

    computed: {
        user() {
            return this.$store.state.user;
        },
    },

    mounted() {
        if(!OPEN_REGISTRATION){
            notifier.alert("Les incriptions ne sont pas ouvertes sur ce serveur.");
            this.$router.push('/');
        }
    },

    methods: {
      register: function() {
          if (OPEN_REGISTRATION) {
              this.sending = true;

              let obj = {
                  username: this.$refs.user.value,
                  password: this.$refs.pass.value,
                  email: this.$refs.mail.value,
              };

              axios.post("/api/users", obj)
                  .then(() => {
                      notifier.success("Inscription réussie, vous allez recevoir un mail pour activer votre compte.");
                      this.$router.push('/');
                  })
                  .catch(() => {
                      notifier.alert("Erreur d'inscription. Le nom d'utilisateur est déjà utilisé, ou l'adresse mail est invalide.");
                      this.sending = false;
                  })
          } else {
              notifier.alert("Les incriptions ne sont pas ouvertes sur ce serveur (et vous n'auriez dû jamais arriver ici sans tricher).");
          }
      }
    },

    template: `
      <div>
        <div class="card card-bordered" v-if="!user.connected">
            <div class="card-header">
              <h3 class="card-title">Inscription</h3>
            </div>
            <div class="card-body">
            
            <div v-if="DELEGATED_AUTH" class="alert alert-info"  style="margin-bottom: 20px;">
              <strong>Attention : </strong> Pour se connecter depuis le serveur d'authentification centralisée, ne créez pas de compte par cette interface.
            </div>
            
            <span v-if="sending" class="lds-css ng-scope lds-eclipse"><div></div></span>

            <form v-on:submit.prevent="register" method="post"> 
            <div class="input-group mb-3">
              <div class="input-group-append" style="width:20%" >
                <label for="user" class="input-group-text" style="width:100%;" >Nom d'utilisateur</label>
              </div>
              <input ref="user" id="user" type="text" :disabled="sending" class="form-control form-control-newsletter" required placeholder="John Doe" aria-label="Nom d'utilisateur">
            </div>
            
            <div class="input-group mb-3">
              <div class="input-group-append" style="width:20%" >
                <label for="mail" class="input-group-text"  style="width:100%;" >Adresse mail</label>
              </div>
              <input ref="mail" id="mail" type="email" :disabled="sending" class="form-control form-control-newsletter" required placeholder="john.doe@almerys.com" aria-label="Adresse mail">
            </div>
            
            <div class="input-group mb-3">
              <div class="input-group-append" style="width:20%" >
                <label for="password" style="width:100%;" class="input-group-text">Mot de passe</label>
              </div>
              <input ref="pass" id="password" type="password" :disabled="sending" class="form-control form-control-newsletter" required placeholder="********" aria-label="Mot de passe">
            </div>
            
             <div >
              <input type="checkbox" required id="customCheck1">
              <label for="customCheck1">En m'inscrivant, je reconnais avoir lu et accepté les <router-link to="/legal">mentions légales</router-link> et la <router-link to="/legal">politique de confidentialité</router-link>.</label>
            </div>
            <div class="text-center">
              <input type="submit" class="btn btn-primary" v-on:submit.prevent="login" value="S'inscrire"/>
            </div>
          </form>
            </div>
        </div>
        <div class="card card-bordered" v-else>
            <div class="card-header">
              <h3 class="card-title">Vous êtes déjà connecté</h3>
            </div>
            <div class="card-body">
              <p>Impossible de vous inscrire : Vous êtes déjà connecté.</p>
            </div>
        </div>
        </div>`
});