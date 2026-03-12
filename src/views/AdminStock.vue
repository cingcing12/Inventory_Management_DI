<template>
  <div class="max-w-7xl mx-auto relative">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Manage Stock & Usage</h2>
        <p class="text-sm font-medium text-slate-500 mt-1">Independent records for your incoming items and outgoing usage.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-4 lg:sticky lg:top-8 h-fit">
        
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
          
          <div class="absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transition-colors duration-500" :class="activeTab === 'stock' ? 'bg-indigo-100' : 'bg-amber-100'"></div>

          <div class="flex p-1.5 bg-slate-100/80 rounded-2xl mb-8 relative z-10">
            <div class="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out" :class="activeTab === 'used' ? 'translate-x-full' : 'translate-x-0'"></div>
            
            <button @click="switchTab('stock')" class="relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300" :class="activeTab === 'stock' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'">
              📥 Stock Input
            </button>
            <button @click="switchTab('used')" class="relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300" :class="activeTab === 'used' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'">
              📤 Used Input
            </button>
          </div>

          <form @submit.prevent="saveRecord" class="space-y-6 relative z-10">
            
            <div class="relative">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Search & Select Category</label>
              
              <div @click="isDropdownOpen = true" class="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold cursor-pointer hover:bg-white transition-all shadow-sm" :class="[isDropdownOpen ? 'ring-2 ring-offset-2 bg-white border-transparent' : '', activeTab === 'stock' && isDropdownOpen ? 'ring-indigo-500' : activeTab === 'used' && isDropdownOpen ? 'ring-amber-500' : '']">
                <span v-if="categoryId" class="truncate">
                  {{ selectedCategoryName }} 
                  <span class="text-xs font-bold ml-1 opacity-60">({{ getQtyForCategory(categoryId) }})</span>
                </span>
                <span v-else class="text-slate-400 font-medium">Click to search...</span>
                <svg class="w-5 h-5 text-slate-400 transition-transform duration-300" :class="isDropdownOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40"></div>
              
              <transition name="fade-scale">
                <div v-if="isDropdownOpen" class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden p-2 origin-top">
                  <div class="relative mb-2">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input v-model="formSearchQuery" @click.stop type="text" placeholder="Filter categories..." class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:bg-white transition-all" :class="activeTab === 'stock' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'">
                  </div>
                  
                  <ul class="max-h-48 overflow-y-auto custom-scrollbar">
                    <li v-if="filteredCategories.length === 0" class="px-4 py-3 text-sm text-slate-500 text-center font-medium">No matches found.</li>
                    
                    <li v-for="cat in filteredCategories" :key="cat.id" @click="selectCategory(cat.id)" class="px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between group">
                      <div class="flex items-center gap-2">
                        <span>{{ cat.name }}</span>
                        <span class="px-2 py-0.5 text-[10px] font-black rounded-md bg-slate-100 text-slate-500 group-hover:bg-white border border-slate-200">
                          {{ getQtyForCategory(cat.id) }} {{ activeTab === 'stock' ? 'in stock' : 'used' }}
                        </span>
                      </div>
                      <svg v-if="categoryId === cat.id" class="w-4 h-4" :class="activeTab === 'stock' ? 'text-indigo-600' : 'text-amber-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </li>

                  </ul>
                </div>
              </transition>
            </div>

            <div>
              <label class="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2" :class="activeTab === 'stock' ? 'text-indigo-400' : 'text-amber-500'">
                <span>{{ activeTab === 'stock' ? 'Total In Stock' : 'Total Used' }}</span>
                <span v-if="isUpdating" class="text-slate-400">Editing existing data</span>
              </label>
              <input v-model.number="inputQty" type="number" min="0" class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 shadow-sm" :class="activeTab === 'stock' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'" required>
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="isSaving || !categoryId || inputQty < 0" class="w-full relative flex justify-center items-center py-3.5 px-4 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-lg disabled:opacity-70 group" :class="activeTab === 'stock' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-indigo-500/30' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/30'">
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span v-else>{{ isUpdating ? 'Update Quantity' : (activeTab === 'stock' ? 'Save New Stock' : 'Save Usage') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden h-full flex flex-col">
          
          <div class="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500" :class="activeTab === 'stock' ? 'border-b-indigo-100' : 'border-b-amber-100'">
            <div>
              <h3 class="text-xl font-extrabold text-slate-800 flex items-center">
                {{ activeTab === 'stock' ? 'Stock Inventory' : 'Usage Tracking' }}
              </h3>
              <span class="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border" :class="activeTab === 'stock' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'">
                Total Qty: {{ totalQuantity }}
              </span>
            </div>

            <div class="relative w-full sm:w-64">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              </div>
              
              <select 
                v-model="tableFilterCategory" 
                class="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
                :class="activeTab === 'stock' ? 'focus:ring-indigo-500' : 'focus:ring-amber-500'"
              >
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full whitespace-nowrap">
              <thead class="bg-slate-50/50">
                <tr class="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <th class="px-8 py-5">Last Updated</th>
                  <th class="px-8 py-5">Category</th>
                  <th class="px-8 py-5 text-center">Amount</th>
                  <th class="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100/80">
                
                <template v-if="isLoading">
                  <tr v-for="i in 4" :key="i" class="animate-pulse">
                    <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td class="px-8 py-5"><div class="h-5 bg-slate-200 rounded-md w-32"></div></td>
                    <td class="px-8 py-5"><div class="h-8 bg-slate-100 rounded-xl w-16 mx-auto"></div></td>
                    <td class="px-8 py-5"><div class="h-8 bg-slate-200 rounded-lg w-8 ml-auto"></div></td>
                  </tr>
                </template>

                <tr v-else-if="currentRecords.length === 0">
                  <td colspan="4" class="px-8 py-20 text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 border shadow-sm transition-colors duration-500" :class="activeTab === 'stock' ? 'bg-indigo-50 border-indigo-100' : 'bg-amber-50 border-amber-100'">
                      <svg class="w-10 h-10" :class="activeTab === 'stock' ? 'text-indigo-300' : 'text-amber-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h4 class="text-xl font-bold text-slate-800 mb-2">No {{ activeTab === 'stock' ? 'Stock' : 'Usage' }} Data</h4>
                    <p class="text-slate-500 font-medium">Add data using the form on the left.</p>
                  </td>
                </tr>

                <tr v-else-if="filteredTableRecords.length === 0">
                  <td colspan="4" class="px-8 py-16 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 border border-slate-100">
                      <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    </div>
                    <p class="text-slate-600 font-bold mb-1">No records for this category</p>
                    <p class="text-sm text-slate-500">There are no {{ activeTab === 'stock' ? 'stock' : 'usage' }} logs for the selected category.</p>
                  </td>
                </tr>

                <tr v-else v-for="item in filteredTableRecords" :key="item.id" class="hover:bg-slate-50/50 transition-colors group">
                  <td class="px-8 py-5 text-xs font-bold text-slate-500">
                    {{ formatDate(item.timestamp) }}
                  </td>
                  
                  <td class="px-8 py-5">
                    <span class="text-sm font-bold text-slate-800">{{ getCategoryName(item.categoryId) }}</span>
                  </td>
                  
                  <td class="px-8 py-5 text-center">
                    <span class="inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-xs font-black shadow-sm border" :class="activeTab === 'stock' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-amber-50 text-amber-700 border-amber-100'">
                      {{ item.qty }}
                    </span>
                  </td>
                  
                  <td class="px-8 py-5 text-right">
                    <button @click="openDeleteModal(item.id)" class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all focus:outline-none" title="Delete Record">
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
          <h3 class="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Delete Data?</h3>
          <p class="text-slate-500 text-center text-sm font-medium mb-8">Are you sure you want to permanently delete this quantity record?</p>
          <div class="flex gap-3">
            <button @click="cancelDelete" :disabled="isDeleting" class="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors focus:outline-none">Cancel</button>
            <button @click="confirmDelete" :disabled="isDeleting" class="flex-1 relative flex justify-center items-center px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/30 transition-all focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
              <svg v-if="isDeleting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>Yes, Delete</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <CustomAlert :show="notification.show" @update:show="notification.show = $event" :type="notification.type" :message="notification.message" />

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert.vue';

// Unified State
const activeTab = ref('stock'); // 'stock' or 'used'
const isLoading = ref(true);
const isSaving = ref(false);
const categories = ref([]);
const notification = ref({ show: false, message: '', type: 'success' });

// COMPLETELY SEPARATE DATA ARRAYS
const stockRecords = ref([]);
const usedRecords = ref([]);

// Form State
const isDropdownOpen = ref(false);
const formSearchQuery = ref(''); 
const categoryId = ref('');
const inputQty = ref(0);

// Table Filter State
const tableFilterCategory = ref(''); 

// Modal State
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

// Listeners
let unsubCategories, unsubStock, unsubUsed;

onMounted(() => {
  // Load Categories
  unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // Load Independent Stock Logs
  const stockQuery = query(collection(db, 'stock'), orderBy('timestamp', 'desc'));
  unsubStock = onSnapshot(stockQuery, (snapshot) => {
    stockRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTimeout(() => { isLoading.value = false; }, 300);
  });

  // Load Independent Used Logs
  const usedQuery = query(collection(db, 'used'), orderBy('timestamp', 'desc'));
  unsubUsed = onSnapshot(usedQuery, (snapshot) => {
    usedRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

onUnmounted(() => {
  if (unsubCategories) unsubCategories();
  if (unsubStock) unsubStock();
  if (unsubUsed) unsubUsed();
});

// NEW HELPER: Get the current quantity of a specific category from the active tab's data
const getQtyForCategory = (catId) => {
  const records = activeTab.value === 'stock' ? stockRecords.value : usedRecords.value;
  const existing = records.find(r => r.categoryId === catId);
  return existing ? existing.qty : 0;
};

// Calculate the sum of all quantities currently visible in the table!
const totalQuantity = computed(() => {
  return filteredTableRecords.value.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
});

// Check if we are updating existing data or logging new data
const isUpdating = computed(() => {
  if (!categoryId.value) return false;
  const records = activeTab.value === 'stock' ? stockRecords.value : usedRecords.value;
  return records.some(r => r.categoryId === categoryId.value);
});

// Auto-fill the form with existing data if it exists
const loadExistingQty = () => {
  if (!categoryId.value) {
    inputQty.value = 0;
    return;
  }
  inputQty.value = getQtyForCategory(categoryId.value);
};

// Switch tabs and refresh data
const switchTab = (tabName) => {
  activeTab.value = tabName;
  tableFilterCategory.value = ''; // Clean table filter
  loadExistingQty(); // Refresh the form input based on the new tab!
};

// Computed properties for FORM dropdown
const filteredCategories = computed(() => {
  if (!formSearchQuery.value) return categories.value;
  return categories.value.filter(c => c.name.toLowerCase().includes(formSearchQuery.value.toLowerCase()));
});

const selectedCategoryName = computed(() => {
  const cat = categories.value.find(c => c.id === categoryId.value);
  return cat ? cat.name : '';
});

// Select a category and automatically load the data!
const selectCategory = (id) => {
  categoryId.value = id;
  isDropdownOpen.value = false;
  formSearchQuery.value = '';
  loadExistingQty(); 
};

// UI Helpers
const getCategoryName = (id) => {
  const category = categories.value.find(c => c.id === id);
  return category ? category.name : 'Unknown';
};

// Computed property to determine base table data
const currentRecords = computed(() => {
  return activeTab.value === 'stock' ? stockRecords.value : usedRecords.value;
});

// Computed property for TABLE Dropdown filter
const filteredTableRecords = computed(() => {
  if (!tableFilterCategory.value) return currentRecords.value;
  return currentRecords.value.filter(record => record.categoryId === tableFilterCategory.value);
});

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date);
};

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => { notification.value.show = false; }, 3000);
};

// SAVE OR UPDATE RECORD 
const saveRecord = async () => {
  if (!categoryId.value || inputQty.value < 0) {
    showNotification('Please select a category and valid quantity.', 'error');
    return;
  }

  isSaving.value = true;
  const collectionName = activeTab.value === 'stock' ? 'stock' : 'used';

  try {
    await setDoc(doc(db, collectionName, categoryId.value), {
      categoryId: categoryId.value,
      qty: inputQty.value,
      timestamp: serverTimestamp()
    }, { merge: true }); 

    showNotification(isUpdating.value ? 'Quantity updated successfully!' : 'New record logged successfully!');
    
    categoryId.value = '';
    inputQty.value = 0;
  } catch (error) {
    console.error("Error saving:", error);
    showNotification('Failed to save data.', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Delete Logic
const openDeleteModal = (id) => {
  itemToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  const collectionName = activeTab.value === 'stock' ? 'stock' : 'used';

  try {
    await deleteDoc(doc(db, collectionName, itemToDelete.value));
    showNotification('Record deleted.', 'success');
    
    if (categoryId.value === itemToDelete.value) {
      categoryId.value = '';
      inputQty.value = 0;
    }

    isDeleteModalOpen.value = false;
    itemToDelete.value = null;
  } catch (error) {
    showNotification('Failed to delete.', 'error');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; 
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; 
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>