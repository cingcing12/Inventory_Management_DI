<template>
  <div class="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
    
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style="animation-delay: 2s;"></div>
    <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style="animation-delay: 4s;"></div>

    <div class="relative w-full max-w-md p-10 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white z-10 transform transition-all">
      
      <div class="flex justify-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center -rotate-3 hover:rotate-3 transition-transform duration-300">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
        <p class="text-slate-500 font-medium">Enter your name to access the portal</p>
      </div>
      
      <transition name="fade">
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start shadow-sm">
          <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-sm text-red-700 font-semibold">{{ errorMessage }}</span>
        </div>
      </transition>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="relative group">
          <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <input 
              v-model="name" 
              type="text" 
              class="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm"
              placeholder="Please field your name..."
              :disabled="isLoading"
              required
            >
          </div>
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          class="relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-white font-bold text-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          
          <span v-if="!isLoading" class="group-hover:scale-105 transition-transform">Access Dashboard</span>
          <span v-else>Verifying...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const name = ref('');
const errorMessage = ref(''); // New state for beautiful UI errors
const router = useRouter();
const isLoading = ref(false);

const handleLogin = async () => {
  if (!name.value.trim()) return;
  
  isLoading.value = true;
  errorMessage.value = ''; // Reset error on new attempt

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('name', '==', name.value.trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      errorMessage.value = 'User not found. Please check your spelling.';
      isLoading.value = false;
      return;
    }

    const userData = querySnapshot.docs[0].data();
    const userId = querySnapshot.docs[0].id;

    console.log("Firebase returned this user data:", userData);

    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userId', userId);

    const userRole = (userData.role || '').trim().toLowerCase();

    // Small delay just to show off the loading animation (optional)
    setTimeout(() => {
      if (userRole === 'admin') {
        router.push('/admin/dashboard'); 
      } else {
        router.push('/user'); 
      }
    }, 400);
    
  } catch (error) {
    console.error("Login error: ", error);
    errorMessage.value = "A network error occurred. Please try again.";
  } finally {
    // We don't turn off isLoading here immediately so it stays spinning while routing
    if (errorMessage.value) {
       isLoading.value = false;
    }
  }
};
</script>

<style scoped>
/* Smooth fade transition for the error message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>