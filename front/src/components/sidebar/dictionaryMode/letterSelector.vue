<script>
    export default {
        mounted() {
            this.selectedIndex = this.$store.state.dictionary.letter.charCodeAt(0) - 64;
        },

        data() {
            return {
                selectedIndex: 1
            }
        },

        methods: {
            updateSelected(i) {
                this.selectedIndex = i;
                this.$store.commit("updateDictionaryLetter", String.fromCharCode(64 + i));
            }
        }
    }
</script>
<template>
    <b-card>
        <b-card-text class="sidebar-card-body">
            <p style="text-align: center; font-size:14px;">
                <span v-for="i in 26" v-bind:key="i">
                    <b-link v-on:click="updateSelected(i)" :class="{'disabled' : selectedIndex===i}">{{String.fromCharCode(64+i)}}</b-link> -
                </span>
                <b-link v-on:click="updateSelected(0)" :class="{'disabled' : selectedIndex===0}">{{$t("sidebar.dictionaryMode.letterSelector.all")}}</b-link>
            </p>
        </b-card-text>
    </b-card>
</template>