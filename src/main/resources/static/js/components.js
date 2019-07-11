let parseRole = function(role){
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

let notifier = new AWN({durations:{global:6000}, labels:{success:"Succès", warning:"Attention", alert:"Erreur !"}});


const store = new Vuex.Store({
    state: {
        search: '',
        user: {
            id: '',
            grantedContexts: {},
            parsedGrantedContexts: {},
            connected: false,
            role: 'Accès '+parseRole(MODERATOR_ROLE),
            name: 'Connexion',
            avatar: "/images/blank.png",
            token: '',
            domain: '',
        },
        noChange:false,
        nsmail:'',
    },

    mutations: {
        nsMail(state, str){
            state.nsmail=str;
        },
        search(state, str){
            state.search=str;
        },

        toggleNoChange(state, bool){
            state.noChange=bool;
        },

        updateContexts(state, contexts){
            state.user.grantedContexts = contexts;
            localStorage.grantedContexts = JSON.stringify(state.user.grantedContexts);
            state.user.parsedGrantedContexts = parseContexts(JSON.parse(JSON.stringify(state.user.grantedContexts)));
        },

        login(state, user) {
            state.user.role = user.role;
            state.user.name = user.name;
            state.user.avatar = user.avatar;
            state.user.token = user.token;
            state.user.id = user.id;
            state.user.grantedContexts = user.grantedContexts;
            state.user.connected = true;
            state.user.domain = user.domain;

            //Enregistrement localStorage
            localStorage.avatar = state.user.avatar;
            localStorage.grantedContexts = JSON.stringify(state.user.grantedContexts);
            localStorage.id = state.user.id;
            localStorage.token = state.user.token;
            localStorage.role = state.user.role;
            localStorage.name = state.user.name;
            localStorage.domain = state.user.domain;

            state.user.parsedGrantedContexts = parseContexts(JSON.parse(JSON.stringify(state.user.grantedContexts)));

        },

        logout(state) {
            state.user.role = 'Accès '+parseRole(MODERATOR_ROLE);
            state.user.name = 'Connexion';
            state.user.avatar = "/images/blank.png";
            state.user.token = '';
            state.user.id = '';
            state.user.grantedContexts = {};
            state.user.parsedGrantedContexts = {};
            state.user.connected = false;
            state.user.domain = "";

            //Nettoyage
            localStorage.clear();
        },
    }
});


const router = new VueRouter({
    routes: [
        { path: '/', redirect: "search" },
        { path: '/search/:se', name: 'searchParam', component: Search },
        { path: '/search', name: 'search', component: Search },
        { path: '/importCSV', name: 'importcsv', component: ImportCSV },
        { path: '/user', name: 'user', component: User },
        { path: '/admin', name: 'admin', component: Admin },
        { path: '*', name: 'default', component: Search },
        { path: '/newsletter/:token', name: 'updateNS', component: Newsletter },
        { path: '/newsletter', name: 'createNS', component: Newsletter },
        { path: '/legal', name: 'RGPD', component: RGPD },
        { path: '/history', name: 'History', component: History },
        { path: '/lostPassword/:to', name: 'lostPassword', component: LostPassword },
        { path: '/activate/:to', name: 'activate', component: ActivateAccount },
        { path: '/register', name: 'register', component: Register },
    ]
});

Vue.use(VueMatomo, {
    host: FRONT_URL+"stats/",
    siteId: MATOMO_ID,
    router: router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    debug:false
});

//Instance Vue
let app = new Vue({
    el: "#app",
    store,
    router,
    created() {
        if (localStorage.token != null) {
            axios.get("/api/users/self", {headers: {Authorization: localStorage.token}})
                .then(response => {
                    let obj = {};
                    obj.role = response.data.role.charAt(0).toUpperCase() + response.data.role.slice(1).toLowerCase();
                    obj.name = localStorage.name;
                    obj.avatar = localStorage.avatar;
                    obj.token = localStorage.token;
                    obj.id = response.data.id;
                    obj.grantedContexts = response.data.grantedContexts;
                    obj.domain = response.data.domain;
                    this.$store.commit('login', obj);
                })
                .catch(error => {
                    this.$store.commit('logout');
                    notifier.warning("Votre session a expirée, veuillez vous reconnecter.");
                })
        }
    },

});


Vue.directive('tooltip', function(el, binding) {
    $(el).tooltip({
        title: binding.value,
        placement: binding.arg,
        trigger: 'hover'
    })
});


let parseContexts = function(contexts){
    //Parsing contextes

    contexts.forEach(e => {
        let count = 0;
        e.baseName=e.name;
        if (e.parentContext) {
            let pc = e.parentContext;
            while (pc) {
                count+=1;
                e.name = pc.name.concat(" > ").concat(e.name);
                pc = pc.parentContext;
            }
        }
        e.level=count;
        e.isParent=false;
        contexts.forEach(f => {
            if(f.parentContext && f.parentContext.id===e.id){
                e.isParent=true;
            }
        });
    });
    contexts.sort(function (a, b) {
        return a.name.localeCompare(b.name)
    });

    return contexts;
};


