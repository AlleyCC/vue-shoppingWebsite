import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashBoard.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/Products.vue'),
      },
      {
        path: 'orders',
        component: () => import('../views/Orders.vue'),
      },
      {
        path: 'coupons',
        component: () => import('../views/Coupons.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('../views/UserBoard.vue'),
    children: [
      {
        path: 'product/:id',
        component: () => import('../views/UserProduct.vue'),
      },
      {
        path: 'cart',
        component: () => import('../views/UserCart.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('../views/UserCheckout.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
