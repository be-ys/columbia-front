const Admin = Vue.component('admin', {
    data(){
        return {
            display:'',
        }
    },

    created(){
        this.display='users';
    },

    computed:{
        user() { return this.$store.state.user},
    },

    template:`
      <div>
        <div class="card card-bordered" v-if="user.role==parseRole(ADMIN_ROLE)">
          <div class="card-header">
            <h3 class="card-title">Espace administrateur</h3>
          </div>
      
          <div class="card-body">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" v-on:click="display='users'">Gestion des utilisateurs</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" v-on:click="display='contexts'">Gestion des contextes</a>
              </li>
            </ul>
            
            <adminUsers v-if="display=='users'"></adminUsers>
            <adminContexts v-if="display=='contexts'"></adminContexts>    
          </div>
        </div>
        <div class="card card-bordered" v-else>
          <div class="card-header">
            <h3 class="card-title">Accès refusé</h3>
          </div>
      
          <div class="card-body">
              <p>L'accès à cette interface est réservée aux administrateurs. Cet incident sera reporté.</p>
          </div>
        </div>
      </div>`,
});


Vue.component('adminUsers', {
    data(){
        return {
            users:[],
            createModal:false,
        }
    },

    mounted(){
        this.getUsers();

    },

    methods:{
        getUsers: function() {
            axios.get("/api/users/?size=2000", {headers: { Authorization: localStorage.token}})
                .then(response => {
                    this.users = response.data.content;
                    this.users.forEach(e => { e.role = e.role.charAt(0).toUpperCase() + e.role.slice(1).toLowerCase()});
                })
        },

        update: function(){
            this.createModal=false;
            this.getUsers();

        }
    },

    template:`
    <div style="margin-top:20px;">
      
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Nom d'utilisateur <button type="button" v-on:click="createModal=true" class="btn btn-primary btn-small btn" style="margin: 0;">Ajouter</button></th>
            <th scope="col">Rôle</th>
            <th scope="col">Domaine</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <userLine v-for="user in users" :user="user" @update="update"></userLine>  
        </tbody>
      </table>
      
      <addUserModal v-if="createModal" @updated="update" @canceled="createModal=false"></addUserModal>
    </div>`
});


Vue.component("addUserModal", {

    data(){
        return {
            newRole: 'UTILISATEUR',
            contexts:[],
            grantedContextsId:[],
            moderator_role:"",
            admin_role:"",
            user_role:"",
            domain: "",
            sending: false,
        }
    },

    mounted(){
        this.getContexts();
        this.moderator_role=MODERATOR_ROLE;
        this.admin_role=ADMIN_ROLE;
        this.user_role=USER_ROLE;
        if(DELEGATED_AUTH){
            this.domain = "central";
        } else {
            this.domain = "local";
        }
    },

    methods:{
        getContexts: function() {
            axios.get("/api/contexts/?size=2000")
                .then(response => {
                    this.contexts = parseContexts(response.data.content);
                })
        },


        cancelUpdate: function(){
            this.$emit("canceled");
        },

        updateUser: function(){
            //Recontruction.
            let obj = {
                domain: this.$refs.domainSelector.value,
                username: this.$refs.username.value,
                role: this.newRole.toUpperCase(),
                grantedContexts: []
            };
            if(obj.role===MODERATOR_ROLE){
                this.grantedContextsId.forEach(e => obj.grantedContexts.push({id: e}));
            }

            if(this.domain==="local"){
                obj.email=this.$refs.email.value;
                obj.password=this.$refs.password.value;
            }

            this.sending=true;

            axios.post("/api/users/", obj, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("L'utilisateur a été créé.");
                    this.$root.$emit('update', 'users', 1);
                    this.$emit("updated");
                })
                .catch(() => {
                    notifier.error("L'utilisateur n'a pas pu être créé.");
                    this.sending=false;

                });

        },
        updateRole: function(){
            this.newRole=this.$refs.roleSelector.value;
        },

        toggleContext: function(id){
            if(this.grantedContextsId.includes(id)){
                this.grantedContextsId = this.grantedContextsId.filter(c => c!=id);
            } else {
                this.grantedContextsId.push(id);
            }
        },

        updateDomain: function(){
            this.domain = this.$refs.domainSelector.value;
        }
    },

    template:`
    <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="max-width: 900px;">
            <div class="modal-content" >
              <div class="modal-header">
                <h4 class="modal-title">Créer un utilisateur</h4>
                <button type="button" class="close" v-on:click="cancelUpdate()" :disabled="sending" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
              <span v-if="sending" class="lds-css ng-scope lds-eclipse"><div></div></span>
                <label for="domainSelector">Domaine de connexion : </label><br />
                <select class="form-control" id="domainSelector" :disabled="sending" v-on:change="updateDomain" ref="domainSelector">                  
                  <option value="central" v-if="DELEGATED_AUTH">Connexion centrale</option>
                  <option value="local">Local</option>
                </select>
                <div v-if="domain!='local'">
                    <label for="username">Utilisateur : </label><br />
                    <input class="form-control" type="text" :disabled="sending" id="username" name="username" ref="username" placeholder="Nom d'utilisateur du LDAP"/>
                </div>
                <div v-else>
                    <label for="username">Utilisateur : </label><br />
                    <input class="form-control" type="text" :disabled="sending" id="username" name="username" ref="username" placeholder="Nom d'utilisateur"/>
                    
                    <label for="username">Email : </label><br />
                    <input class="form-control" type="email" :disabled="sending" id="email" name="email" ref="email" placeholder="john.doe@example.com"/>
                    
                    <label for="username">Mot de passe : </label><br />
                    <input class="form-control" type="password"  :disabled="sending" id="password" name="password" ref="password" placeholder="********"/>
                </div>
                <label for="roleSelector">Rôle : </label><br />
                <select class="form-control" id="roleSelector"  :disabled="sending" v-on:change="updateRole" ref="roleSelector">                  
                  <option :value="admin_role" >{{parseRole(admin_role)}}</option>
                  <option :value="moderator_role"> {{parseRole(moderator_role)}}</option>
                  <option :value="user_role" selected>{{parseRole(user_role)}}</option>
                </select>
                <br /><br />
                
                <div v-if="newRole.toUpperCase()==moderator_role">
                <label for="roles">Droits d'édition : </label><br />
                <div style="max-height:300px; overflow: auto;">
                <div v-for="context in contexts">
                    <input type="checkbox" :id="'c'+context.id"  :disabled="sending" name="interest" v-on:change="toggleContext(context.id)" :value="context.id" >
                    <label :for="'c'+context.id"><span v-for="i in (1,context.level)" style="padding-left:15px;"></span> └ {{context.name}}</label>
                </div>
                </div>
              </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" :disabled="sending" data-dismiss="modal" v-on:click="cancelUpdate()">Annuler</button>
                <button type="button" class="btn btn-warning" :disabled="sending" ref="button" data-dismiss="modal" v-on:click="updateUser()">Créer l'utilisateur <span v-if="sending" class="lds-eclipse"></span> </button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`

});




Vue.component("userLine", {
    props:['user'],

    data(){
        return {
            editModal: false,
            deleteModal: false,
        }
    },

    computed:{
        currentUser() { return this.$store.state.user.id;},
    },

    methods:{
        update: function(){
            this.deleteModal=false;
            this.editModal=false;
            this.$emit('update');
        },
    },

    template:`
      <tr>
        <td>
          {{user.username}}
        </td>
        
        <td>{{user.role}}</td>
        <td>
        {{user.domain}}
</td>
        <td>
          <a v-on:click="editModal=true" v-if="user.id!=currentUser" class="fas fa-pen editbuttons"></a>
          <a v-on:click="deleteModal=true" v-if="user.id!=currentUser"  class="fas fa-trash editbuttons"></a>
          
         
         <deleteUserModal v-if="deleteModal" :user="user" @deleted="update" @canceled="deleteModal=false;"></deleteUserModal>
          <editUserModal v-if="editModal" :user="user" @updated="update" @canceled="editModal=false;"></editUserModal>
        </td>
      </tr>`

});

Vue.component("editUserModal", {
    props:['user'],

    data(){
        return {
            newRole: '',
            contexts:[],
            grantedContextsId:[],
            moderator_role: '',
            admin_role: '',
            user_role: '',
            user_domain: '',
            user_mail: '',
            activ: false,
        }
    },

    mounted(){
        this.getUser();
        this.getContexts();
        this.newRole=this.$props.user.role;
        this.moderator_role=MODERATOR_ROLE;
        this.admin_role=ADMIN_ROLE;
        this.user_role=USER_ROLE;


    },

    methods:{
        getUser: function(){
            axios.get("/api/users/".concat(this.$props.user.id), {headers: { Authorization: localStorage.token}})
                .then(response => {
                    response.data.grantedContexts.forEach(e => this.grantedContextsId.push(e.id));
                    this.user_domain=response.data.domain;
                    this.user_mail=response.data.email;
                    this.activ=response.data.activ;

                })
        },

        getContexts: function() {
            axios.get("/api/contexts/?size=2000")
                .then(response => {
                    this.contexts = response.data.content;
                    this.parseContexts();
                })
        },
        parseContexts: function(){

            this.contexts = parseContexts(this.contexts);
        },


        cancelUpdate: function(){
            this.$emit("canceled");
        },
        updateUser: function(){
            //Recontruction.
            let obj = {
                role: this.newRole.toUpperCase(),
                grantedContexts: [],
                activ: this.activ,
            };
            if(obj.role===MODERATOR_ROLE){
                this.grantedContextsId.forEach(e => obj.grantedContexts.push({id: e}));
            }

            if(this.user_domain==='local'){
                obj.email = this.$refs.email.value;
                if(this.$refs.password.value.length>=2){
                    obj.password = this.$refs.password.value;
                }
            }

            axios.put("/api/users/".concat(this.$props.user.id), obj, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("L'utilisateur a bien été mis à jour.");
                    this.$emit("updated");
                })
                .catch(() => {
                    notifier.error("L'utilisateur n'a pas pu être mis à jour.");
                });

        },
        updateRole: function(){
            this.newRole=this.$refs.roleSelector.value;
        },

        toggleContext: function(id){
            if(this.grantedContextsId.includes(id)){
                this.grantedContextsId = this.grantedContextsId.filter(c => c!=id);
            } else {
                this.grantedContextsId.push(id);
            }
        },

        updateActiv: function(){
            this.activ=!this.activ;
        }
    },

    template:`
    <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="max-width: 900px;">
            <div class="modal-content" >
              <div class="modal-header">
                <h4 class="modal-title">Editer un utilisateur</h4>
                <button type="button" class="close" v-on:click="cancelUpdate()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">    
              <input type="checkbox" :checked="activ" id="activ" v-on:change="updateActiv"/>
                <label for="activ">Utilisateur activé (peut se connecter)</label>


                 <div v-if="user_domain!='local'">
                    <label for="username">Utilisateur : </label><br />
                    <input class="form-control" type="text" id="username" name="username" ref="username" disabled :value="user.username" placeholder="Nom d'utilisateur du LDAP"/>
                </div>
                <div v-else>
                    <label for="username">Utilisateur : </label><br />
                    <input class="form-control" type="text" id="username" name="username" ref="username" disabled :value="user.username" placeholder="Nom d'utilisateur"/><br /><br />
                    
                    <label for="username">Email : </label><br />
                    <input class="form-control" type="email" id="email" name="email" ref="email" :value="user_mail" placeholder="john.doe@example.com"/><br /><br />
                    
                    <label for="username">Mot de passe : </label><br />
                    <input class="form-control" type="password" id="password" name="password" ref="password" placeholder="********"/><br /><br />
                </div>
                <label for="roleSelector">Rôle : </label><br />
                <select class="form-control" id="roleSelector" v-on:change="updateRole" ref="roleSelector">
                  <option :value="admin_role" :selected="user.role==parseRole(admin_role)">{{parseRole(admin_role)}}</option>
                  <option :value="moderator_role" :selected="user.role==parseRole(moderator_role)"> {{parseRole(moderator_role)}}</option>
                  <option :value="user_role" :selected="user.role==parseRole(user_role)">{{parseRole(user_role)}}</option>  
                </select>
                <br /><br />
                
                <div v-if="newRole.toUpperCase()==moderator_role">
                <label for="roles">Droits d'édition : </label><br />
                <div style="max-height:500px; overflow: auto;">
                <div v-for="context in contexts">
                    <input type="checkbox" :id="'c'+context.id" name="interest" v-on:change="toggleContext(context.id)" :value="context.id" :checked="grantedContextsId.includes(context.id)">
                    <label :for="'c'+context.id"><span v-for="i in (1,context.level)" style="padding-left:15px;"></span> └ {{context.name}}</label>
                </div>
                </div>
</div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelUpdate()">Annuler</button>
                <button type="button" class="btn btn-warning" ref="button" data-dismiss="modal" v-on:click="updateUser()">Editer l'utilisateur</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`

});

Vue.component("deleteUserModal", {
    props:['user'],

    methods:{
        cancelDeletion: function() {
            this.$emit('canceled');
        },

        deleteUser: function() {
            axios.delete("/api/users/".concat(this.$props.user.id), {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("L'utilisateur a bien été supprimé.");
                    this.$root.$emit('update', 'users', -1);
                    this.$emit('deleted');
                })
                .catch(error => {
                    notifier.alert("L'utilisateur n'a pas pu être supprimé.");
                })
        },

    },


    template:`<div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="max-width: 900px;">
            <div class="modal-content" >
              <div class="modal-header">
                <h4 class="modal-title">Supprimer un utilisateur</h4>
                <button type="button" class="close" v-on:click="cancelDeletion()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                Êtes-vous sûr de vouloir supprimer l'utilisateur {{user.username}} ? Ses contributions ne seront pas effacées.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelDeletion()">Annuler</button>
                <button type="button" class="btn btn-danger" ref="button" data-dismiss="modal" v-on:click="deleteUser()">Supprimer l'utilisateur</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`


});

Vue.component('adminContexts', {
    data(){
        return{
            contexts:[],
            createModal:false,
        }
    },

    methods:{
      getContexts: function() {
          axios.get("/api/contexts/?size=2000")
              .then(response => {
                  this.contexts = response.data.content;
                  this.parseContexts();
              })
      },
      parseContexts: function(){

          this.contexts = parseContexts(this.contexts);
      },

        update: function(){
          this.createModal=false;
          this.getContexts();

          axios.get("/api/users/self", {headers: {Authorization: localStorage.token}})
              .then(response => {
                  this.$store.commit('updateContexts', response.data.grantedContexts);
              });
        }
    },

    mounted(){
        this.getContexts();
    },

    template:`
    <div style="margin-top:20px;">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Contexte <button type="button" v-on:click="createModal=true" class="btn btn-primary btn-small btn" style="margin: 0;">Ajouter</button></th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>

        
            <contextLine v-for="context in contexts" :context="context"  :contexts="contexts" @update="update"></contextLine>
        
        </tbody>
      </table>
      
      <createContextModal v-if="createModal" :contexts="contexts" @created="update" @canceled="createModal=false"></createContextModal>
    </div>`
});

Vue.component("contextLine", {
    props:['context', 'contexts'],

    data(){
        return {
            editModal: false,
            deleteModal: false,
        }
    },

    methods:{
        update: function(){
            this.deleteModal=false;
            this.editModal=false;
            this.$emit('update');
        },
    },

    template:`
      <tr>
        <td>
          <span v-for="i in (1,context.level)" style="padding-left:15px;"></span> └ {{context.name}}
        </td>
        <td>
          <a v-on:click="editModal=true"  class="fas fa-pen editbuttons"></a>
          <a v-on:click="deleteModal=true" v-if="!context.isParent" class="fas fa-trash editbuttons"></a>
          
         
          <deleteContextModal v-if="deleteModal" :context="context" @deleted="update" @canceled="deleteModal=false;"></deleteContextModal>
          <editContextModal v-if="editModal" :context="context" :contexts="contexts" @updated="update" @canceled="editModal=false;"></editContextModal>
        </td>
      </tr>`

});


Vue.component("deleteContextModal", {
    props:['context'],

    methods:{
        cancelDeletion: function() {
            this.$emit('canceled');
        },

        deleteContext: function() {
            axios.delete("/api/contexts/".concat(this.$props.context.id), {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("Le contexte a bien été supprimé.");
                    this.$root.$emit('updateAll');
                    this.$emit('deleted');
                })
                .catch(error => {
                    notifier.alert("Le contexte n'a pas pu être supprimé.");
                })
        },

    },


    template:`<div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="max-width: 900px;">
            <div class="modal-content" >
              <div class="modal-header">
                <h4 class="modal-title">Supprimer un contexte</h4>
                <button type="button" class="close" v-on:click="cancelDeletion()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                Êtes-vous sûr de vouloir supprimer le contexte {{context.name}} ? Toute les définitions lui étant rattachées seront définitivement supprimées.<br />
                <b>Important : Si un contexte est le parent d'autres contextes, la suppression sera impossible.</b>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelDeletion()">Annuler</button>
                <button type="button" class="btn btn-danger" ref="button" data-dismiss="modal" v-on:click="deleteContext()">Supprimer le contexte</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`


});


Vue.component("createContextModal", {
    props:['contexts'],

    data(){
        return {
            isDisabled:false,
        }
    },

    methods:{
        updateContextName: function() {
            this.$refs.button.disabled=false;
            this.isDisabled=false;
            if(this.$refs.contextName.value.length<=0){
                this.$refs.button.disabled=true;
                this.isDisabled=true;
            } else {
                this.$props.contexts.forEach(e => {
                    if(e.name===this.$refs.contextName.value && (!e.parentContext || e.parentContext.id==this.$refs.contextSelector.value )){
                        this.$refs.button.disabled=true;
                        this.isDisabled=true;
                    }
                });
            }
        },

        cancelCreation: function() {
            this.$emit('canceled');
        },

        createContext: function() {
            let obj = {
                name: this.$refs.contextName.value,
                description: this.$refs.contextDescription.value,
            };

            if(this.$refs.contextSelector.value!=="none"){
                obj.parentContext= {id: this.$refs.contextSelector.value};
            }

            axios.post("/api/contexts/", obj, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("Le contexte a bien été créé.");
                    this.$root.$emit('update', 'contexts', 1);
                    this.$emit('created');
                })
                .catch(error => {
                    notifier.alert("Le contexte n'a pas pu être créé.");
                })
        },

    },


    template:`<div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Créer un contexte</h4>
                <button type="button" class="close" v-on:click="cancelCreation()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
              
              <div v-bind:class="{ 'form-error': isDisabled, 'form-group':true }">
              <label for="contextName">Nom du contexte : </label>
                <input class="form-control" type="text" v-on:input="updateContextName" name="contextName" id="contextName" ref="contextName" placeholder="Nom..."/>
                <p class="color-error" v-if="isDisabled">Le contexte existe déjà.</p>
                </div>
                <label for="contextSelector">Contexte parent : </label>
                <select class="form-control" v-on:change="updateContextName" id="contextSelector" ref="contextSelector">
                  <option name="contextSelector" value="none">Aucun (racine)</option>
                  <option name="contextSelector" v-for="e in contexts" v-if="e.level<MAX_LEVEL-1" :value="e.id">{{e.name}}</option>
                </select>
                
                
                
                <label for="contextDescription">Description :</label>
                <textarea name="contextDescription" id="contextDescription" ref="contextDescription"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelCreation()">Annuler</button>
                <button type="button" class="btn btn-success" disabled ref="button" data-dismiss="modal" v-on:click="createContext()">Créer le contexte</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`


});







Vue.component("editContextModal", {
    props:['contexts', 'context'],

    data(){
      return{
          isDisabled:false,
          name:'',
      }
    },

    mounted(){
      this.name=this.$props.context.baseName;
        this.$refs.contextName.value=this.name;
    },

    methods:{
        updateContextName: function() {
            this.name=this.$refs.contextName.value;
            this.$refs.button.disabled=false;
            this.isDisabled=false;

            if(this.$refs.contextName.value.length<=0){
                this.$refs.button.disabled=true;
                this.isDisabled=true;

            } else {
                this.$props.contexts.forEach(e => {
                    if(e.baseName===this.$refs.contextName.value && (!e.parentContext ||  e.parentContext.id==this.$refs.contextSelector.value && e.id!=this.$props.context.id )){
                        this.$refs.button.disabled=true;
                        this.isDisabled=true;

                    }
                });
            }
        },

        cancelCreation: function() {
            this.$emit('canceled');
        },

        createContext: function() {
            let obj = {
                name: this.$refs.contextName.value,
                description: this.$refs.contextDescription.value,
            };

            if(this.$refs.contextSelector.value!=="none"){
                obj.parentContext= {id: this.$refs.contextSelector.value};
            }

            axios.put("/api/contexts/".concat(this.$props.context.id), obj, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("Le contexte a bien été mis à jour.");
                    this.$emit('updated');
                })
                .catch(error => {
                    notifier.alert("Le contexte n'a pas pu être mis à jour.");
                })
        },

    },


    template:`<div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="min-width: 700px;">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Mettre à jour un contexte</h4>
                <button type="button" class="close" v-on:click="cancelCreation()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
              <label for="contextName">Nom du contexte : </label><br />
                <div v-bind:class="{ 'form-error': isDisabled, 'form-group':true  }">
                <input class="form-control" type="text" v-on:input="updateContextName" name="contextName" id="contextName" ref="contextName"  placeholder="Nom..."/><br />
                <p class="color-error" v-if="isDisabled">Le contexte existe déjà.</p>
                </div>
                <br /><br />
                <label for="contextSelector">Contexte parent : </label><br />
                <select class="form-control" v-on:change="updateContextName" id="contextSelector" ref="contextSelector">                  
                  <option name="contextSelector" v-if="context.parentContext" :value="context.parentContext.id">{{context.parentContext.name}} (Actuel)</option>
                  <option name="contextSelector" value="none">Aucun (racine)</option>
                  <option name="contextSelector" v-for="e in contexts" v-if="e.level<MAX_LEVEL-1" :value="e.id">{{e.name}}</option>
                </select>
                <br /><br />
                
                <label for="contextDescription">Description :</label><br />
                <textarea name="contextDescription" id="contextDescription" ref="contextDescription">{{context.description}}</textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelCreation()">Annuler</button>
                <button type="button" class="btn btn-success" ref="button" data-dismiss="modal" v-on:click="createContext()">Mettre à jour le contexte</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`


});