Vue.component('exampleCSVModal', {
    methods: {
        closeModal: function(){
            this.$emit('close');
        },
    },

    template:`
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog" style=" min-width: 940px;">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Exemple de fichier CSV</h4>
                <button type="button" class="close" v-on:click="closeModal()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                Prenons l'exemple suivant :
                <table class="table-bordered">
                  <thead>
                      <td><b>Terme</b></td>
                      <td><b>Définition</b></td>
                      <td><b>Abréviations</b></td>
                      <td><b>Synonymes</b></td>
                      <td><b>Antonymes</b></td>
                      <td><b>Termes liés</b></td>
                      <td><b>Sources</b></td>
                      <td><b>Bibliographie</b></td>
                      <td><b>RGPD</b></td>
                  </thead>
                  <tr>
                    <td>Caisse Primaire</td>
                    <td>La caisse par défaut</td>
                    <td>CP, CPAM</td>
                    <td></td>
                    <td>Caisse Secondaire</td>
                    <td>Santé, Sécurité Sociale</td>
                    <td></td>
                    <td></td>
                    <td>1</td>
                  </tr>
                </table>             
                Son export CSV sera :<br />
                <pre><code><b>"Terme";"Définition";"Abréviations";"Synonymes";"Antonymes";"Termes liés";"Sources";"Bibliographie";"RGPD"</b><br/> 
"Caisse Primaire";"La caisse par défaut";"CP,CPAM";"";"Caisse Secondaire";"Santé,Sécurité Sociale";"";"";,1</code></pre>
                 <b>Notes :</b>
                 <ul>
                  <li>Le format CSV d'Excel peut-être différent de l'exemple, mais pourra être lu par le système malgré tout.</li>
                  <li>Sous Excel : Fichier -> Enregistrer sous -> <b><u>CSV UTF-8</u></b>. </li>
                  <li>L'ordre des colonnes n'importe pas, tant que son intitulé est respecté.</li>
                  <li>Les colonnes "Terme" et "Définition" sont obligatoires. Les autres sont facultatives, mais permettent un meilleur remplissage du glossaire.</li>
                  <li>Les noms de colonnes (Terme, Définition, Abréviations, ...) ne sont pas modifiables et sensibles à la casse. Respectez-les, ou l'import plantera.</li>
                  <li>La colonne doit contenir 0 si le terme n'est pas RGPD, 1 s'il l'est; ou les valeurs "Oui" et "Non".</li>
                 </ul>
                 <div class="text-center">
                  <a href="/ressources/Exemple_Glossaire.xlsx" target="_blank" class="btn btn-secondary" style="margin:0">Télécharger un exemple</a>
                 </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"  v-on:click="closeModal()">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop show"></div>
      </div>`
});

Vue.component("editingTermImporter", {
    props:{
        index: Number
    },

    data(){
        return{
            definition:{},
        }
    },

    mounted(){
        this.definition=this.$parent.datafromcsv[this.$props.index];
    },

    watch: {
        index: function(){
            this.definition=JSON.parse(JSON.stringify(this.$parent.datafromcsv[this.$props.index]));
            this.$refs.rgpd.checked=this.$parent.datafromcsv[this.$props.index].rgpd;
            this.$nextTick();
        },
    },

    methods:{
      updateGdpr(){

          this.$emit('editedTerm', "rgpd", this.$refs.rgpd.checked);
      },
      updatedeftext(){
          this.$emit('editedTerm', "def", this.$refs.definition.value);

      },

      update: function(type, arg){
          this.$emit('editedTerm', type, arg);
      }
    },

    template:`
      <div>
        <input type="checkbox" id="rgpd" ref="rgpd" :checked="definition.rgpd" v-on:click="updateGdpr"/>
        <label for="rgpd"> Terme RGPD : Cochez la case si le terme implique un traitement de données personnelles.</label>
        <hr>  
        <textarea ref="definition" id="definition" type="text"  v-on:input="updatedeftext" :value="definition.def" placeholder="Définition..."></textarea>
        <hr>     
        <tagsinput displayText="Synonymes" :search="true" :tags="definition.syn" @update="update('syn', ...arguments)" ></tagsinput>
        <hr>
        <tagsinput displayText="Antonymes" :search="true" :tags="definition.ant" @update="update('ant', ...arguments)" ></tagsinput>
        <hr>
        <tagsinput displayText="Termes connexes" :search="true" :tags="definition.rel" @update="update('rel', ...arguments)" ></tagsinput>
        <hr>
        <tagsinput displayText="Sources" :search="false" :tags="definition.sou" @update="update('sou', ...arguments)" ></tagsinput>
        <hr>
        <tagsinput displayText="Bibliographie" :search="false" :tags="definition.bib" @update="update('bib', ...arguments)" ></tagsinput>                     
        <hr>
      </div>`
});

Vue.component('warningimportmodal', {
    methods: {
        startImport: function(){
            this.$emit('startImport');
        },

        cancelImport: function(){
            this.$emit('cancelImport');
        },
    },

    template:`
      <div>
        <div class="modal show" style="display:block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Importer le fichier</h4>
                <button type="button" class="close" v-on:click="cancelImport()" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">
                <p>
                  <b>Attention</b> : Une fois l'opération démarrée, il est impossible de l'arrêter. Assurez-vous que tout les termes 
                  saisis sont corrects, et que votre paramétrage est valide.<br />
                  Une fois l'opération terminée, cette page se mettra à jour pour afficher un récapitulatif des opérations effectuées.
                </p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"  v-on:click="cancelImport()">Annuler</button>
                <button type="button" class="btn btn-success" data-dismiss="modal" v-on:click="startImport()">Importer le fichier</button>
              </div>
            </div>
          </div>            
        </div>
        <div class="modal-backdrop show"></div>
      </div>`
});


Vue.component("dropzone", {
    mounted(){
        document.getElementById("dz").addEventListener("dragleave", function (e) {
            e.preventDefault();
        });

        document.getElementById("dz").addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        document.getElementById("dz").addEventListener('click', function (e) {
            document.getElementById("inputId").click();
        });

        document.getElementById("dz").addEventListener("drop",  e => {
            e.preventDefault();
            this.$emit('updated', e.dataTransfer.files);
        });
    },


    methods:{
        update: function(){
            this.$emit('updated', this.$refs.inputId.files);
        }
    },

    template:`<div>
<input id="inputId" type="file" ref="inputId" style="display:none" @change="update">
<div id="dz" class="dz-default dz-message">
        <div id="textnode">Glisser/Déposer le document ou choisir un document...</div>
      </div></div>`

});

const ImportCSV = Vue.component("importcsv", {
    data(){
        return {
            displayexample:false,
            displaynotice:true,
            datafromcsv:[],
            metafromcsv:{},
            filename:"",
            displayall:true,
            selectedTerm:-1,
            importready:false,
            startimport:false,
            finishedimport:false,
            errors:0,
            importresults:[],
            fatalerror:false,
            badcsv:false,
        }
    },

    methods: {
        sendToServer(){
            //Envoi des données au proxy.
            let objToSend={};
            objToSend.context={id:this.$refs.contextSelector.value};
            objToSend.bypass=this.$refs.bypass.checked;
            objToSend.definitions=this.datafromcsv;

            axios.post("/csvimport", objToSend, {headers: { Authorization: localStorage.token}})
                .then(response => {
                    this.importresults=response.data;
                    this.finishedimport=true;
                    response.data.forEach( e => {
                        if(e.status==="error"){
                            this.errors+=1;
                        }
                    });
                })
                .catch(error => {
                    this.fatalerror=true;
                })
                .finally( f => {
                    this.$root.$emit('updateAll');
                });
        },

        parsedata(file, callBack){
            Papa.parse(file, {
                encoding:"UTF-8",
                header: true,
                delimiter: ";",
                transformHeader:function(h){
                    if(h.toLowerCase()=="terme") return 'term';
                    if(h.toLowerCase()=="définition") return 'def';
                    if(h.toLowerCase()=="rgpd") return 'rgpd';
                    if(h.toLowerCase()=="abréviations") return 'abbr';
                    if(h.toLowerCase()=="synonymes") return 'syn';
                    if(h.toLowerCase()=="antonymes") return 'ant';
                    if(h.toLowerCase()=="termes liés") return 'rel';
                    if(h.toLowerCase()=="sources") return 'sou';
                    if(h.toLowerCase()=="bibliographie") return 'bib';
                    return h;
                },
                skipEmptyLines:true,
                complete: function(results) {
                    callBack(results);
                }
            });


        },

        parseStringToArray(array){
            array=array.split(',');
            //Passage en objet
            let temp=[];
            array.forEach( e => {
                if(e.length>=2){
                    temp.push({text: e});
                }
            });
            return temp;
        },

        onFinish(data){
            this.datafromcsv=data.data;
            this.metafromcsv=data.meta;
            if(!data.meta.fields.includes("def") || !data.meta.fields.includes("term")){
                this.datafromcsv=[];
                this.metafromcsv={};
                this.displaynotice=true;
                this.badcsv=true;
            }
            else {
                this.badcsv=false;
                for(let i=0; i<this.datafromcsv.length; i++){
                    if(!this.datafromcsv[i].term || this.datafromcsv[i].term.length===0){
                        this.datafromcsv.splice(i,1);
                        i-=1;
                    }
                }

                //Parsing des données
                for(let i=0; i<this.datafromcsv.length; i++){
                    if(!this.datafromcsv[i].def){
                        this.datafromcsv[i].def="";
                    }
                    if(!this.datafromcsv[i].abbr){
                        this.datafromcsv[i].abbr="";
                    }
                    if(!this.datafromcsv[i].rgpd){
                        this.datafromcsv[i].rgpd=false;
                    }
                    if(!this.datafromcsv[i].syn){
                        this.datafromcsv[i].syn="";
                    }
                    if(!this.datafromcsv[i].ant){
                        this.datafromcsv[i].ant="";
                    }
                    if(!this.datafromcsv[i].rel){
                        this.datafromcsv[i].rel="";
                    }
                    if(!this.datafromcsv[i].sou){
                        this.datafromcsv[i].sou="";
                    }
                    if(!this.datafromcsv[i].bib){
                        this.datafromcsv[i].bib="";
                    }

                    this.datafromcsv[i].sou=this.datafromcsv[i].sou.replace(/, /g, ",");
                    this.datafromcsv[i].sou=this.datafromcsv[i].sou.replace(/ ,/g, ",");
                    this.datafromcsv[i].bib=this.datafromcsv[i].bib.replace(/, /g, ",");
                    this.datafromcsv[i].bib=this.datafromcsv[i].bib.replace(/ ,/g, ",");
                    this.datafromcsv[i].syn=this.datafromcsv[i].syn.replace(/, /g, ",");
                    this.datafromcsv[i].syn=this.datafromcsv[i].syn.replace(/ ,/g, ",");
                    this.datafromcsv[i].ant=this.datafromcsv[i].ant.replace(/, /g, ",");
                    this.datafromcsv[i].ant=this.datafromcsv[i].ant.replace(/ ,/g, ",");
                    this.datafromcsv[i].rel=this.datafromcsv[i].rel.replace(/, /g, ",");
                    this.datafromcsv[i].rel=this.datafromcsv[i].rel.replace(/ ,/g, ",");
                    this.datafromcsv[i].abbr=this.datafromcsv[i].abbr.replace(/, /g, ",");
                    this.datafromcsv[i].abbr=this.datafromcsv[i].abbr.replace(/ ,/g, ",");
                    this.datafromcsv[i].term=this.datafromcsv[i].term.trim();

                    this.datafromcsv[i].rgpd=(this.datafromcsv[i].rgpd==1||this.datafromcsv[i].rgpd=="oui"||this.datafromcsv[i].rgpd=="Oui"||this.datafromcsv[i].rgpd=="OUI");
                    this.datafromcsv[i].term={text: this.datafromcsv[i].term};
                    this.datafromcsv[i].abbr=this.datafromcsv[i].abbr.split(',');
                    this.datafromcsv[i].syn=JSON.parse(JSON.stringify(this.parseStringToArray(this.datafromcsv[i].syn)));
                    this.datafromcsv[i].ant=JSON.parse(JSON.stringify(this.parseStringToArray(this.datafromcsv[i].ant)));
                    this.datafromcsv[i].sou=JSON.parse(JSON.stringify(this.parseStringToArray(this.datafromcsv[i].sou)));
                    this.datafromcsv[i].bib=JSON.parse(JSON.stringify(this.parseStringToArray(this.datafromcsv[i].bib)));
                    this.datafromcsv[i].rel=JSON.parse(JSON.stringify(this.parseStringToArray(this.datafromcsv[i].rel)));

                }
            }
        },

        readFiles(e) {
            let file = e[0];
            this.displaynotice = !file.name.endsWith('.csv');

            if(!this.displaynotice){
                this.filename=file.name;
                this.parsedata(file, this.onFinish);
            } else {
                this.badcsv=true;
            }
        },

        doUpdate(field, val){
          this.datafromcsv[this.selectedTerm][field]=val;
          this.$nextTick();
        },
    },

    watch:{
        startimport: function(){if(this.startimport===true){this.sendToServer()}},
    },

    computed: {
        contextSelector() {return this.$refs.contextSelector.value;},
        bypass() {return this.$refs.bypass.checked;},
        user() { return this.$store.state.user}
    },


    template: `
      <div>
      
        <div class="card card-bordered"  v-if="user.connected && (user.role=='Admin' || user.role=='Glossateur') ">
          <div class="card-header">
            <h3 class="card-title">Importer un fichier CSV</h3>
          </div>
      
          <div class="card-body">
            <div v-if="displaynotice">
              <h5 class="uppercase">Notice d'utilisation</h5>
              <p>Envoyez un fichier au format .csv, contenant les définitions. Les valeurs doivent être séparées par des <b>virgules</b>, 
                et les données textuelles doivent être entre <b>"guillemets"</b>. Les valeurs des champs abréviations, synonymes, antonymes, termes connexes, 
                sources et bibliographie doivent être séparés par des <b>virgules</b>. Les entêtes doivent êtres fournis.</p>
              <button @click="displayexample=true" class="btn btn-primary">Cliquez ici pour voir un exemple (<i>Fortement recommandé</i>)</button>
              <br /><p>L'import d'un fichier CSV peut potentiellement prendre du temps. Merci de ne pas fermer la fenêtre du navigateur pendant les opérations.</p>
            </div>
            
            
            <dropzone v-if="displaynotice" @updated="readFiles"></dropzone>
                    
            
            <div v-if="displaynotice && badcsv">
            <div class="notifications notification-error" style="margin-top:20px;">
              <h5 class="uppercase">Erreur de chargement !</h5>
              <p>Le fichier CSV envoyé ne respecte pas les consignes d'importation. Veuillez consulter la documentation et mettre à jour votre fichier avant de réessayer.</p>
            </div>
</div>
            
            <div v-if="!displaynotice && !startimport">
              <div style="font-size:14px;display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                  <p>
                    Fichier : <b> {{filename}} </b><br />
                    {{datafromcsv.length}} définitions<br />
                  </p>
                  <input type="checkbox" id="bypass" ref="bypass"/>
              
                  <label for="bypass" style="margin-top: -20px;">
                    <span data-toggle="tooltip" data-placement="right"  
                      v-tooltip:right="'Lorsque cette case est cochée, toute les anciennes définitions du contexte en conflit avec les nouvelles seront écrasées. A utiliser avec la plus grande précaution.'" 
                      style="padding-left:5px; font-size: 14px;"><span class="fas fa-info" style="padding-left:5px; padding-right:10px;"></span> Ecraser les défintions
                    </span>
                  </label>
                </div>
                <div>
                  <div style="font-size:14px;display: flex; margin-bottom: 10px; align-items: center;">
                    <div>
                      Importer dans : 
                    </div>
                    <div>
                      <select class="form-control" ref="contextSelector">
                        <option v-for="i in user.parsedGrantedContexts" :value="i.id">{{i.name}}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
     
              <input type="radio" id="radio1" @click="displayall=true;selectedTerm=-1" name="radio-category"  checked="">
              <label for="radio1">Afficher tout</label>
     
              <input type="radio" id="radio2" name="radio-category"  @click="displayall=false;selectedTerm=-1">
              <label for="radio2">N'afficher que les erreurs</label>
                        
              <div class="row p-0 mx-0 mt-3 mb-4 border bg-white" style="margin-top: 0 !important;">
                <div class="col-4 px-0 border-right-2">
                  <ul class="list-group-dividered details" v-if="displayall">
                    <li v-for="e, index in datafromcsv">
                      <a v-on:click.stop="selectedTerm=index">
                        <p class="mb-0">
                          <span class="semibold">{{e.term.text}}</span> 
                          <span v-if="e.term.text.length>0 && e.def.length>0" style="color:#009926"><i class="fas fa-check"></i></span>
                          <span v-else style="color:#d14"><i class="fas fa-exclamation-circle"></i></span>
                        </p>
                      </a>
                    </li>
                  </ul>
                  <ul class="list-group-dividered details" v-else>
                    <li v-for="e, index in datafromcsv" v-if="e.term.text.length<=0 || e.def.length<=0">
                      <a v-on:click.stop="selectedTerm=index">
                        <p class="mb-0">
                          <span class="semibold">{{e.term.text}}</span> 
                          <span style="color:#d14"><i class="fas fa-exclamation-circle"></i></span>
                        </p>
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div class="col-8 details py-2">
                  <div v-if="selectedTerm==-1">
                    <p>Sélectionnez un terme à gauche pour l'éditer.</p>
                  </div>
                  <editingTermImporter v-else :index="selectedTerm" @editedTerm="doUpdate"></editingTermImporter>
                </div>
              </div>
                    
              <button class="btn btn-success" style="float: right;" v-on:click="importready=true">Importer les définitions</button>
              <warningimportmodal @startImport="importready=false;startimport=true;" @cancelImport="importready=false" v-if="importready"></warningimportmodal>
            </div>
                    
            <div v-if="startimport">
              <div v-if="!finishedimport && !fatalerror">
                <div class="text-center">
                  <h3>Import en cours...</h3>
                </div>
                <div class="spinkit spinkit-primary spinkit-large centered">
                  <div class="double-bounce1"></div>
                  <div class="double-bounce2"></div>
                </div>
              </div>
              <div v-else>
                <div v-if="finishedimport">
                  <div class="text-center">
                    <h3>L'import est terminé.</h3>
                    <h4>{{importresults.length}} définitions envoyées, {{errors}} erreurs.</h4>
                  </div>
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Ligne</th>
                        <th>Terme</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="e, index in importresults" :class="'table-'+e.status">
                        <td class="v-align-middle">{{index+1}}</td>
                        <td class="v-align-middle">{{e.term}}</td>
                        <td class="v-align-middle">
                          <span v-if="e.status=='error'">La définition n'a pas pu être importée dans le glossaire.</span>
                          <span v-if="e.status=='created'">La définition a bien été ajoutée au glossaire.</span>
                          <span v-if="e.status=='updated'">La définition a bien été mise à jour.</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-if="fatalerror">
                <div class="notifications notification-error" style="width: 100%">
                  <h5 class="uppercase">Erreur fatale</h5>
                  <p>Une erreur fatale est survenue lors de l'importation, ayant empêchée tout ou partie du processus de se réaliser. <br />
                    Nous vous invitons à retenter l'importation ultérieurement.<br /><br />
                    Si le problème persiste, contactez le support (lien dans le bas de page).
                  </p>
                </div>
              </div>
            </div>
          </div>
          <exampleCSVModal @close="displayexample=false" v-if="displayexample"></exampleCSVModal>
        </div>
        <div v-else class="card card-bordered">
        <div class="card-header">
              <h3 class="card-title">Erreur de chargement</h3>
            </div>
            <div class="card-body">
              Il semblerait que vous ne soyiez pas connecté, ou que vous n'avez pas les droits d'accès à cette page. Revenez ici une fois connecté.
            </div>
          
        </div>
      </div>`
});