<script>

    import sidebarLastModifications from "./searchMode/sidebarLastModifications.vue";
    import sidebarStatistics from "./searchMode/sidebarStatistics";
    import sidebarNewsletterRegistration from "./searchMode/sidebarNewsletterRegistration";
    import information from "./dictionaryMode/information"
    import letterSelector from "./dictionaryMode/letterSelector";
    import contextSelector from "./dictionaryMode/contextSelector";

    export default {
        components: {
            sidebarLastModifications,
            sidebarStatistics,
            sidebarNewsletterRegistration,
            information,
            letterSelector,
            contextSelector
        },

        computed: {
            searchroute() {
                return this.$route.path
            },
        },

    };
</script>

<template>
    <div v-if="!searchroute || !searchroute.includes('dictionary')" class="col-md-12">
        <sidebar-last-modifications/>
        <br/>
        <sidebar-statistics/>
        <br/>
        <sidebar-newsletter-registration/>
    </div>
    <div v-else>
        <information/>
        <br/>
        <letter-selector/>
        <br/>
        <context-selector/>
    </div>
</template>