<script>

    import deleteUserModal from "./modal/deleteUserModal";
    import editUserModal from "./modal/editUserModal";

    export default {
        components: {
            deleteUserModal,
            editUserModal
        },

        props: ['user'],

        computed: {
            currentUser() {
                return this.$store.state.user.id;
            },
        },

        methods: {
            update: function () {
                this.$emit('update');
            },
        },
    }
</script>

<template>
<tr>
    <td>
        {{user.username}}
    </td>

    <td>{{ user.role.charAt(0).toUpperCase() +  user.role.slice(1).toLowerCase()}}</td>
    <td>
        {{user.domain}}
    </td>
    <td>
        <b-button v-on:click="$refs.eu.display()" v-if="user.id!==currentUser" class="fas fa-pen editbuttons resultlist-btn"/>
        <b-button v-on:click="$refs.du.display()" v-if="user.id!==currentUser" class="fas fa-trash editbuttons resultlist-btn"/>

        <deleteUserModal :user="user" @deleted="update" ref="du"/>
        <editUserModal :user="user" @updated="update" ref="eu"/>
    </td>
</tr>
</template>