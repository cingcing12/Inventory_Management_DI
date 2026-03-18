<template>
  <div class="max-w-7xl mx-auto relative">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Manage Stock & Usage</h2>
        <p class="text-sm font-medium text-slate-500 mt-1">Independent records for your incoming items and broken stock.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <div class="lg:col-span-4 lg:sticky lg:top-8 h-fit">
        
        <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
          
          <div class="absolute top-0 right-0 w-40 h-40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none transition-colors duration-500" :class="txMode === 'in' ? 'bg-indigo-100' : 'bg-rose-100'"></div>

          <div class="relative flex p-1.5 bg-slate-100/80 rounded-2xl mb-8 z-10">
            <div class="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-out"
                 :style="{ transform: txMode === 'in' ? 'translateX(0)' : 'translateX(100%)' }"></div>
            
            <button @click="txMode = 'in'" class="relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors duration-300" :class="txMode === 'in' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'">
              📥 Stock In
            </button>
            <button @click="txMode = 'out'" class="relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors duration-300" :class="txMode === 'out' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'">
              🚨 Stock Out
            </button>
          </div>

          <form @submit.prevent="saveTransaction" class="space-y-6 relative z-10">
            
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Item Category</label>
              <div class="relative">
                <select v-model="form.categoryId" class="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer" :class="txMode === 'in' ? 'focus:ring-indigo-500' : 'focus:ring-rose-500'" required>
                  <option value="" disabled>Select category...</option>
                  <option 
                    v-for="cat in categories" 
                    :key="cat.id" 
                    :value="cat.id"
                    :disabled="txMode === 'out' && getAvailableQty(cat.id) === 0"
                  >
                    {{ cat.name }} ({{ getAvailableQty(cat.id) }} available)
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-end mb-2">
                <label class="block text-[10px] font-black uppercase tracking-widest" :class="txMode === 'in' ? 'text-indigo-400' : 'text-rose-400'">
                  Quantity
                </label>
                <span v-if="txMode === 'out' && form.categoryId" class="text-[10px] font-bold text-slate-400">
                  Max: {{ getAvailableQty(form.categoryId) }}
                </span>
              </div>
              <input 
                v-model.number="form.qty" 
                type="number" 
                min="1" 
                :max="txMode === 'out' && form.categoryId ? getAvailableQty(form.categoryId) : null"
                class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm" 
                :class="txMode === 'in' ? 'focus:ring-indigo-500' : 'focus:ring-rose-500'" 
                required
              >
            </div>

            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason / Note</label>
              <textarea 
                v-model="form.reason" 
                rows="2" 
                :placeholder="txMode === 'in' ? 'e.g., New delivery from supplier...' : 'e.g., Given to IT Dept, or Item cracked...'" 
                class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none shadow-sm"
                :class="txMode === 'in' ? 'focus:ring-indigo-500' : 'focus:ring-rose-500'"
                :required="txMode === 'out'"
              ></textarea>
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="isSaving || !form.categoryId" class="w-full relative flex justify-center items-center py-4 px-4 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-lg disabled:opacity-70 group" :class="txMode === 'in' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'">
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span v-else>{{ txMode === 'in' ? 'Confirm Stock In' : 'Confirm Stock Out' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden h-full flex flex-col">
          
          <div class="flex border-b border-slate-100 bg-slate-50/50">
            <button @click="activeTableTab = 'in'" class="flex-1 py-5 text-xs font-black uppercase tracking-widest transition-colors border-b-2" :class="activeTableTab === 'in' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'">
              📥 Stock In History
            </button>
            <button @click="activeTableTab = 'broken'" class="flex-1 py-5 text-xs font-black uppercase tracking-widest transition-colors border-b-2" :class="activeTableTab === 'broken' ? 'border-rose-500 text-rose-700 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'">
              🚨 Out / Broken History
            </button>
          </div>
          
          <div class="overflow-x-auto flex-1">
            <table class="w-full whitespace-nowrap">
              <thead class="bg-white border-b border-slate-50">
                <tr class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th class="px-8 py-4">Date</th>
                  <th class="px-8 py-4">Category</th>
                  <th class="px-8 py-4 text-center">Amount</th>
                  <th class="px-8 py-4">Reason / Note</th>
                  <th class="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                
                <template v-if="isLoading">
                  <tr v-for="i in 4" :key="i" class="animate-pulse">
                    <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td class="px-8 py-5"><div class="h-5 bg-slate-200 rounded-md w-32"></div></td>
                    <td class="px-8 py-5"><div class="h-8 bg-slate-100 rounded-xl w-10 mx-auto"></div></td>
                    <td class="px-8 py-5"><div class="h-4 bg-slate-100 rounded-md w-48"></div></td>
                    <td class="px-8 py-5"><div class="h-8 bg-slate-200 rounded-lg w-8 ml-auto"></div></td>
                  </tr>
                </template>

                <tr v-else-if="currentTableData.length === 0">
                  <td colspan="5" class="px-8 py-20 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border shadow-sm transition-colors duration-500 bg-slate-50 border-slate-100">
                      <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <p class="text-slate-500 font-bold">No history available for this tab.</p>
                  </td>
                </tr>

                <tr v-else v-for="item in currentTableData" :key="item.id" class="hover:bg-slate-50/80 transition-colors group">
                  <td class="px-8 py-4 text-xs font-bold text-slate-500">
                    {{ formatDate(item.timestamp) }}
                  </td>
                  
                  <td class="px-8 py-4">
                    <span class="text-sm font-bold text-slate-800">{{ getCategoryName(item.categoryId || item.category_id) }}</span>
                  </td>
                  
                  <td class="px-8 py-4 text-center">
                    <span class="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1.5 rounded-xl text-xs font-black shadow-sm border" :class="activeTableTab === 'in' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'">
                      {{ activeTableTab === 'in' ? '+' : '-' }}{{ item.qty }}
                    </span>
                  </td>

                  <td class="px-8 py-4">
                    <span class="text-xs font-semibold text-slate-500 max-w-[200px] truncate block" :title="item.reason || item.message">
                      {{ item.reason || item.message || '—' }}
                    </span>
                  </td>
                  
                  <td class="px-8 py-4 text-right">
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
          <h3 class="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Delete Record?</h3>
          <p class="text-slate-500 text-center text-sm font-medium mb-8">Are you sure you want to permanently delete this log? The total stock numbers will adjust automatically.</p>
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
import { collection, onSnapshot, doc, getDoc, setDoc, addDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert.vue';

const txMode = ref('in'); 
const activeTableTab = ref('in'); 
const currentUserId = ref(''); 

const isLoading = ref(true);
const isSaving = ref(false);
const categories = ref([]);
const stockRecords = ref([]);
const usedRecords = ref([]);
const brokenRecords = ref([]);
const notification = ref({ show: false, message: '', type: 'success' });

const form = ref({ categoryId: '', qty: 1, reason: '' });

const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

let unsubCategories, unsubStock, unsubUsed, unsubBroken;

onMounted(() => {
  currentUserId.value = localStorage.getItem('userId') || 'ADMIN_MANUAL';

  unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const stockQuery = query(collection(db, 'stock'), orderBy('timestamp', 'desc'));
  unsubStock = onSnapshot(stockQuery, (snapshot) => {
    stockRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTimeout(() => { isLoading.value = false; }, 300);
  });

  const usedQuery = query(collection(db, 'used'), orderBy('timestamp', 'desc'));
  unsubUsed = onSnapshot(usedQuery, (snapshot) => {
    usedRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  const brokenQuery = query(collection(db, 'broken_stock'), orderBy('timestamp', 'desc'));
  unsubBroken = onSnapshot(brokenQuery, (snapshot) => {
    brokenRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

onUnmounted(() => {
  if (unsubCategories) unsubCategories();
  if (unsubStock) unsubStock();
  if (unsubUsed) unsubUsed();
  if (unsubBroken) unsubBroken();
});

const getAvailableQty = (catId) => {
  const totalIn = stockRecords.value.filter(r => r.categoryId === catId).reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
  const totalUsed = usedRecords.value.filter(r => r.categoryId === catId).reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
  const totalBroken = brokenRecords.value.filter(r => r.categoryId === catId).reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
  
  return totalIn - totalUsed - totalBroken;
};

// Switched to only show 'in' and 'broken'
const currentTableData = computed(() => {
  if (activeTableTab.value === 'in') return stockRecords.value;
  return brokenRecords.value;
});

const getCategoryName = (id) => {
  const category = categories.value.find(c => c.id === id);
  return category ? category.name : 'Unknown';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => { notification.value.show = false; }, 3000);
};

const saveTransaction = async () => {
  if (!form.value.categoryId || form.value.qty < 1) {
    showNotification('Please select a category and valid quantity.', 'error');
    return;
  }

  if (txMode.value === 'out') {
    const available = getAvailableQty(form.value.categoryId);
    if (form.value.qty > available) {
      showNotification(`Error: Only ${available} available in stock!`, 'error');
      return;
    }
  }

  isSaving.value = true;
  
  // Cleaned up logic: 'in' saves to stock, 'out' automatically saves to broken_stock
  const collectionName = txMode.value === 'in' ? 'stock' : 'broken_stock';

  try {
    await addDoc(collection(db, collectionName), {
      categoryId: form.value.categoryId,
      type: txMode.value, 
      qty: form.value.qty,
      reason: form.value.reason,
      user_id: currentUserId.value,
      timestamp: serverTimestamp()
    });

    await addDoc(collection(db, 'transactions'), {
      categoryId: form.value.categoryId,
      type: txMode.value, 
      qty: form.value.qty,
      reason: form.value.reason,
      user_id: currentUserId.value,
      timestamp: serverTimestamp()
    });

    showNotification(txMode.value === 'in' ? 'Stock added successfully!' : 'Stock removed successfully!', 'success');
    activeTableTab.value = txMode.value === 'in' ? 'in' : 'broken';
    form.value = { categoryId: '', qty: 1, reason: '' };
  } catch (error) {
    console.error("Error saving:", error);
    showNotification('Failed to save transaction.', 'error');
  } finally {
    isSaving.value = false;
  }
};

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
  
  // Cleaned up delete logic: matches the two active tabs
  const collectionName = activeTableTab.value === 'in' ? 'stock' : 'broken_stock';

  try {
    await deleteDoc(doc(db, collectionName, itemToDelete.value));
    showNotification('Record deleted. Stock totals updated automatically.', 'success');
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
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
  transform: scale(0.95);
}
</style>