<script>
    export default{
        props: ['name', 'object'],

        methods: {
            fillSearchField: function (str) {
                this.$router.push('/search/' + str.replace("/", ""));
                this.$store.commit('search', str);
            }
        },
    }
</script>

<template>
    <span>
        <span class="label label-default">{{name}} :</span>
        <span v-for="item in object" v-bind:key="item.id">
            <b-link class="label"><a class="color-primary" v-on:click="fillSearchField(item.name)">{{item.name}}</a></b-link>
        </span>
    </span>

</template>