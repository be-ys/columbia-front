<script>
    import tagsInput from "../../editors/tagsInput";

    export default {
        components: {
            tagsInput
        },

        props: ["data"],

        methods: {
            update: function(type, arg){
                this.$emit('editedTerm', type, arg);
            }
        }
    }
    </script>
<template>
<div>

    <b-form-checkbox id="checkbox-rgpd" v-model="data.gdpr" name="checkbox-rgpd" v-on:change="update('gdpr', data.gdpr)">
        {{$t('editors.definition.edit.gdprDescription')}}
    </b-form-checkbox>

    <b-form-textarea id="textarea" v-model="data.definition" :placeholder="$t('words.definition')" rows="3" v-on:input="update('definition', data.definition)"></b-form-textarea>
    <hr>
    <tags-input :displayText="$t('words.synonyms')" :search="true" :tags="data.synonymsTermList" @update="update('synonymsTermList', ...arguments)" ></tags-input>
    <hr>
    <tags-input :displayText="$t('words.antonyms')" :search="true" :tags="data.antonymsTermList" @update="update('antonymsTermList', ...arguments)" ></tags-input>
    <hr>
    <tags-input :displayText="$t('words.relatedTerms')" :search="true" :tags="data.relatedTermList" @update="update('relatedTermList', ...arguments)" ></tags-input>
    <hr>
    <tags-input :displayText="$t('words.sources')" :search="false" :tags="data.sources" @update="update('sources', ...arguments)" ></tags-input>
    <hr>
    <tags-input :displayText="$t('words.bibliography')" :search="false" :tags="data.bibliography" @update="update('bibliography', ...arguments)" ></tags-input>
    <hr>
</div></template>