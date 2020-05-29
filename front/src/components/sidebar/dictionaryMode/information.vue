<template>
    <b-card>
        <b-card-header class="sidebar-card-title">
            <h3>{{$t("sidebar.dictionaryMode.information.title")}}</h3>
        </b-card-header>
        <b-card-text class="sidebar-card-body" v-html="$t('sidebar.dictionaryMode.information.content')"/>
    </b-card>
</template>