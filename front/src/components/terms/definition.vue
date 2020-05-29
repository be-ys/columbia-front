<script>
    import PopoverGenerator from "./utils/popoverGenerator";
    import moveDefinition from "../editors/definition/moveDefinition"
    import editDefinition from "../editors/definition/editDefinition"
    import deleteDefinition from "../editors/definition/deleteDefinition"
    import RelatedWordsGenerator from "./utils/relatedWordsGenerator";

    export default {
        components: {
            RelatedWordsGenerator,
            PopoverGenerator,
            moveDefinition,
            editDefinition,
            deleteDefinition
        },

        props: ['def', 'avcontexts'],

        computed: {
            user() {
                return this.$store.state.user;
            },
            config() {
                return this.$store.state.config;
            }
        },

        methods: {
            updateDefinition() {
                this.$emit('updated');
            }
        },
    }
</script>


<template>
    <div>
        <h3 style="margin-bottom: 15px;">
            <span class="label label-secondary">{{ def.context.name }}</span>
            <span v-if="def.gdpr" class="label label-error">{{$t("words.gdprTerm")}}</span>
            <span v-if="user.grantedContexts.map(e => e.id).includes(def.context.id)">
                <b-button v-on:click="$refs.em.display()" class="fas fa-pen resultlist-btn"/>
                <b-button v-on:click="$refs.dm.display()" class="fas fa-trash resultlist-btn"/>
                <b-button v-if="user.role===config.adminRole" v-on:click="$refs.mm.display()" class="fas fa-sign-out-alt resultlist-btn"/>
            </span>
        </h3>

        <p v-html="def.definitionHtml"/>

        <span v-if="def.synonymsTermList.length>0" class="infos">
            <related-words-generator :name="$t('words.synonyms')" :object="def.synonymsTermList"/>
        </span>

        <span v-if="def.antonymsTermList.length>0" class="infos">
            <related-words-generator :name="$t('words.antonyms')" :object="def.antonymsTermList"/>
        </span>

        <br/><br/>

        <span v-if="def.relatedTermList.length>0" class="infos">
            <related-words-generator :name="$t('words.relatedTerms')" :object="def.relatedTermList"/>
        </span>

        <span class="infos">
          <span v-if="def.sources.length>0">
                <popover-generator :content="def.sources" :name="$t('words.sources')"/>
          </span>

          <span v-if="def.bibliography.length>0">
              <popover-generator :content="def.bibliography" :name="$t('words.bibliography')"/>
          </span>
        </span>

        <deleteDefinition ref="dm" @deleted="updateDefinition" :def="def"/>
        <editDefinition ref="em" @updated="updateDefinition" :def="def"/>
        <move-definition ref="mm" @updated="updateDefinition" :def="def" :avcontexts="avcontexts"/>
        <hr>
    </div>
</template>