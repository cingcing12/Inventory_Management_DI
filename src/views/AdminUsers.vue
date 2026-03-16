<template>
  <div class="max-w-7xl mx-auto relative">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Manage Users</h2>
        <p class="text-sm font-medium text-slate-500 mt-1">Add administrators or grant staff access to the portal.</p>
      </div>
      <div v-if="!isLoading" class="hidden sm:flex items-center bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
        <span class="text-xs font-bold text-slate-600">{{ users.length }} Active Accounts</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-4">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 lg:sticky lg:top-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600">
              <svg v-if="!isEditing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800">{{ isEditing ? 'Edit User' : 'Create Account' }}</h3>
          </div>

          <form @submit.prevent="submitForm" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <div class="relative">
                <input 
                  v-model="form.name" 
                  type="text" 
                  placeholder="e.g., Sokha"
                  class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                  required
                  :disabled="isSubmitting"
                >
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Access Role</label>
              <div class="relative">
                <select 
                  v-model="form.role" 
                  class="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  required
                  :disabled="isSubmitting"
                >
                  <option value="" disabled>Select a role...</option>
                  <option value="admin">Administrator (Full Access)</option>
                  <option value="user">User (Report Only)</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 mt-2">
              <button 
                v-if="isEditing"
                type="button"
                @click="cancelEdit"
                class="flex-1 py-3.5 px-4 rounded-xl text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 transition-all duration-200 focus:outline-none"
                :disabled="isSubmitting"
              >
                Cancel
              </button>

              <button 
                type="submit" 
                class="relative flex justify-center items-center py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed group"
                :class="isEditing ? 'flex-[2]' : 'w-full'"
                :disabled="isSubmitting || !form.name || !form.role"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span v-else>{{ isEditing ? 'Update User' : 'Add User' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden h-full flex flex-col">
          <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 class="text-xl font-extrabold text-slate-800">User Directory</h3>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full whitespace-nowrap">
              <thead class="bg-slate-50/50">
                <tr class="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <th class="px-8 py-5">User Profile</th>
                  <th class="px-8 py-5 text-center">System Role</th>
                  <th class="px-8 py-5 text-center">User ID</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100/80">
                
                <template v-if="isLoading">
                  <tr v-for="i in 3" :key="i" class="animate-pulse">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
                        <div class="h-4 bg-slate-200 rounded w-24"></div>
                      </div>
                    </td>
                    <td class="px-8 py-5"><div class="h-6 bg-slate-100 rounded-full w-20 mx-auto"></div></td>
                    <td class="px-8 py-5"><div class="h-6 bg-slate-100 rounded-md w-32 mx-auto"></div></td>
                    <td class="px-8 py-5"><div class="h-8 bg-slate-200 rounded-lg w-8 ml-auto"></div></td>
                  </tr>
                </template>

                <tr v-else-if="users.length === 0">
                  <td colspan="4" class="px-8 py-20 text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-5 border border-slate-100 shadow-sm">
                      <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2">No Users Found</h4>
                    <p class="text-slate-500 font-medium">Create your first user account to grant access to the system.</p>
                  </td>
                </tr>

                <tr v-else v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors group" :class="{'bg-indigo-50/50': editingId === user.id}">
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-4">
                      <div :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md ring-2 transition-colors',
                        user.role === 'admin' ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 ring-white' : 'bg-gradient-to-tr from-blue-400 to-cyan-500 ring-white',
                        editingId === user.id ? '!ring-indigo-300' : ''
                      ]">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-slate-800" :class="{'text-indigo-700': editingId === user.id}">{{ user.name }}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member</span>
                      </div>
                    </div>
                  </td>
                  
                  <td class="px-8 py-5 text-center">
                    <div v-if="user.role === 'admin'" class="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider shadow-sm">
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      Admin
                    </div>
                    <div v-else class="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider shadow-sm">
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      User
                    </div>
                  </td>
                  
                  <td class="px-8 py-5 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-semibold border border-slate-200 tracking-wide" title="Copy ID">
                      {{ user.id }}
                    </span>
                  </td>
                  
                  <td class="px-8 py-5 text-right">
                    <div class="flex justify-end gap-2">
                      <button 
                        @click="startEdit(user)" 
                        class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border hover:border-indigo-100 transition-all focus:outline-none"
                        title="Edit User"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>

                      <button 
                        v-if="user.id !== currentUserId"
                        @click="openDeleteModal(user.id)" 
                        class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30 transition-all focus:outline-none"
                        title="Delete User"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                      <span v-else class="text-xs font-bold text-slate-300 tracking-wide uppercase px-2 flex items-center">You</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade-scale">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 transform transition-all">
          <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <svg class="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Delete Account?</h3>
          <p class="text-slate-500 text-center text-sm font-medium mb-8">Are you sure you want to permanently remove this user? They will immediately lose access to the system.</p>
          
          <div class="flex gap-3">
            <button @click="cancelDelete" :disabled="isDeleting" class="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors focus:outline-none">
              Cancel
            </button>
            <button @click="confirmDelete" :disabled="isDeleting" class="flex-1 relative flex justify-center items-center px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/30 transition-all focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
              <svg v-if="isDeleting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>Yes, Delete</span>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
// Ensure updateDoc is imported!
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';

import CustomAlert from '../components/CustomAlert.vue';

// Reactive state
const users = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const currentUserId = ref('');
const notification = ref({ show: false, message: '', type: 'success' });

// Edit State
const isEditing = ref(false);
const editingId = ref(null);

// Modal State
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(false);

const form = ref({
  name: '',
  role: ''
});

// Reference to 'users' collection
const usersCollection = collection(db, 'users');
let unsubscribe = null;

onMounted(() => {
  currentUserId.value = localStorage.getItem('userId');
  const q = query(usersCollection, orderBy('name', 'asc'));
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    users.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTimeout(() => { isLoading.value = false; }, 400);
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Handles both Create & Update
const submitForm = async () => {
  if (!form.value.name.trim() || !form.value.role) {
    showNotification('Please fill out all fields.', 'error');
    return;
  }
  
  isSubmitting.value = true;
  try {
    if (isEditing.value && editingId.value) {
      // UPDATE EXISTING USER
      const userRef = doc(db, 'users', editingId.value);
      await updateDoc(userRef, {
        name: form.value.name.trim().toLowerCase(),
        role: form.value.role
      });
      showNotification(`User ${form.value.name} updated successfully!`, 'success');
      cancelEdit();
    } else {
      // CREATE NEW USER
      await addDoc(usersCollection, {
        name: form.value.name.trim().toLowerCase(),
        role: form.value.role
      });
      showNotification(`User ${form.value.name} created successfully!`, 'success');
      form.value = { name: '', role: '' };
    }
  } catch (error) {
    console.error("Error saving user: ", error);
    showNotification(isEditing.value ? 'Failed to update user.' : 'Failed to create user account.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Edit Control Functions
const startEdit = (user) => {
  isEditing.value = true;
  editingId.value = user.id;
  form.value.name = user.name;
  form.value.role = user.role;
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll up to the form
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { name: '', role: '' };
};

// Custom Modal Delete Logic
const openDeleteModal = (id) => {
  // If they are currently editing the one they want to delete, cancel the edit first
  if (editingId.value === id) cancelEdit();
  
  userToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'users', userToDelete.value));
    showNotification('User account removed.', 'success');
    isDeleteModalOpen.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error("Error deleting user: ", error);
    showNotification('Failed to delete user.', 'error');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
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