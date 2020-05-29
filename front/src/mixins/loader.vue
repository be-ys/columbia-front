<script>
    export default {
        props: ["loading"]
    }
</script>

<template>
    <div v-if="loading" class="text-center">
        <b-spinner variant="primary" key="primary" type="grow"></b-spinner>
    </div>
</template>