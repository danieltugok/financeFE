import { RouteRecordRaw } from 'vue-router';
import DefaultLayout from 'src/layouts/DefaultLayout.vue';

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
        name: 'ErrorNotFound',
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
        path: 'balance',
        name: 'Balance',
        component: () =>
          // import(/* webpackChunkName: "main" */ 'pages/BalanceView.vue'),
          import(/* webpackChunkName: "main" */ 'pages/TransactionView.vue'),
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: ':id/',
            name: 'TransactionDetail',
            component: () =>
              import(
                /* webpackChunkName: "brand" */ 'pages/TransactionView.vue'
              ),
            props: true,
          },
        ],
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () =>
          import(/* webpackChunkName: "main" */ 'pages/CategoriesView.vue'),
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
          import(/* webpackChunkName: "404" */ 'pages/ErrorNotFound.vue'),
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: '',
    component: DefaultLayout,
    children: [
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
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
