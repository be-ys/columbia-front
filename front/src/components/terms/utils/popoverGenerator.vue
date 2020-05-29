<script>
    export default {
        props: ["content", "name"]
    }
</script>


<template>
    <div class="popoverDiv">
        <b-button :id="'popover-'+name" class="btn resources label label-default sources popoverButton">
            {{name}} <i class="fas fa-location-arrow"></i>
        </b-button>
        <b-popover placement="top" :target="'popover-'+name" :title="name">
            <ul>
                <li v-for="(item, index) in content" v-bind:key="index">
                    <a v-if="item.startsWith('http')" :href="item" rel="noopener" target="_blank">{{item}}</a>
                    <span v-else>{{item}}</span>
                </li>
            </ul>
        </b-popover>
    </div>

</template>