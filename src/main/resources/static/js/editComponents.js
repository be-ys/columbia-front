Vue.component('tagsinput', {
    props:['tags', 'displayText', 'search'],

    data(){
        return{
            tag:'',
            autocompleteItems:[],
        }
    },

    watch:{
        'tag': 'searchTags',
        'tags':'cleanup',
    },

    methods:{
        cleanup: function(){
            this.tag="";
        },

        searchTags: function(){
            this.autocompleteItems = [];
            if(this.$props.search && this.tag.length > 2) {
                axios.get("/api/terms/?search=".concat(this.tag).concat("*"))
                    .then(response => {
                        response.data.content.forEach( e => {
                            this.autocompleteItems.push({text: e.name});
                        });
                    })
            }
        },

        updates: function(newTags){
            this.$emit('update', newTags);
        }
    },

    template:`
      <div class="terminput">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width:170px;">{{displayText}}</span>
        </div>
        <vue-tags-input class="vue-tags-input light ti-focus" style="max-width: 100% !important; width:100% !important;" v-model="tag" placeholder="Ajouter..."
          :tags="tags" :autocomplete-items="autocompleteItems" :add-only-from-autocomplete="false" @tags-changed="updates"/>
      </div>`,
});

Vue.component('createTerm', {
    props:['termName'],

    data(){
        return {
            tagsAbbreviation: [],
        }
    },

    methods: {
        createTerm: function(){
            let objectToSend = {
                name: this.$props.termName,
                abbreviations: [],
            };
            this.tagsAbbreviation.forEach(e => objectToSend.abbreviations.push(e.text));

            axios.post("/api/terms", objectToSend, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("Le terme a été créé.");
                    this.$root.$emit('update', 'terms', 1);
                    this.$emit('created');
                })
                .catch(error => {
                    notifier.alert("Le terme n'a pas pu être créé.");
                })
        },

        cancelCreation: function(){
            this.$emit('canceled');
        },

        update: function(type, arg){
            this.tagsAbbreviation=arg;
        }
    },

    template:`
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Créer un terme</h4>
                <button type="button" class="close" v-on:click="cancelCreation()" data-dismiss="modal">&times;</button>
              </div>
            <div class="modal-body">
              <input class="form-control" type="text" disabled :value="termName"/>                
              <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 20px;">
                <tagsinput displayText="Abréviations" :search="false" @update="update('abb', ...arguments)" ></tagsinput>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelCreation()">Annuler</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="createTerm()">Créer le terme</button>
            </div>  
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>`
});

Vue.component("deleteDefinitionModal", {
    props:['def'],

    methods:{
        deleteDefinition: function(){
            axios.delete("/api/contexts/".concat(this.def.context.id).concat("/terms/").concat(this.def.term.id), {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("La définition a bien été supprimé.");
                    this.$root.$emit('update', 'definitions', -1);
                    this.$emit('deleted');
                })
                .catch(error => {
                    notifier.alert("La définition n'a pas pu être supprimée.");
                });
        },
        cancelDeletion: function(){
            this.$emit('canceled')
        }
    },

    template:`
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Supprimer la définition</h4>
                <button type="button" class="close" v-on:click="cancelDeletion()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                Voulez vous supprimer la définition du terme {{def.term.name}} dans le contexte {{def.context.name}} ? Cette action est irréversible.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelDeletion()">Annuler</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteDefinition()">Supprimer</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`
});


Vue.component("editDefinitionModal", {
    props:['def'],

    data(){
        return{
            editingdefinition:JSON.parse(JSON.stringify(this.$props.def)),
        }},

    mounted(){
        $('*').popover('hide');
        $('[data-toggle="tooltip"]').tooltip();

        let temp=[];
        this.editingdefinition.synonymsTermList.forEach(e => temp.push({ text : e.name}));
        this.editingdefinition.synonymsTermList=JSON.parse(JSON.stringify(temp));

        temp=[];
        this.editingdefinition.antonymsTermList.forEach(e => temp.push({ text : e.name}));
        this.editingdefinition.antonymsTermList=JSON.parse(JSON.stringify(temp));

        temp=[];
        this.editingdefinition.relatedTermList.forEach(e => temp.push({ text : e.name}));
        this.editingdefinition.relatedTermList=JSON.parse(JSON.stringify(temp));

        temp=[];
        this.editingdefinition.sources.forEach(e => temp.push({ text : e}));
        this.editingdefinition.sources=JSON.parse(JSON.stringify(temp));

        temp=[];
        this.editingdefinition.bibliography.forEach(e => temp.push({ text : e}));
        this.editingdefinition.bibliography=JSON.parse(JSON.stringify(temp));
    },

    methods:{
        cancelUpdate: function(){
            this.$emit('canceled');
        },

        updateDefinition: function(){
            //Envoi et traitement en proxy.
            axios.put("/updateDefinition", this.editingdefinition, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("La définition a bien été mise à jour.");
                    this.$emit('updated');
                })
                .catch(error => {
                    notifier.alert("La définition n'a pas pu être mise à jour.");
                })
        },

        updatedeftext: function(){
            this.editingdefinition.definition = this.$refs.definition.value;
            this.$refs.createButton.disabled=(!this.editingdefinition.definition.length>0);
        },

        updateGdpr: function(){
            this.editingdefinition.gdpr = document.getElementById("gdpr").checked;
        },

        update: function(type, arg){
            this.editingdefinition[type]=arg;
        }
    },

    template:`
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="max-width: 1000px;">
            <div class="modal-content" >
              <div class="modal-header">
                <h4 class="modal-title">Éditer la définition - {{def.term.name}} dans {{def.context.name}} </h4>
                <button type="button" class="close" v-on:click="cancelUpdate()" data-dismiss="modal">&times;</button>
              </div>
              
              <div class="modal-body">
                <input type="checkbox" :checked="editingdefinition.gdpr" id="gdpr" v-on:change="updateGdpr"/>
                <label for="gdpr">Terme RGPD : Cochez la case si le terme implique un traitement de données personnelles.</label>

                <hr>
                <textarea ref="definition" id="definition" type="text" v-on:input="updatedeftext"  :value="editingdefinition.definition" placeholder="Définition..."></textarea>
                <hr>
                 
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Synonymes" :search="true" :tags="editingdefinition.synonymsTermList" @update="update('synonymsTermList', ...arguments)" ></tagsinput>
                  <hr>     
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Antonymes" :search="true" :tags="editingdefinition.antonymsTermList" @update="update('antonymsTermList', ...arguments)" ></tagsinput>
                  <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Termes connexes" :search="true" :tags="editingdefinition.relatedTermList" @update="update('relatedTermList', ...arguments)" ></tagsinput>
                  <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Sources" :search="false" :tags="editingdefinition.sources" @update="update('sources', ...arguments)" ></tagsinput>
                  <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Bibliographie" :search="false" :tags="editingdefinition.bibliography" @update="update('bibliography', ...arguments)" ></tagsinput>                     
                  <hr>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"  v-on:click="cancelUpdate()">Annuler les modifications</button>
                <button type="button" class="btn btn-success" data-dismiss="modal" ref="createButton" v-on:click="updateDefinition()">Mettre à jour la définition</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop show"></div>
      </div>`
});


Vue.component('createDefinition', {
    props:['termId', 'termName', 'contexts'],

    data(){
        return{
            editingdefinition:{
                gdpr: false,
                definition: "",
                synonymsTermList: [],
                antonymsTermList: [],
                relatedTermList: [],
                sources: [],
                bibliography: [],
            },
        }},

    methods:{
        cancelCreation: function(){
            this.$emit('canceled');
        },

        createDefinition: function(){
            this.editingdefinition.context={id:this.$refs.contextSelector.value};
            this.editingdefinition.term={id:this.$props.termId};
            //Envoi et traitement en proxy.
            axios.post("/createDefinition", this.editingdefinition, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("La définition a bien été créée.");
                    this.$root.$emit('update', 'definitions', 1);
                    this.$emit('created');
                })
                .catch(error => {
                    notifier.alert("La définition n'a pas pu être créée.");
                })
        },

        updatedeftext: function(){
            this.editingdefinition.definition = this.$refs.definition.value;
            this.$refs.createButton.disabled=(!this.editingdefinition.definition.length>0);
        },

        updateGdpr: function(){
            this.editingdefinition.gdpr = document.getElementById("gdpr").checked;
        },

        update: function(type, arg){
            this.editingdefinition[type]=arg;
        }

    },

    mounted(){
        $('*').popover('hide');
        $('[data-toggle="tooltip"]').tooltip();
    },

    template:`
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style="max-width: 1000px;">
            <div class="modal-content" >
              <div class="modal-header">
                <h4 class="modal-title">Créer une définition pour le terme {{termName}} </h4>
                <button type="button" class="close" v-on:click="cancelCreation()" data-dismiss="modal">&times;</button>
              </div>
              
              <div class="modal-body">
                <label for="contextSelector">Contexte de la définition : </label>
                <select class="form-control" id="contextSelector" ref="contextSelector">
                  <option name="contextSelector" v-for="e in contexts" :value="e.id">{{e.name}}</option>
                </select>
                <input type="checkbox" :checked="editingdefinition.gdpr" id="gdpr" v-on:change="updateGdpr"/>
                <label for="gdpr">Terme RGPD : Cochez la case si le terme implique un traitement de données personnelles.</label>
                <hr>
              
                <textarea ref="definition" id="definition" type="text"  v-on:input="updatedeftext"  :value="editingdefinition.definition" placeholder="Définition..."></textarea>
                <hr>
                 
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Synonymes" :search="true" :tags="editingdefinition.synonymsTermList" @update="update('synonymsTermList', ...arguments)" ></tagsinput>
                  <hr>     
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Antonymes" :search="true" :tags="editingdefinition.antonymsTermList" @update="update('antonymsTermList', ...arguments)" ></tagsinput>
                  <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Termes connexes" :search="true" :tags="editingdefinition.relatedTermList" @update="update('relatedTermList', ...arguments)" ></tagsinput>
                  <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Sources" :search="false" :tags="editingdefinition.sources" @update="update('sources', ...arguments)" ></tagsinput>
                  <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                  <tagsinput displayText="Bibliographie" :search="false" :tags="editingdefinition.bibliography" @update="update('bibliography', ...arguments)" ></tagsinput>                     
                  <hr>
                </div>
              </div>
        
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"  v-on:click="cancelCreation()">Annuler</button>
                <button type="button" class="btn btn-success" data-dismiss="modal" ref="createButton" disabled v-on:click="createDefinition()">Créer la définition</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop show"></div>
      </div>`
});

Vue.component('deletetermmodal', {
    props:['term'],

    computed: {
        user() { return this.$store.state.user; },
    },

    methods: {
        cancelDeletion: function(){
           this.$emit('canceled');
        },

        deleteTerm: function(){
            axios.delete("/api/terms/".concat(this.$props.term.id), {headers: { Authorization: localStorage.token}})
                .then(() => {
                    notifier.success("Le terme a bien été supprimé.");
                    this.$root.$emit('update', 'terms', -1);
                    this.$emit('deleted');
                })
                .catch(error => {
                    notifier.alert("Le terme n'a pas pu être supprimé.");
                })
        }
    },

    template: `
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Supprimer le terme</h4>
                <button type="button" class="close" v-on:click="cancelDeletion()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                Voulez vous supprimer le terme {{term.name}} ? Cette action est irréversible et supprimera toutes les définitions associées.
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelDeletion()">Annuler</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteTerm()">Supprimer</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`,

});

Vue.component('edittermmodal', {
    props:['term'],

    data(){
        return{
            editable:true,
            termEdition:JSON.parse(JSON.stringify(this.$props.term)),
        }
    },

    computed: {
        user() { return this.$store.state.user; },
    },

    mounted(){
        //Parsing des abréviations pour le tagsInput.
        let temp=[];
        this.termEdition.abbreviations.forEach(e => temp.push({text: e}));
        this.termEdition.abbreviations=temp;
    },

    watch:{
      'editable': 'updateForm',
    },

    methods:{
      cancelEdition: function() {
          this.$emit('canceled');
      },
      updateTerm: function(){
        //Envoi serveur.
          let temp=[];
          this.termEdition.abbreviations.forEach(e => temp.push(e.text));
          this.termEdition.abbreviations = temp;

          axios.put("/api/terms/".concat(this.termEdition.id), this.termEdition, {headers: { Authorization: localStorage.token}})
              .then(() => {
                  notifier.success("Le terme a bien été mis à jour.");
                  this.$emit('updated', this.termEdition.name);
              })
              .catch(error => {
                  notifier.alert("Le terme n'a pas pu être mis à jour.");
              })

      },

      update: function(args){
        this.termEdition.abbreviations=args;
      },

      search: function(){
          axios.get("/api/terms/?search=".concat(this.termEdition.name))
              .then(response => {
                  this.editable=(response.data.content.length <= 0 || response.data.content[0].id===this.termEdition.id);
              })
      },

      deb: function(){
          this.termEdition.name=this.$refs.termName.value;
          this.editable=false;
          this.debo();
      },

        debo: _.debounce(function() { this.search(); }, 600),

        updateForm: function(){
          if(!this.editable){
              this.$refs.termNameGroup.classList.add("form-error");
          } else {
              this.$refs.termNameGroup.classList.remove("form-error");
          }
        },
    },

    template:`<div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Éditer un terme</h4>
                <button type="button" class="close" v-on:click="cancelEdition()" data-dismiss="modal">&times;</button>
              </div>
            <div class="modal-body">
              <div class="form-group" ref="termNameGroup">
              <input class="form-control" type="text" ref="termName" :value="termEdition.name" v-on:input="deb"/>         
              <p v-if="!editable">Ce terme existe déjà dans la base de données.</p>
              </div>       
              <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 20px;">
                <tagsinput displayText="Abréviations" :tags="termEdition.abbreviations" :search="false" @update="update(...arguments)" ></tagsinput>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelEdition()">Annuler</button>
              <button type="button" class="btn btn-success" data-dismiss="modal" v-if="editable" v-on:click="updateTerm()">Editer le terme</button>
            </div>  
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>`,


});

Vue.component('moveDefinitionModal', {
    props: ['def', 'avcontexts'],

    computed: {
        user() { return this.$store.state.user },
    },

    methods:{
        cancelMove: function() {
            this.$emit('canceled');
        },
        moveDefinition: function() {
            //MàJ.
            axios.post("/api/contexts/".concat(this.$refs.contextSelector.value).concat("/terms"), this.$props.def, {headers: { Authorization: localStorage.token}})
                .then(() => {
                    axios.delete("/api/contexts/".concat(this.$props.def.context.id).concat("/terms/").concat(this.$props.def.term.id), {headers: { Authorization: localStorage.token}})
                        .then(() => {
                            notifier.success("La définition a bien été déplacée.");
                            this.$emit('updated');
                        })
                        .catch(error => {
                            this.$emit('updated');
                            notifier.warning("La définition n'a pas pu être supprimée de l'ancien contexte.");
                        })
                })
                .catch(error => {
                    notifier.alert("La définition n'a pas pu être déplacée.");
                })


        },
    },

    mounted(){
        if (this.user.role!=='Admin'){
            this.cancelMove();
        }
    },

    template:`<div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Déplacer la définition</h4>
                <button type="button" class="close" v-on:click="cancelDeletion()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                Vous déplacez la définition du terme {{def.term.name}} du contexte {{def.context.name}}. Sélectionnez la nouvelle destination.
                <label for="contextSelector">Nouveau contexte de la définition : </label>
                <select class="form-control" id="contextSelector" ref="contextSelector">
                  <option name="contextSelector" v-for="e in avcontexts" :value="e.id">{{e.name}}</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancelMove()">Annuler</button>
                <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="moveDefinition()">Déplacer la définition</button>
              </div>        
            </div>
          </div>    
        </div>
        <div class="modal-backdrop show"></div>
      </div>`,
});