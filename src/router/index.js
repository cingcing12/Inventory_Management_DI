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
    // These 'children' will render inside the <router-view> of AdminLayout.vue!
    children: [
      {
        path: 'dashboard', // URL will be /admin/dashboard
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'categories', // URL will be /admin/categories
        name: 'AdminCategories',
        component: AdminCategories
      },
      {
        path: 'stock', // URL will be /admin/stock
        name: 'AdminStock',
        component: AdminStock
      },
      {
        path: "users",
        name: "AdminUsers",
        component: AdminUsers
      },
      {
  path: 'logs', // URL will be /admin/logs
  name: 'AdminBrokenLogs',
  component: AdminBrokenLogs
}
    ]
  }
]

// 3. Create the Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 4. (Bonus) Simple Navigation Guard to protect the Admin Panel
router.beforeEach((to, from, next) => {
  // In a fully finished app, you would check localStorage or Firebase Auth here
  // to see if the user has the "admin" role. 
  const userRole = localStorage.getItem('userRole');
  
  if (to.path.startsWith('/admin') && userRole !== 'admin') {
    next('/'); // Kick them back to login
  } else {
    next(); // Let them pass
  }
  
  next(); // For now, we allow all navigation to test the UI easily
})

export default router   