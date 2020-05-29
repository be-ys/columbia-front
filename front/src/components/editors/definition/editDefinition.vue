<script>

    import tagsInput from "../tagsInput";
    export default {
        components: {
            tagsInput
        },
        props: ['def'],

        data() {
            return {
                editingDefinition: JSON.parse(JSON.stringify(this.$props.def)),
                show: false,
            }
        },

        mounted() {
            this.editingDefinition.synonymsTermList = this.editingDefinition.synonymsTermList.map(e => { return {text: e.name}});
            this.editingDefinition.antonymsTermList = this.editingDefinition.antonymsTermList.map(e => { return {text: e.name}});
            this.editingDefinition.relatedTermList = this.editingDefinition.relatedTermList.map(e => { return {text: e.name}});
            this.editingDefinition.sources = this.editingDefinition.sources.map(e => { return {text: e}});
            this.editingDefinition.bibliography = this.editingDefinition.bibliography.map(e => { return {text: e}});
        },

        methods: {
            updateDefinition: function () {
                console.log(JSON.stringify(this.editingDefinition));
                this.axios.put(process.env.VUE_APP_FRONT_BACKEND+"/definition", this.editingDefinition, {headers: {Authorization: localStorage.token}})
                    .then(() => {
                        this.$awn.success(this.$t("editors.definition.edit.toaster.updated"));
                        this.$emit('updated');
                        this.show=false;
                    })
                    .catch(() => {
                        this.$awn.alert(this.$t("editors.definition.edit.toaster.updateError"));
                    })
            },

            update: function (type, arg) {
                this.editingDefinition[type] = arg;
            },

            display() {
                this.show = true;
            },
        },
    }
    </script>

<template>
    <b-modal id="bv-modal-example" size="lg"  hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('editors.definition.edit.title', [def.term.name, def.context.name])}}</template>


        <b-form @submit.prevent="updateDefinition">

            <b-form-checkbox id="checkbox-1" v-model="editingDefinition.gdpr" name="checkbox-1">
                {{$t('editors.definition.edit.gdprDescription')}}
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
                <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('editors.definition.edit.cancelButton')}}</b-button>
                <span style="margin-right: 20px;"/>
                <b-button class="mt-3 btn-info" type="submit">{{$t('editors.definition.edit.updateButton')}}</b-button>
            </div>
        </b-form>
    </b-modal>
</template>