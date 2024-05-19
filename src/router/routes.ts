import { RouteRecordRaw } from 'vue-router';
import DefaultLayout from 'src/layouts/DefaultLayout.vue';

// const routes: RouteRecordRaw[] = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue'),
//   },
// ];

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '404',
      },
      {
        path: '',
        redirect: 'dashboard',
      },
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: "main" */ 'pages/DashboardView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'users',
        name: 'Users',
        component: () =>
          import(/* webpackChunkName: "main" */ 'pages/UsersView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '404',
        name: '404',
        component: () =>
          import(/* webpackChunkName: "404" */ 'pages/404View.vue'),
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "main" */ 'pages/AboutView.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/info',
    name: 'Info',
    component: () =>
      import(/* webpackChunkName: "main" */ 'pages/AboutView.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: 'signin',
        name: 'SignIn',
        component: () =>
          import(/* webpackChunkName: "auth" */ 'pages/auth/SignInView.vue'),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () =>
          import(
            /* webpackChunkName: "auth" */ 'pages/auth/ForgotPasswordView.vue'
          ),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: 'reset-pass/:token',
        name: 'ResetPassword',
        component: () =>
          import(
            /* webpackChunkName: "auth" */ 'pages/auth/ResetPasswordView.vue'
          ),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () =>
          import(/* webpackChunkName: "auth" */ 'pages/auth/SignUpView.vue'),
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
];

export default routes;
