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
        <p class="text-slate-500 font-medium">Select your name to access the portal</p>
      </div>
      
      <transition name="fade">
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start shadow-sm">
          <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-sm text-red-700 font-semibold">{{ errorMessage }}</span>
        </div>
      </transition>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div class="relative group z-50">
          <label class="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
          
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <svg class="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            
            <input 
              v-model="searchQuery" 
              @focus="isDropdownOpen = true"
              type="text" 
              class="block w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm relative z-10"
              placeholder="Search or select your name..."
              :disabled="isLoading || isFetchingUsers"
              required
            >

            <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
               <svg v-if="isFetchingUsers" class="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               <svg v-else class="h-5 w-5 text-slate-400 transition-transform duration-200" :class="{'rotate-180': isDropdownOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            
            <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-0"></div>

            <transition name="fade-scale">
              <div v-if="isDropdownOpen" class="absolute w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] overflow-hidden z-50 origin-top">
                <ul class="max-h-56 overflow-y-auto custom-scrollbar p-1">
                  <li v-if="filteredUsers.length === 0" class="px-4 py-3 text-sm text-slate-500 text-center font-medium">
                    No users found matching "{{ searchQuery }}"
                  </li>
                  <li 
                    v-for="user in filteredUsers" 
                    :key="user.id" 
                    @click="selectUser(user)"
                    class="px-4 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl cursor-pointer transition-colors flex items-center gap-3"
                  >
                    <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    {{ user.name }}
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading || isFetchingUsers"
          class="relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-white font-bold text-lg bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group z-10"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const router = useRouter();
const errorMessage = ref(''); 
const isLoading = ref(false);

// New states for the searchable dropdown
const isFetchingUsers = ref(true);
const usersList = ref([]);
const searchQuery = ref('');
const isDropdownOpen = ref(false);
const selectedUser = ref(null);

// 1. Fetch all users when the page loads
onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    usersList.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Failed to load users:", error);
    errorMessage.value = "Failed to connect to the database.";
  } finally {
    isFetchingUsers.value = false;
  }
});

// 2. Filter users based on what the user types
const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersList.value;
  return usersList.value.filter(user => 
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 3. When a user clicks a name in the list
const selectUser = (user) => {
  selectedUser.value = user;
  searchQuery.value = user.name; // Fill the input with the clicked name
  isDropdownOpen.value = false;  // Close the dropdown
  errorMessage.value = '';
};

// 4. Handle the login button click
const handleLogin = async () => {
  if (!searchQuery.value.trim()) return;
  
  isLoading.value = true;
  errorMessage.value = ''; 

  try {
    // If they typed a name but didn't click it from the list, try to find it automatically
    let userToLogin = selectedUser.value;
    
    if (!userToLogin || userToLogin.name !== searchQuery.value) {
      userToLogin = usersList.value.find(u => u.name.toLowerCase() === searchQuery.value.trim().toLowerCase());
    }

    if (!userToLogin) {
      errorMessage.value = 'User not found. Please select your name from the list.';
      isLoading.value = false;
      return;
    }

    console.log("Logging in as:", userToLogin);

    // Save to local storage
    localStorage.setItem('userName', userToLogin.name);
    localStorage.setItem('userRole', userToLogin.role);
    localStorage.setItem('userId', userToLogin.id);

    const userRole = (userToLogin.role || '').trim().toLowerCase();

    // Small delay for the loading animation
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
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}

/* Custom Scrollbar for the dropdown */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0; 
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1; 
}
</style>