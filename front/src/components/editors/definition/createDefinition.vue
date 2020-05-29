<script>

    import tagsInput from "../tagsInput";
    export default {

        components: {
            tagsInput
        },
        props: ['termId', 'termName', 'contexts'],

        data() {
            return {
                editingDefinition: {
                    gdpr: false,
                    definition: "",
                    synonymsTermList: [],
                    antonymsTermList: [],
                    relatedTermList: [],
                    sources: [],
                    bibliography: [],
                    context: {id: 0},
                    term: {id: this.$props.termId}
                },
                show: false,
            }
        },

        methods: {

            display(){
                this.show=true;
            },

            createDefinition: function () {
                //Envoi et traitement en proxy.
                this.axios.post(process.env.VUE_APP_FRONT_BACKEND+"/definition", this.editingDefinition, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t('editors.definition.create.toaster.created'));
                        this.$root.$emit('update', 'definitions', 1);
                        this.$emit('created');
                        this.show=false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t('editors.definition.create.toaster.createError'));
                    })
            },

            update: function (type, arg) {
                this.editingDefinition[type] = arg;
            }

        },
    }
    </script>

<template>
        <b-modal id="bv-modal-example" size="lg"  hide-footer v-model="show">
            <template v-slot:modal-title>{{$t('editors.definition.create.title', [termName])}}</template>

            <b-form @submit.prevent="createDefinition">
                <b-form-select v-model="editingDefinition.context.id" class="mb-3" :label="$t('editors.definition.create.contextLabel')">
                    <b-form-select-option v-for="e in contexts" :value="e.id" v-bind:key="e.id">{{e.name}}</b-form-select-option>
                </b-form-select>
                <b-form-checkbox id="checkbox-1" v-model="editingDefinition.gdpr" name="checkbox-1">
                    {{$t('editors.definition.create.gdprDescription')}}
                </b-form-checkbox>
                <hr>
                <b-form-textarea id="textarea" v-model="editingDefinition.definition" :placeholder="$t('words.definition')" max-rows="6"/>
                <hr>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                    <tagsInput :displayText="$t('words.synonyms')" :search="true" :tags="editingDefinition.synonymsTermList" @update="update('synonymsTermList', ...arguments)"/>
                    <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                    <tagsInput :displayText="$t('words.antonyms')" :search="true" :tags="editingDefinition.antonymsTermList" @update="update('antonymsTermList', ...arguments)"/>
                    <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                    <tagsInput :displayText="$t('words.relatedTerms')" :search="true" :tags="editingDefinition.relatedTermList" @update="update('relatedTermList', ...arguments)"/>
                    <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                    <tagsInput :displayText="$t('words.sources')" :search="false" :tags="editingDefinition.sources" @update="update('sources', ...arguments)"/>
                    <hr>
                </div>
                <div class="" style="display: flex; flex-direction: row; width: 100%; margin-bottom: 5px;">
                    <tagsInput :displayText="$t('words.bibliography')" :search="false" :tags="editingDefinition.bibliography" @update="update('bibliography', ...arguments)"/>
                    <hr>
                </div>

                <div class="text-right">
                    <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.definition.create.cancelButton')}}</b-button>
                    <span style="margin-right: 20px;"/>
                    <b-button class="mt-3 btn-info" type="submit">{{$t('editors.definition.create.createButton')}}</b-button>
                </div>
            </b-form>
        </b-modal>
</template>