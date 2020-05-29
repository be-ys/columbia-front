<script>

    import editDefinition from "../editors/definition/editDefinition"

    export default {
        components: {
            editDefinition
        },

        props: ['r'],

        data() {
            return {
                userContexts: [],
                date: null,
            }
        },

        created() {
            if (this.user.connected) {
                this.updatedUser();
            }
            this.date = new Date(this.r[1].timestamp);
        },

        methods: {
            updatedDef: function () {
                this.axios.get(process.env.VUE_APP_ROOT_API + "/contexts/" + this.r[0].context.id + "/terms/" + this.r[0].term.id)
                    .then(response => {
                        this.r[0].definition = response.data.definition;
                    })
            },

            updatedUser: function () {
                this.userContexts = (this.user.connected) ? this.user.grantedContexts.map(e => e.id) : [];
            },
        },

        computed: {
            user() {
                return this.$store.state.user
            },
        },

        watch: {
            'user.connected': 'updatedUser',
        }
    }
</script>

<template>
    <b-card class="separated-card">
        <b-card-header class="history-header">
            <div class="card-actions card-icons">
                <b-button v-on:click="$refs.ed.display()" class="fas fa-edit resultlist-btn" v-if="userContexts.includes(r[0].context.id)"/>
            </div>
            <div>
                <h4 class="semibold card-title">
                    {{$t("history.historyEntry.title", [r[2]==='MOD' ? $t("history.historyEntry.edited") :  $t("history.historyEntry.added"), $d(date, 'short'), r[0].term.name])}}
                </h4>
                <sub>{{$t("history.historyEntry.sub", [r[0].context.name])}}</sub>
            </div>
        </b-card-header>
        <b-card-text>
            <p v-html="r[0].definitionHtml"/>
            <editDefinition :def="r[0]" ref="ed" @updated="updatedDef"/>
        </b-card-text>
    </b-card>
</template>