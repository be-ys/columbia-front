<template>
    <div id="app">
        <header>
            <topMenu/>
        </header>
        <main>
            <div class="container">
                <router-view/>
            </div>
        </main>
    </div>
</template>


<script>
    import topMenu from "./navigation/topMenu";

    export default {
        components: {
            topMenu
        },

    }
</script>
