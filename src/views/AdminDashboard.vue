<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">System Overview</h2>
        <p class="text-sm font-medium text-slate-500 mt-1">Real-time independent statistics for stock and usage.</p>
      </div>
    </div>

    <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Inventory by Category</h3>
    
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="i in 4" :key="i" class="h-36 bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse"></div>
    </div>

    <div v-else-if="categoryStats.length === 0" class="bg-white rounded-[2rem] border border-slate-100 p-8 text-center mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <p class="text-slate-500 font-medium">No category data available yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      
      <div v-for="stat in categoryStats" :key="stat.id" class="relative overflow-hidden bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full">
        
        <div class="relative z-10 mb-6 flex items-center gap-4">
          <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 font-black text-xl border border-slate-200 shadow-sm group-hover:bg-slate-800 group-hover:text-white transition-colors duration-300">
             {{ stat.name.charAt(0).toUpperCase() }}
          </div>
          <h3 class="text-slate-800 text-lg font-bold truncate" :title="stat.name">{{ stat.name }}</h3>
        </div>
        
        <div class="relative z-10 space-y-3 mt-auto">
          
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
            <span class="text-xs font-bold text-indigo-900 uppercase tracking-widest">Stock:</span>
            <span class="text-xl font-black text-indigo-600">{{ stat.totalStock }}</span>
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/50 border border-amber-100/50">
            <span class="text-xs font-bold text-amber-900 uppercase tracking-widest">Used:</span>
            <span class="text-xl font-black text-amber-600">{{ stat.totalUsed }}</span>
          </div>

        </div>
      </div>
      
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      <div class="px-8 py-6 border-b border-slate-100/80 bg-slate-50/50 flex justify-between items-center">
        <h3 class="text-xl font-extrabold text-slate-800">Recent Broken Reports</h3>
        <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold tracking-wide uppercase flex items-center shadow-sm border border-rose-200">
          <span class="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
          Live Alert
        </span>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead class="bg-slate-50/50">
            <tr class="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th class="px-8 py-5">User</th>
              <th class="px-8 py-5">Category</th>
              <th class="px-8 py-5 text-center">Quantity</th>
              <th class="px-8 py-5">Reason</th>
              <th class="px-8 py-5 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i" class="animate-pulse">
                <td class="px-8 py-5"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-slate-200 rounded-full"></div><div class="h-4 bg-slate-200 rounded w-24"></div></div></td>
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-32"></div></td>
                <td class="px-8 py-5"><div class="h-6 bg-slate-200 rounded-full w-8 mx-auto"></div></td>
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-48"></div></td>
                <td class="px-8 py-5 text-right"><div class="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
              </tr>
            </template>

            <tr v-else-if="recentBroken.length === 0">
              <td colspan="5" class="px-8 py-16 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4 border border-emerald-100">
                  <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 class="text-lg font-bold text-slate-800 mb-1">All Clear!</h4>
                <p class="text-slate-500 font-medium">No broken items reported yet. Everything is running smoothly.</p>
              </td>
            </tr>

            <tr v-else v-for="report in recentBroken" :key="report.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs mr-3 border border-indigo-200">
                    {{ getUserName(report.user_id).charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-bold text-slate-800">{{ getUserName(report.user_id) }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-sm font-bold text-slate-600">
                {{ getCategoryName(report.category_id) }}
              </td>
              <td class="px-8 py-5 text-center">
                <span class="inline-flex items-center justify-center px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-xs font-black shadow-sm">
                  {{ report.qty }}
                </span>
              </td>
              <td class="px-8 py-5">
                <span class="text-sm font-medium text-slate-500 max-w-xs truncate block" :title="report.message">
                  {{ report.message }}
                </span>
              </td>
              <td class="px-8 py-5 text-right text-xs font-bold text-slate-400">
                {{ formatDate(report.timestamp) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// Reactive State
const isLoading = ref(true);
const recentBroken = ref([]);
const categories = ref([]);
const users = ref([]);

// States for the separated collections
const stockRecords = ref([]);
const usedRecords = ref([]);

// Real-time Listeners
let unsubCategories, unsubUsers, unsubStock, unsubUsed, unsubBroken;

onMounted(() => {
  // 1. Fetch Categories 
  unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 2. Fetch Users
  unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 3. Fetch Stock Records
  unsubStock = onSnapshot(collection(db, 'stock'), (snapshot) => {
    stockRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 4. Fetch Used Records
  unsubUsed = onSnapshot(collection(db, 'used'), (snapshot) => {
    usedRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 5. Fetch Broken Reports
  const brokenQuery = query(collection(db, 'broken'), orderBy('timestamp', 'desc'), limit(5));
  unsubBroken = onSnapshot(brokenQuery, (snapshot) => {
    recentBroken.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTimeout(() => { isLoading.value = false; }, 400); 
  });
});

onUnmounted(() => {
  if (unsubCategories) unsubCategories();
  if (unsubUsers) unsubUsers();
  if (unsubStock) unsubStock();
  if (unsubUsed) unsubUsed();
  if (unsubBroken) unsubBroken();
});

// Calculate independent stats for EACH category
const categoryStats = computed(() => {
  if (!categories.value.length) return [];

  return categories.value.map(category => {
    // Sum up all stock entries for this specific category
    const totalStock = stockRecords.value
      .filter(record => record.categoryId === category.id)
      .reduce((sum, record) => sum + (Number(record.qty) || 0), 0);

    // Sum up all used entries for this specific category
    const totalUsed = usedRecords.value
      .filter(record => record.categoryId === category.id)
      .reduce((sum, record) => sum + (Number(record.qty) || 0), 0);

    return {
      id: category.id,
      name: category.name,
      totalStock,
      totalUsed
    };
  });
});

// Helper Functions
const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id);
  return cat ? cat.name : 'Unknown Category';
};

const getUserName = (id) => {
  const user = users.value.find(u => u.id === id);
  return user ? user.name : 'Unknown User';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  }).format(date);
};
</script>