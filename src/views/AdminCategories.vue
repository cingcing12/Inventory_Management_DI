<template>
  <div class="max-w-7xl mx-auto relative">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Manage Categories</h2>
        <p class="text-sm font-medium text-slate-500 mt-1">Organize your inventory with custom categories.</p>
      </div>
      <div v-if="!isLoading" class="hidden sm:flex items-center bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5">
        <span class="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
        <span class="text-xs font-bold text-slate-600">{{ categories.length }} Active Categories</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-4">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 lg:sticky lg:top-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800">New Category</h3>
          </div>

          <form @submit.prevent="addCategory" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Name</label>
              <div class="relative">
                <input 
                  v-model="newCategoryName" 
                  type="text" 
                  placeholder="e.g., Motherboards"
                  class="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                  required
                  :disabled="isSubmitting"
                >
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              class="w-full relative flex justify-center items-center py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed group"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>Create Category</span>
            </button>
          </form>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden h-full flex flex-col">
          <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 class="text-xl font-extrabold text-slate-800">Category Directory</h3>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full whitespace-nowrap">
              <thead class="bg-slate-50/50">
                <tr class="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <th class="px-8 py-5">Category Name</th>
                  <th class="px-8 py-5 text-center">System ID</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100/80">
                
                <template v-if="isLoading">
                  <tr v-for="i in 4" :key="i" class="animate-pulse">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        <div class="h-4 bg-slate-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td class="px-8 py-5"><div class="h-6 bg-slate-100 rounded-md w-40 mx-auto"></div></td>
                    <td class="px-8 py-5"><div class="h-8 bg-slate-200 rounded-lg w-8 ml-auto"></div></td>
                  </tr>
                </template>

                <tr v-else-if="categories.length === 0">
                  <td colspan="3" class="px-8 py-20 text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-5 border border-slate-100 shadow-sm">
                      <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2">No Categories Found</h4>
                    <p class="text-slate-500 font-medium">Create your first category using the form to get started.</p>
                  </td>
                </tr>

                <tr v-else v-for="category in categories" :key="category.id" class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-8 py-5">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        <span class="font-black text-sm">{{ category.name.charAt(0).toUpperCase() }}</span>
                      </div>
                      <span class="text-sm font-bold text-slate-800">{{ category.name }}</span>
                    </div>
                  </td>
                  
                  <td class="px-8 py-5 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-semibold border border-slate-200 tracking-wide">
                      {{ category.id }}
                    </span>
                  </td>
                  
                  <td class="px-8 py-5 text-right">
                    <button 
                      @click="openDeleteModal(category.id)" 
                      class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/30 transition-all focus:outline-none"
                      title="Delete Category"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
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
          <h3 class="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Delete Category?</h3>
          <p class="text-slate-500 text-center text-sm font-medium mb-8">Are you sure you want to permanently delete this category? Any stock attached to it might lose its reference.</p>
          
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
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert.vue';

// Reactive state
const categories = ref([]);
const newCategoryName = ref('');
const isSubmitting = ref(false);
const isLoading = ref(true);
const notification = ref({ show: false, message: '', type: 'success' });

// Modal State
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(null);
const isDeleting = ref(false);

// Reference to the 'categories' collection
const categoriesCollection = collection(db, 'categories');

let unsubscribe = null;

onMounted(() => {
  const q = query(categoriesCollection, orderBy('name', 'asc'));
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Turn off skeleton loaders smoothly
    setTimeout(() => { isLoading.value = false; }, 400);
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// Helper for notifications
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Create Data
const addCategory = async () => {
  if (!newCategoryName.value.trim()) {
    showNotification('Category name cannot be empty.', 'error');
    return;
  }
  
  isSubmitting.value = true;
  try {
    await addDoc(categoriesCollection, {
      name: newCategoryName.value.trim()
    });
    newCategoryName.value = ''; 
    showNotification('Category successfully created!');
  } catch (error) {
    console.error("Error adding category: ", error);
    showNotification('Failed to create category.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// Custom Modal Delete Logic
const openDeleteModal = (id) => {
  categoryToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  categoryToDelete.value = null;
};

const confirmDelete = async () => {
  if (!categoryToDelete.value) return;

  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, 'categories', categoryToDelete.value));
    showNotification('Category deleted successfully.', 'success');
    isDeleteModalOpen.value = false;
    categoryToDelete.value = null;
  } catch (error) {
    console.error("Error deleting category: ", error);
    showNotification('Failed to delete category.', 'error');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
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