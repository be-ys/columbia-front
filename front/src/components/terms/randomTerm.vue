<script>

    import definitionContent from './definitionContent'

    export default {

        components: {
            definitionContent
        },

        data() {
            return {
                obj: {
                    abbreviations: []
                }
            }
        },

        created() {
            this.loadTerm();
        },

        methods: {
            loadTerm() {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/terms/?search=random")
                    .then(response => {
                        this.obj = response.data;
                    })
            }
        }
    };


</script>

<template>
    <b-card class="result-dialog">
        <b-card-text class="results">
            <b-card-header header-tag="header" role="tab">
                <div class="resultHeader">
                    <h3 class="card-title">{{obj.name}}
                        <span v-if="obj.abbreviations.length!==0">
                        ( <span v-bind:key="index" v-for="(a, index) in obj.abbreviations">{{a}}<span
                                v-if="(index+1)!==obj.abbreviations.length"> , </span></span> )
                        </span>

                        <span class="fas fa-magic magicRandom" id="randomIdDescriptor"></span>
                        <b-tooltip placement="right" target="randomIdDescriptor" triggers="hover">{{$t("terms.randomTerm.infoTooltip")}}
                        </b-tooltip>


                    </h3>
                    <span class="termEditionButtons" style="text-align: right">
                        <b-button class="reset fas fa-sync editbuttons resultlist-btn" id="reloadBtn"
                                  v-on:click.stop="loadTerm()"></b-button>
                        <b-tooltip placement="top" target="reloadBtn" triggers="hover">{{$t("terms.randomTerm.newWordTooltip")}}</b-tooltip>
                    </span>
                </div>
            </b-card-header>

            <b-card-text>
                <definitionContent :termId="obj.id" :termName="obj.name" v-if="obj.id!==0 && typeof obj.id !== 'undefined'"></definitionContent>
            </b-card-text>
        </b-card-text>
    </b-card>
</template>