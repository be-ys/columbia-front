import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    search: '',
    noChange:false,
    nsmail:'',

    dictionary: {
      letter: "@",
      context: 0
    },

    user: {
      role: null,
      fullName: null,
      grantedContexts: [],
      parsedGrantedContexts: [],
      id: null,
      token: null,
      avatar: null,
      connected: false,
      domain: null
    },
    config: {
      adminRole: "ADMIN",
      moderatorRole: "GLOSSATEUR",
      userRole: "UTILISATEUR",
      maxLevel: 3,
      delegatedAuth: null,
      openRegistration: null
    }
  },
  mutations: {
    // Dictionary
    updateDictionaryLetter(state, letter)  {
      state.dictionary.letter = letter;
    },

    updateDictionaryContext(state, contextId) {
      state.dictionary.context = contextId;
    },

    // Newsletter
    nsMail(state, str){
      state.nsmail=str;
    },

    // Misc
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

    setConfiguration(state, config){
      state.config.adminRole = config.adminRole;
      state.config.moderatorRole = config.moderatorRole;
      state.config.userRole = config.userRole;
      state.config.maxLevel = config.maxContextLevel;
      state.config.delegatedAuth = config.delegatedAuth;
      state.config.openRegistration = config.openRegistration;
    },

    // User
    login(state, user) {
      state.user.role = user.role;
      state.user.fullName = user.fullName;
      state.user.avatar = user.avatar;
      state.user.id = user.id;
      state.user.token = user.token;
      state.user.connected = true;
      state.user.domain = user.domain;
      state.user.grantedContexts = user.grantedContexts;

      //Enregistrement localStorage
      localStorage.role = state.user.role;
      localStorage.avatar = state.user.avatar;
      localStorage.fullName = state.user.fullName;
      localStorage.grantedContexts = JSON.stringify(state.user.grantedContexts);
      localStorage.id = state.user.id;
      localStorage.token = state.user.token; 
      localStorage.domain = state.user.domain;

      state.user.parsedGrantedContexts = parseContexts(JSON.parse(JSON.stringify(state.user.grantedContexts)));

    },

    logout(state) {
      state.user.role = null;
      state.user.fullName = null;
      state.user.token = null;
      state.user.avatar = null;
      state.user.grantedContexts = {};
      state.user.parsedGrantedContexts = {};
      state.user.id = null;
      state.user.connected = false;
      state.user.domain = null;

      //Nettoyage
      localStorage.clear();
  },
  }
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

export default store