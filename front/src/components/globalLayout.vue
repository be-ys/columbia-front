<template>
    <div id="app">
        <header>
            <topMenu/>
        </header>
        <main>
            <div class="container">
                <div class="row">
                    <div class="column  col-md-4 sticky-sidebar">
                        <sidebar/>
                    </div>
                    <div class="col-md-8">
                        <div class="col-md-12">
                            <router-view/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <foo id="footer"/>
    </div>
</template>


<script>
    import sidebar from "./sidebar/sidebar";
    import topMenu from "./navigation/topMenu";
    import foo from "./navigation/footer";

    export default {
        components: {
            sidebar,
            topMenu,
            foo
        }
    }
</script>
