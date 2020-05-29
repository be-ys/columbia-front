<script>

    import definitionEditor from "./definitionEditor"
    import warningBeforeImportModal from "./warningBeforeImportModal";

    export default {
        components: {
            definitionEditor,
            warningBeforeImportModal
        },

        props: ["data", "filename"],

        data(){
            return {
                form: {
                    forceUpdate: false,
                    contextId : 0,
                },
                selectedTerm: -1,
                displayall:true,
                editableData: []
            }
        },

        created() {
            this.editableData = this.$props.data;
        },

        computed: {
            user() {
                return this.$store.state.user;
            },
            dataToDisplay() {
                if(this.displayall) {
                    return this.editableData;
                }
                return this.editableData.filter(e => e.term.text.length<=0 || e.def.length<=0);
            }
        },

        watch: {
            displayall : function(){this.selectedTerm=-1;}
        },

        methods: {
            sendAll() {
                this.$emit("done", JSON.stringify(this.form), JSON.stringify(this.editableData));
            },

            doUpdate(field, val) {
                this.dataToDisplay[this.selectedTerm][field] = val;
            },


            //Only for display. Some hacks.
            isSelected(index){
                return index === this.selectedTerm;
            },

            isValid(term){
                if(this.displayall){
                    return true;
                }
                return ((term.term.text.length === 0 || term.definition.length ===0 ) && !this.displayall);
            }

        }
    }


</script>


<template>
<div>
    <div style="font-size:14px;display: flex; justify-content: space-between; margin-bottom: 10px;">
        <div>
            <p v-html="$t('csvImporter.editor.editor.fileInfo', [filename, data.length])"/>

            <b-form-checkbox id="checkbox-1" v-model="form.forceUpdate" name="checkbox-1">
                <span id="randomIdDescriptor"><span class="fas fa-info" id=""></span> {{$t('csvImporter.editor.editor.forceUpdateCheckbox')}}</span>
            </b-form-checkbox>

            <b-tooltip placement="right" target="randomIdDescriptor" triggers="hover">
                {{$t('csvImporter.editor.editor.forceUpdateTooltip')}}
            </b-tooltip>
        </div>

        <div>
            <div style="font-size:14px;display: flex; margin-bottom: 10px; align-items: center; vertical-align: center">
                <div style="padding-right: 15px;">
                    {{$t('csvImporter.editor.editor.importIn')}}
                </div>
                <div>
                    <b-form-select v-model="form.contextId" class="mb-3" style="margin-bottom: 0 !important;">
                        <b-form-select-option :value="0" disabled>{{$t('csvImporter.editor.editor.selectorDefault')}}</b-form-select-option>
                        <b-form-select-option v-for="i in user.parsedGrantedContexts" :value="i.id" v-bind:key="i.id">{{i.name}}</b-form-select-option>
                    </b-form-select>
                </div>
            </div>
        </div>
    </div>

    <br />
    <b-form-group>
        <b-form-radio-group id="radio-group-2" v-model="displayall" name="radio-sub-component">
            <b-form-radio :value="true">{{$t('csvImporter.editor.editor.displayAll')}}</b-form-radio>
            <b-form-radio :value="false">{{$t('csvImporter.editor.editor.displayErrors')}}</b-form-radio>
        </b-form-radio-group>
    </b-form-group>


    <div class="row p-0 mx-0 mt-3 mb-4 border bg-white" style="margin-top: 0 !important;">
        <div class="col-4 px-0 border-right-2">
            <ul class="list-group-dividered details">
                <li v-for="(e, index) in editableData" v-bind:key="index"
                    :style="((isSelected(index)) ? 'background-color:#ccc;' : '') + ' ' + (isValid(e) ? '' : 'display:none;')">
                    <b-link v-on:click.stop="selectedTerm=index">
                        <p class="mb-0">
                            <span v-if="e.term.text.length>0 && e.definition.length>0" style="color:#009926"><i class="fas fa-check"></i></span>
                            <span v-else style="color:#d14"><i class="fas fa-exclamation-circle"></i></span>
                            <span class="semibold" style="padding-left: 10px;">{{e.term.text}}</span>
                        </p>
                    </b-link>
                </li>
            </ul>
        </div>

        <div class="col-8 details py-2">
            <div v-if="selectedTerm===-1"> <p>{{$t('csvImporter.editor.editor.pleaseSelectTerm')}}</p> </div>
            <definition-editor v-else :data="editableData[selectedTerm]" @editedTerm="doUpdate(...arguments)"></definition-editor>
        </div>
    </div>

    <button class="btn btn-success" style="float: right;" v-on:click="$refs.importModal.display()" :disabled="form.contextId===0">{{$t('csvImporter.editor.editor.importButton')}}</button>
    <warning-before-import-modal ref="importModal" @startimport="sendAll()"></warning-before-import-modal>
</div>
</template>