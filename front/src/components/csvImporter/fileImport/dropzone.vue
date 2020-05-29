<script>

    export default {
        mounted(){
            document.getElementById("dz").addEventListener("dragleave", function (e) {
                e.preventDefault();
            });

            document.getElementById("dz").addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            document.getElementById("dz").addEventListener('click', function () {
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
    }
</script>


<template><div>
    <input id="inputId" type="file" ref="inputId" style="display:none" @change="update">
    <div id="dz" class="dz-default dz-message">
        <div id="textnode">{{$t('csvImporter.fileImport.dropzone.input')}}</div>
    </div></div>
</template>