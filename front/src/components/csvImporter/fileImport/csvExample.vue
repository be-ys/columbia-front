<script>

    var fileDownload = require('js-file-download');

    export default {
        data() {
            return {
                show: false
            }
        },

        methods: {
            display() {
                this.show = true;
            },

            downloadCSV() {
                this.axios.get("/ressources/Exemple_Glossaire.xlsx", {responseType: 'blob'})
                    .then(response => {
                        fileDownload(response.data, 'Exemple_Glossaire.xlsx', 'application/xlsx');
                    })
            }
        }
    }

</script>

<template>
    <b-modal hide-footer id="bv-modal-example" size="xl" v-model="show">
        <template v-slot:modal-title>{{$t('csvImporter.fileImport.csvExample.title')}}</template>

        {{$t('csvImporter.fileImport.csvExample.example1')}}
        <table class="table-bordered" style="width:100%">
            <tr>
                <th><b>{{$t('csvImporter.csvDefinition.term')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.definition')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.abbreviations')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.synonymsTermList')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.antonymsTermList')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.relatedTermList')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.sources')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.bibliography')}}</b></th>
                <th><b>{{$t('csvImporter.csvDefinition.gdpr')}}</b></th>
            </tr>
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

        <br/>
        {{$t('csvImporter.fileImport.csvExample.example2')}}<br/>

        <div class="code">
            <code>
                "{{$t('csvImporter.csvDefinition.term')}}";"{{$t('csvImporter.csvDefinition.definition')}}";"{{$t('csvImporter.csvDefinition.abbreviations')}}";"{{$t('csvImporter.csvDefinition.synonymsTermList')}}";"{{$t('csvImporter.csvDefinition.antonymsTermList')}}";"{{$t('csvImporter.csvDefinition.relatedTermList')}}";"{{$t('csvImporter.csvDefinition.sources')}}";"{{$t('csvImporter.csvDefinition.bibliography')}}";"{{$t('csvImporter.csvDefinition.gdpr')}}"<br/>
                "Caisse Primaire";"La caisse par défaut";"CP,CPAM";"";"Caisse Secondaire";"Santé,Sécurité Sociale";"";"";1
            </code>
        </div>
        <br/><br/>
        <div v-html="$t('csvImporter.fileImport.csvExample.notes')"></div>

        <div class="text-center">
            <b-button v-on:click="downloadCSV()" variant="primary">
                {{$t('csvImporter.fileImport.csvExample.downloadExampleButton')}}
            </b-button>
        </div>
        <div class="text-right">
            <b-button @click="$bvModal.hide('bv-modal-example')" class="mt-3">
                {{$t('csvImporter.fileImport.csvExample.cancelButton')}}
            </b-button>
        </div>
    </b-modal>

</template>