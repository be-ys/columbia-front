import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router.js'
import store from './store.js'
import Notifications from 'vue-notification'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import PortalVue from 'portal-vue'
import VueMatomo from 'vue-matomo'
import VuePapaParse from "./mixins/VuePapaParse";
import VueAWN from "vue-awesome-notifications"
import KonamiCode from 'vue-konami-code'

import messages from './languages/messages.js'
import dateTimeFormats from "./languages/dateFormat";


//i18n
Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: process.env.VUE_APP_LANGUAGE,
    messages,
    dateTimeFormats
});

//Toaster
let notifier = {
    durations: {global:6000},
    labels:{
        success:messages[process.env.VUE_APP_LANGUAGE].toaster.success,
        warning:messages[process.env.VUE_APP_LANGUAGE].toaster.warning,
        alert:messages[process.env.VUE_APP_LANGUAGE].toaster.alert
    }
};

Vue.use(VueAWN, notifier);

Vue.use(KonamiCode, {callback: function () {
        var head = document.getElementsByTagName('HEAD')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'css/konami.css';
        head.appendChild(link);
    }});

Vue.use(VuePapaParse);

Vue.use(VueMatomo, {
    host: process.env.VUE_APP_STATS_ENDPOINT,
    siteId: process.env.VUE_APP_STATS_SITEID,
    router: router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    debug:false
});

Vue.use(PortalVue);
Vue.use(BootstrapVue);
Vue.use(Notifications);
Vue.use(VueAxios, axios);

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
    beforeCreate() {
        axios.get(process.env.VUE_APP_ROOT_API+"/config")
            .then(response => {
                this.$store.commit('setConfiguration', response.data);
            })
            .catch(() => {
                this.$router.push("/maintenance");
            })
    },
    created() {
        if (localStorage.token != null) {
            axios.get(process.env.VUE_APP_ROOT_API +"/users/self", {headers: {Authorization: localStorage.token}})
               .then(() => {
            let obj = {};
            obj.role = localStorage.role;
            obj.fullName = localStorage.fullName;
            obj.id = localStorage.id;
            obj.token = localStorage.token;
            obj.domain = localStorage.domain;
            obj.avatar = localStorage.avatar;
            obj.grantedContexts = JSON.parse(localStorage.grantedContexts);

            this.$store.commit('login', obj);
                })
                .catch(() => {
                    this.$store.commit('logout');
                    this.$awn.alert(this.$t("toaster.disconnected"));
                })
        }
    },
}).$mount('#app');
