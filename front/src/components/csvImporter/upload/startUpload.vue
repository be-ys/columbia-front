<script>

    export default {
        props: ['data', 'filename', 'config'],

        data() {
            return {
                status: [], //null : awaiting, 0: pending, 1: failed, 2: success
            }
        },

        methods: {

            tableClass(index) {
                if (this.status[index]) {
                    switch (this.status[index]) {
                        case 1:
                            return "import-danger";
                        case 2:
                            return "import-success";
                        default:
                            return "import-info";
                    }
                }
                return "import-info";
            },

            goToContext(){
                this.$store.commit('updateDictionaryContext', this.config.contextId);
                this.$router.push("/dictionary");
            },

            createOrUpdateDefinition(index) {
                this.data[index].context= { "id" : this.config.contextId};

                //Search for term in glossary
                this.axios.get(process.env.VUE_APP_ROOT_API + "/terms/?search=".concat(this.data[index].term.text))
                    .then(response => {
                        if (response.data.numberOfElements === 0) {
                            //If the term does not exists, we have to create it.
                            let objectToSend = {
                                name: this.data[index].term.text,
                                abbreviations: (this.data[index].abbreviations === "") ? [] : this.data[index].abbreviations,
                            };


                            this.axios.post(process.env.VUE_APP_ROOT_API + "/terms", objectToSend, {headers: {Authorization: localStorage.token}})
                                .then(res2 => {
                                    //Get term id
                                    this.data[index].term.id = res2.headers.location.split("/").pop();
                                    //Create definition
                                    this.axios.post(process.env.VUE_APP_FRONT_BACKEND + "/definition", this.data[index], {headers: {Authorization: localStorage.token}})
                                        .then(() => {
                                            this.status[index] = 2;
                                        })
                                        .catch(() => {
                                            this.status[index] = 1;
                                        })
                                        .finally(() => {
                                            this.$forceUpdate();
                                        })
                                })
                                .catch(() => {
                                    this.status[index] = 1;
                                })
                                .finally(() => {
                                    this.$forceUpdate();
                                })
                        } else {
                            //The term already exists
                            this.data[index].term.id = response.data.content[0].id;

                            //Check if definition already exists
                            this.axios.get(process.env.VUE_APP_ROOT_API + "/contexts/" + this.config.contextId + "/terms/" + this.data[index].term.id)
                                .then(() => {
                                    //If the definition already exists AND we checked "Override existing definitions", we have to update
                                    if(this.config.forceUpdate) {
                                        this.axios.put(process.env.VUE_APP_FRONT_BACKEND + "/definition", this.data[index], {headers: {Authorization: localStorage.token}})
                                            .then(() => {
                                                this.status[index] = 2;
                                            })
                                            .catch(() => {
                                                this.status[index] = 1;
                                            })
                                            .finally(() => {
                                                this.$forceUpdate();
                                            })
                                    } else {
                                        this.status[index] = 1 ;
                                    }
                                })
                                .catch(() => {
                                    // 404 - We have to create the definition
                                    this.axios.post(process.env.VUE_APP_FRONT_BACKEND + "/definition", this.data[index], {headers: {Authorization: localStorage.token}})
                                        .then(() => {
                                            this.status[index] = 2;
                                        })
                                        .catch(() => {
                                            this.status[index] = 1;
                                        })
                                        .finally(() => {
                                            this.$forceUpdate();
                                        })
                                })
                                .finally(() => {
                                    this.$forceUpdate();
                                })
                        }
                    })
                    .finally(() => {
                        this.$forceUpdate();
                    })
            }
        },


        mounted() {

            console.log(JSON.stringify(this.data[0]));

            let timer = 0;
            this.data.forEach((_, index) => {
                setTimeout(function () {
                    this.createOrUpdateDefinition(index);
                }.bind(this), timer += 300);
            });
        },
    }
</script>

<template>
    <div>
        <div>
            <div class="text-center"
                 v-if="data.length!==status.filter(e => e===1).length+status.filter(e => e===2).length">
                <h3>{{$t('csvImporter.upload.startUpload.uploadingTitle')}}</h3>
                <h4>{{$t('csvImporter.upload.startUpload.uploadingSubtitle', [data.length - status.filter(e => e===1).length - status.filter(e => e===2).length])}}</h4>
            </div>
            <div class="text-center" v-else>
                <h3>{{$t('csvImporter.upload.startUpload.finishedTitle')}}</h3>
                <h4>
                    {{$t('csvImporter.upload.startUpload.finishedSubtitle', [data.length, status.filter(e => e===1).length])}}
                </h4>
            </div>

            <table class="table">
                <thead>
                <tr>
                    <th>{{$t('csvImporter.upload.startUpload.table.lineNumber')}}</th>
                    <th>{{$t('csvImporter.upload.startUpload.table.term')}}</th>
                    <th>{{$t('csvImporter.upload.startUpload.table.status')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr :class="tableClass(index)" v-bind:key="index" v-for="(e, index) in data">
                    <td class="v-align-middle">{{index+1}}</td>
                    <td class="v-align-middle">{{e.term.text}}</td>
                    <td class="v-align-middle">
                        <span v-if="status[index]===1">{{$t('csvImporter.upload.startUpload.status.error')}}</span>
                        <span v-else-if="status[index]===2">{{$t('csvImporter.upload.startUpload.status.success')}}</span>
                        <span v-else>{{$t('csvImporter.upload.startUpload.status.waiting')}}</span>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="text-center" v-if="data.length===status.filter(e => e===1).length+status.filter(e => e===2).length">
                <b-button class="mt-3 btn-info" @click="goToContext()" v-b-tooltip.hover :title="$t('csvImporter.upload.startUpload.buttonTooltip')">
                    <i class="far fa-paper-plane"></i> {{$t('csvImporter.upload.startUpload.buttonText')}}
                </b-button>
            </div>
        </div>
    </div>
</template>