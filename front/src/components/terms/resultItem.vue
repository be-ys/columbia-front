<script>

    import definitionContent from './definitionContent'
    import editTerm from '../editors/term/editTerm'
    import deleteTerm from '../editors/term/deleteTerm'

    export default {
        components: {
            definitionContent,
            editTerm,
            deleteTerm
        },

        props: ['term', 'nb', 'nopropagate'],

        data() {
            return {
                isVisible: false
            }
        },

        computed: {
            user() {
                return this.$store.state.user
            },
            config(){
                return this.$store.state.config
            },
        },

        watch: {
            'nb': 'updateChange',
        },

        mounted() {
            this.updateChange();
        },

        methods: {
            updateChange() {
                if (this.$props.nb <= 1 && !this.$props.nopropagate) {
                    this.isVisible = true;
                    this.$router.push('/search/' + this.term.name.replace("/", ""));
                }
            },

            update() {
                this.$emit('update');
            }
        },
    }
</script>

<template>
    <div>
        <b-card-header header-tag="header" class="p-1" role="tab">
            <div class="resultHeader">
                <b-button class="resultlist-btn" block v-b-toggle="'accordion-'+term.id">
                    <span class="reset chevronresult fas fa-angle-right"></span>

                    {{term.name}}

                    <span v-if="term.abbreviations.length!==0">
                        ( <span v-for="(a, index) in term.abbreviations" v-bind:key="index">{{a}}<span
                            v-if="(index+1)!==term.abbreviations.length"> , </span></span> )
                    </span>

                </b-button>

                <span v-if="user.role===config.adminRole" class="termEditionButtons">
                        <b-button v-on:click.stop="$refs.et.display()" class="reset fas fa-pen editbuttons resultlist-btn"></b-button>
                        <b-button v-on:click.stop="$refs.dt.display()" class="reset fas fa-trash editbuttons resultlist-btn"></b-button>
                </span>
            </div>

            <editTerm ref="et" @updated="update()" :term="term"></editTerm>
            <deleteTerm ref="dt" @deleted="update()" :term="term"></deleteTerm>

        </b-card-header>

        <b-collapse v-model="isVisible" :id="'accordion-'+term.id" accordion="my-accordion" role="tabpanel">
            <b-card-body>
                <definitionContent v-if="isVisible" :termId="term.id" :termName="term.name"></definitionContent>
            </b-card-body>
        </b-collapse>
    </div>
</template>