import Vue from 'vue'
import Router from 'vue-router'
import globalLayout from './components/globalLayout'
import fullLayout from './components/fullLayout'
import search from './components/search/search'
import newsletter from './components/newsletter/newsletterRegistrator'
import gdpr from './components/gdpr/gdpr'
import error404 from './components/errors/error404'
import profile from './components/account/profile'
import lostPassword from './components/account/lostPassword'
import createAccount from './components/account/createAccount'
import activateAccount from './components/account/activateAccount'
import history from './components/history/history'
import csvImporter from './components/csvImporter/csvImporter'
import adminContexts from './components/admin/contexts/contexts'
import adminUsers from './components/admin/users/users'
import dictionary from './components/dictionary/dictionary'
import emptyLayout from './components/emptyLayout'
import maintenance from './components/maintenance/maintenance'

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: search
                }
            ]
        },
        {
            path: '/search/',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: search
                },
                {
                    path: ':se',
                    component: search
                }
            ]
        },
        {
            path: '/newsletter/',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: newsletter
                },
                {
                    path: ':token',
                    component: newsletter
                }
            ]
        },
        {
            path: '/legal/',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: gdpr
                }
            ]
        },
        {
            path: '/user/',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: profile
                }
            ]
        },
        {
            path: '/lostpassword/',
            component: globalLayout,
            children: [
                {
                    path: ':to',
                    component: lostPassword
                },
                {
                    path: '*',
                    component: error404
                }
            ]
        },
        {
            path: '/activate/',
            component: globalLayout,
            children: [
                {
                    path: ':to',
                    component: activateAccount,
                },
                {
                    path: '*',
                    component: error404
                }
            ]
        },
        {
            path: '/register',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: createAccount
                }
            ]
        },
        {
            path: '/admin/',
            component: globalLayout,
            children: [
                {
                    path: 'users',
                    component: adminUsers
                },
                {
                    path: 'contexts',
                    component: adminContexts
                }
            ]
        },
        {
            path: '/history/',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: history
                }
            ]
        },
        {
            path: '/importCSV',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: csvImporter
                }
            ]
        },
        {
            path: '/dictionary',
            component: globalLayout,
            children: [
                {
                    path: '',
                    component: dictionary
                }
            ]
        },
        {
          path: '/maintenance',
          component: emptyLayout,
          children: [
              {
                  path: '',
                  component: maintenance
              }
          ],
        },
        {
            path: '*',
            component: fullLayout,
            children: [
                {
                    path: '',
                    component: error404
                }
            ]
        }
    ]
});

Vue.use(Router);

export default router