<script>

    import deleteContextModal from "./modal/deleteContextModal"
    import editContextModal from "./modal/editContextModal"

    export default {
        components: {
            deleteContextModal,
            editContextModal
        },

        props:['context', 'contexts'],

        methods:{
            update: function(){
                this.$emit('update');
            },
        },
    }
</script>

<template>
<tr>
    <td>
        <span v-for="i in context.level" v-bind:key="i" style="padding-left:15px;"/> └ {{context.name}}
    </td>
    <td>
        <b-button v-on:click="$refs.ec.display()"  class="fas fa-pen editbuttons resultlist-btn"/>
        <b-button v-on:click="$refs.dc.display()" v-if="!context.isParent" class="fas fa-trash editbuttons resultlist-btn"/>

        <deleteContextModal ref="dc" :context="context" @deleted="update"/>
        <editContextModal ref="ec" :context="context" :contexts="contexts" @updated="update"/>
    </td>
</tr>
</template>