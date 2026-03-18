import { createRouter, createWebHistory } from 'vue-router'

// 1. Import your Views & Layouts
import Login from '../views/Login.vue'
import UserDashboard from '../views/UserDashboard.vue'

import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminCategories from '../views/AdminCategories.vue'
import AdminStock from '../views/AdminStock.vue'
import AdminUsers from '@/views/AdminUsers.vue'
import AdminBrokenLogs from '../views/AdminBrokenLogs.vue'
import AdminTransactions from '../views/AdminTransactions.vue'

// 2. Define the Routes
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: UserDashboard
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard', 
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'categories', 
        name: 'AdminCategories',
        component: AdminCategories
      },
      {
        path: 'stock', 
        name: 'AdminStock',
        component: AdminStock
      },
      {
        path: "users",
        name: "AdminUsers",
        component: AdminUsers
      },
      {
        path: 'logs', 
        name: 'AdminBrokenLogs',
        component: AdminBrokenLogs
      },
      {
        path: 'transactions', // URL will be /admin/transactions
        name: 'AdminTransactions',
        component: AdminTransactions
      },
    ]
  }
]

// 3. Create the Router Instance (Clean URLs without #)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 4. Simple Navigation Guard
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole');
  
  if (to.path.startsWith('/admin') && userRole !== 'admin') {
    next('/'); // Kick them back to login
  } else {
    next(); // Let them pass
  }
  // (Removed the duplicate next() from down here so your app doesn't crash!)
})

export default router