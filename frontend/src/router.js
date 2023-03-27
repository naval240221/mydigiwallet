import { createWebHistory, createRouter } from "vue-router";


const routes = [
    {
      path: '/',
      alias: '/home',
      name: 'home',
      component: () => import('./components/HomeView.vue'),
      meta: {title: "Home"}
    },
    {
      path: '/wallet/:id',
      name: 'wallet',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./components/WalletView.vue') ,
      props: true,
      meta: {title: "My Wallet"}
    },
    {
      path: '/transactions',
      name: 'transactions',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./components/TransactionView.vue') ,
      props: true,
      meta: {title: "Transactions"}
    },
    {
      path: "/:catchAll(.*)",
      component: () => import('./components/NotFound.vue'),
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;