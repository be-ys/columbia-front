<script>

    import importFile from "./fileImport/importFile"
    import Editor from "./editor/editor";
    import startUpload from "./upload/startUpload"

    export default {
        components: {
            Editor,
            importFile,
            startUpload
        },

        data() {
            return {
                step: 0,
                datafromcsv: [],
                filename: "",
                uploadConfig: {}
            }
        },

        methods: {
            startimport(form, data){
                this.datafromcsv = JSON.parse(data);
                this.uploadConfig = JSON.parse(form);
                this.step++;
            },

            setContent(content, fileName) {
                this.datafromcsv = JSON.parse(content);
                this.filename = fileName;
                this.step++;
            },

        },

        computed: {
            user() {
                return this.$store.state.user
            },
            config(){
                return this.$store.state.config;
            }
        },
    }
    </script>


<template>
<div>
    <b-card class="result-dialog" v-if="user.connected && (user.role===config.adminRole || user.role===config.moderatorRole)">
        <importFile v-if="step===0" @uploadSucceeded="setContent(... arguments)"/>
        <editor v-if="step===1" @done="startimport(... arguments)" :data="datafromcsv" :filename="filename"/>
        <start-upload v-if="step===2" :data="datafromcsv" :filename="filename" :config="uploadConfig"/>
    </b-card>
    <b-card v-else>
        <b-card-header class="sidebar-card-title" style="margin-left: -30px;">
            <h3>{{$t('csvImporter.csvImporter.title')}}</h3>
        </b-card-header>
        <b-card-text class="text-center">
            {{$t('csvImporter.csvImporter.pleaseLogin')}}
        </b-card-text>
    </b-card>
</div>
</template>