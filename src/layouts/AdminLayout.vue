<template>
  <div class="flex h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
    
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

    <transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"></div>
    </transition>

    <aside :class="[
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full', 
      'fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0B1121] border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl flex flex-col'
    ]">
      <div class="flex items-center h-24 px-8 pt-4">
        <div class="flex items-center gap-3">
          <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <div class="absolute inset-0 bg-white/20 rounded-xl border border-white/20"></div>
            <svg class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl font-black tracking-widest text-white leading-tight">INVENTORY</h1>
            <span class="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Pro System</span>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
        <p class="px-4 mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Menu</p>

        <router-link to="/admin/dashboard" class="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" active-class="!bg-indigo-500/10 !text-indigo-400 sidebar-active font-bold">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full scale-y-0 opacity-0 transition-all duration-300 group-[.sidebar-active]:scale-y-100 group-[.sidebar-active]:opacity-100"></div>
          <svg class="w-5 h-5 mr-3 transition-colors group-[.sidebar-active]:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/admin/stock" class="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" active-class="!bg-indigo-500/10 !text-indigo-400 sidebar-active font-bold">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full scale-y-0 opacity-0 transition-all duration-300 group-[.sidebar-active]:scale-y-100 group-[.sidebar-active]:opacity-100"></div>
          <svg class="w-5 h-5 mr-3 transition-colors group-[.sidebar-active]:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>Manage Stock</span>
        </router-link>

        <router-link to="/admin/users" class="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" active-class="!bg-indigo-500/10 !text-indigo-400 sidebar-active font-bold">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full scale-y-0 opacity-0 transition-all duration-300 group-[.sidebar-active]:scale-y-100 group-[.sidebar-active]:opacity-100"></div>
          <svg class="w-5 h-5 mr-3 transition-colors group-[.sidebar-active]:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span>Manage Users</span>
        </router-link>

        <router-link to="/admin/categories" class="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" active-class="!bg-indigo-500/10 !text-indigo-400 sidebar-active font-bold">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full scale-y-0 opacity-0 transition-all duration-300 group-[.sidebar-active]:scale-y-100 group-[.sidebar-active]:opacity-100"></div>
          <svg class="w-5 h-5 mr-3 transition-colors group-[.sidebar-active]:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          <span>Categories</span>
        </router-link>

        <router-link to="/admin/logs" class="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200" active-class="!bg-indigo-500/10 !text-indigo-400 sidebar-active font-bold">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full scale-y-0 opacity-0 transition-all duration-300 group-[.sidebar-active]:scale-y-100 group-[.sidebar-active]:opacity-100"></div>
          <svg class="w-5 h-5 mr-3 transition-colors group-[.sidebar-active]:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span>Broken Logs</span>
        </router-link>
      </nav>
      
      <div class="p-6">
        <button @click="triggerLogout" class="flex items-center justify-center w-full px-4 py-3.5 text-sm font-bold text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 group shadow-lg">
          <svg class="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout Securely
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen relative z-10">
      
      <header class="flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20">
        
        <div class="flex items-center">
          <button @click="isSidebarOpen = true" class="p-2 mr-4 text-slate-500 rounded-xl hover:bg-slate-200/50 focus:outline-none lg:hidden transition-colors">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <div class="hidden lg:block">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ greeting }}, <span class="text-indigo-600">{{ currentAdminName }}</span>! 👋</h2>
            <p class="text-sm text-slate-500 font-medium">Here's what's happening with your inventory today.</p>
          </div>
        </div>
        
        <div class="flex items-center gap-6 ml-auto">
          <div class="flex items-center gap-4">
            <div class="relative cursor-pointer group">
              <div class="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:shadow-indigo-500/30 group-hover:-translate-y-0.5 transition-all duration-300 ring-2 ring-white">
                {{ adminInitial }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <transition name="fade-scale">
      <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 transform transition-all">
          <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <h3 class="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Leaving so soon?</h3>
          <p class="text-slate-500 text-center text-sm font-medium mb-8">Are you sure you want to securely log out of your session? You will need to sign in again to access the portal.</p>
          
          <div class="flex gap-3">
            <button @click="cancelLogout" :disabled="isLoggingOut" class="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors focus:outline-none">
              Cancel
            </button>
            <button @click="confirmLogout" :disabled="isLoggingOut" class="flex-1 relative flex justify-center items-center px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
              <svg v-if="isLoggingOut" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>Yes, Logout</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <CustomAlert 
      :show="notification.show" 
      @update:show="notification.show = $event"
      :type="notification.type" 
      :message="notification.message" 
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import CustomAlert from '../components/CustomAlert.vue';

const isSidebarOpen = ref(false);
const router = useRouter();

// State for dynamic user data
const currentAdminName = ref('Admin');
const adminInitial = ref('A');

// Global Notification State
const notification = ref({ show: false, message: '', type: 'success' });

// Logout Modal State
const isLogoutModalOpen = ref(false);
const isLoggingOut = ref(false);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});

onMounted(() => {
  const storedName = localStorage.getItem('userName');
  if (storedName) {
    currentAdminName.value = storedName.charAt(0).toUpperCase() + storedName.slice(1);
    adminInitial.value = storedName.charAt(0).toUpperCase();
  }
});

const triggerLogout = () => {
  isLogoutModalOpen.value = true;
};

const cancelLogout = () => {
  isLogoutModalOpen.value = false;
};

const confirmLogout = () => {
  isLoggingOut.value = true;
  
  notification.value = {
    show: true,
    type: 'success',
    message: 'Logging out securely...'
  };

  setTimeout(() => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    router.push('/');
  }, 1500);
};
</script>

<style scoped>
.nav-item {
  @apply relative flex items-center px-4 py-3.5 text-sm rounded-xl transition-all duration-300 border border-transparent overflow-hidden;
  color: #8B98A9; 
}

.nav-item:not(.active-nav-item):hover {
  @apply bg-slate-800/40 text-slate-200;
}

.active-nav-item {
  @apply bg-indigo-500/10 text-indigo-400 font-bold;
}
.active-nav-item svg {
  @apply text-indigo-500;
}

.active-indicator {
  @apply absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-indigo-500 rounded-r-full transition-all duration-300 opacity-0;
}
.active-nav-item .active-indicator {
  @apply h-8 opacity-100;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.99);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.99);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.3); 
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.5);
}

/* Modal animation (Scale and fade in) */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>