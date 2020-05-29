<script>

    import csvExample from "./csvExample";
    import dropzone from "./dropzone";


    let headerMapping = {};


    export default {

        components: {
            csvExample,
            dropzone
        },

        created() {
            headerMapping[this.$t('csvImporter.csvDefinition.term')]="term";
            headerMapping[this.$t('csvImporter.csvDefinition.definition')]="definition";
            headerMapping[this.$t('csvImporter.csvDefinition.gdpr')]="gdpr";
            headerMapping[this.$t('csvImporter.csvDefinition.abbreviations')]="abbreviations";
            headerMapping[this.$t('csvImporter.csvDefinition.synonymsTermList')]="synonymsTermList";
            headerMapping[this.$t('csvImporter.csvDefinition.antonymsTermList')]="antonymsTermList";
            headerMapping[this.$t('csvImporter.csvDefinition.relatedTermList')]="relatedTermList";
            headerMapping[this.$t('csvImporter.csvDefinition.sources')]="sources";
            headerMapping[this.$t('csvImporter.csvDefinition.bibliography')]="bibliography";
            console.log(headerMapping);
        },

        data(){
            return {
                badcsv: false,
                filename: null,
                datafromcsv: [],
                metafromcsv: {}
            }
        },

        methods: {
            readFiles(e) {
                let file = e[0];
                this.displaynotice = !file.name.endsWith('.csv');

                if (!this.displaynotice) {
                    this.filename = file.name;
                    this.parseData(file, this.onFinish);
                } else {
                    this.badcsv = true;
                }
            },

            parseData(file, callBack) {
                this.$papa.parse(file, {
                    encoding: "UTF-8",
                    header: true,
                    delimiter: ";",
                    transformHeader: function (h) { return headerMapping[h.toLowerCase()]; },
                    skipEmptyLines: true,
                    complete: function (results) { callBack(results); }
                });
            },

            parseStringToArray(array) {
                array = array.split(',');
                //Passage en objet
                let temp = [];
                array.forEach(e => {
                    if (e.length >= 2) {
                        temp.push({text: e});
                    }
                });
                return temp;
            },

            onFinish(data) {
                if(!data.meta.fields.includes("definition") || !data.meta.fields.includes("term")) {
                    this.badcsv = true;
                } else {
                    this.badcsv = false;
                    this.datafromcsv = data.data;
                    this.metafromcsv = data.meta;

                    //Remove lines without term name
                    this.datafromcsv = this.datafromcsv.filter(def => def.term && def.term !== 0);

                    //Parsing des données
                    this.datafromcsv.forEach(definition => {
                        definition.definition = (definition.definition) ? definition.definition : "";
                        definition.gdpr = (definition.gdpr) ? (definition.gdpr === 1 || definition.gdpr.toLowerCase() === "oui") : false;

                        definition.abbreviations = (definition.abbreviations) ? definition.abbreviations.replace(/, /g, ",").replace(/ ,/g, ",").split(',') : "";
                        definition.synonymsTermList = (definition.synonymsTermList) ? definition.synonymsTermList.replace(/, /g, ",").replace(/ ,/g, ",") : "";
                        definition.antonymsTermList = (definition.antonymsTermList) ? definition.antonymsTermList.replace(/, /g, ",").replace(/ ,/g, ",") : "";
                        definition.relatedTermList = (definition.relatedTermList) ? definition.relatedTermList.replace(/, /g, ",").replace(/ ,/g, ",") : "";
                        definition.sources = (definition.sources) ? definition.sources.replace(/, /g, ",").replace(/ ,/g, ",") : "";
                        definition.bibliography = (definition.bibliography) ? definition.bibliography.replace(/, /g, ",").replace(/ ,/g, ",") : "";
                        definition.term = {text: definition.term.trim()};

                        definition.synonymsTermList = JSON.parse(JSON.stringify(this.parseStringToArray(definition.synonymsTermList)));
                        definition.antonymsTermList = JSON.parse(JSON.stringify(this.parseStringToArray(definition.antonymsTermList)));
                        definition.sources = JSON.parse(JSON.stringify(this.parseStringToArray(definition.sources)));
                        definition.bibliography = JSON.parse(JSON.stringify(this.parseStringToArray(definition.bibliography)));
                        definition.relatedTermList = JSON.parse(JSON.stringify(this.parseStringToArray(definition.relatedTermList)));
                    });

                    this.$emit("uploadSucceeded", JSON.stringify(this.datafromcsv), this.filename);

                }
            },
        }
    }
</script>

<template>
    <div>
        <b-card-header class="sidebar-card-title" style="margin-left: -30px;">
            <h3>{{$t('csvImporter.fileImport.importFile.title')}}</h3>
        </b-card-header>

        <b-card-text>
            <p v-html="$t('csvImporter.fileImport.importFile.description')"/>

            <div class="text-center">
                <b-button @click="$refs.csvExample.display()" variant="primary" v-html="$t('csvImporter.fileImport.importFile.exampleButton')"/>
                <csv-example ref="csvExample"></csv-example>
            </div>

            <br/><br/>

            <dropzone @updated="readFiles"></dropzone>

            <i>{{$t('csvImporter.fileImport.importFile.timeInformation')}}</i>


            <b-alert :show="badcsv" style="margin-top: 25px;" variant="danger">
                <h5 class="uppercase">{{$t('csvImporter.fileImport.importFile.badFileTitle')}}</h5>
                <p>{{$t('csvImporter.fileImport.importFile.badFileDescription')}}</p>
            </b-alert>
        </b-card-text>
    </div>
</template>