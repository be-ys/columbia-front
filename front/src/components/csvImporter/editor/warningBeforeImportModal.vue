<script>
    export default {

        data(){
            return {
                show:false,
            }
        },

        methods: {
            display(){
                this.show=true;
            },

            startImport: function () {
                this.$emit('startimport');
                this.show=false;
            },
        }
    }
</script>

<template>
    <b-modal id="bv-modal-example" size="lg"  hide-footer v-model="show">
        <template v-slot:modal-title>{{$t('csvImporter.editor.warningBeforeImportModal.title')}}</template>

        <p v-html="$t('csvImporter.editor.warningBeforeImportModal.content')"/>

        <div class="text-right">
            <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')">{{$t('csvImporter.editor.warningBeforeImportModal.cancelButton')}}</b-button>
            <span style="margin-right: 20px;"/>
            <b-button class="mt-3" v-on:click="startImport()" variant="success">{{$t('csvImporter.editor.warningBeforeImportModal.startButton')}}</b-button>
        </div>
    </b-modal>

</template>
