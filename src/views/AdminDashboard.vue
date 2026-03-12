<template>
  <div class="max-w-7xl mx-auto pb-12 relative">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
      <div>
        <h2 class="text-4xl font-black text-slate-800 tracking-tight">System Overview</h2>
        <p class="text-sm font-medium text-slate-500 mt-1.5">Real-time telemetry of your inventory input, usage, and damages.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center bg-white border border-slate-200 shadow-sm rounded-full px-5 py-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2.5 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          <span class="text-xs font-bold text-slate-600 tracking-wider">SYSTEM LIVE</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      
      <div class="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out opacity-50"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Total Input Stock</p>
            <h4 class="text-5xl font-black text-slate-800 tracking-tight">{{ systemStats.stock }}</h4>
          </div>
          <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100/50 shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out opacity-50"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Total Used Items</p>
            <h4 class="text-5xl font-black text-slate-800 tracking-tight">{{ systemStats.used }}</h4>
          </div>
          <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100/50 shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-rose-100 to-rose-50 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-out opacity-50"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">Total Broken</p>
            <h4 class="text-5xl font-black text-slate-800 tracking-tight">{{ systemStats.broken }}</h4>
          </div>
          <div class="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100/50 shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
        </div>
      </div>

    </div>

    <div class="flex items-center justify-between mb-6 mt-4">
      <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Inventory Breakdown by Category</h3>
    </div>
    
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      <div v-for="i in 4" :key="i" class="h-48 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-pulse"></div>
    </div>

    <div v-else-if="categoryStats.length === 0" class="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
        <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <h3 class="text-xl font-black text-slate-800 mb-2">No Category Data</h3>
      <p class="text-slate-500 font-medium">Head over to the categories section to start organizing your stock.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      
      <div v-for="stat in categoryStats" :key="stat.id" class="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col relative group">
        
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center font-black text-lg border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
             {{ stat.name.charAt(0).toUpperCase() }}
          </div>
          <h3 class="text-slate-800 font-black text-lg truncate" :title="stat.name">{{ stat.name }}</h3>
        </div>
        
        <div class="mt-auto bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
          
          <div class="text-center flex-1">
            <p class="text-xl font-black text-indigo-600">{{ stat.totalStock }}</p>
            <p class="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">Input</p>
          </div>
          
          <div class="w-px h-10 bg-slate-200/80"></div>
          
          <div class="text-center flex-1">
            <p class="text-xl font-black text-amber-500">{{ stat.totalUsed }}</p>
            <p class="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">Used</p>
          </div>
          
          <div class="w-px h-10 bg-slate-200/80"></div>
          
          <div class="text-center flex-1">
            <p class="text-xl font-black text-rose-500">{{ stat.totalBroken }}</p>
            <p class="text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">Broken</p>
          </div>

        </div>

      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
      <div class="px-8 py-7 border-b border-slate-100/80 bg-slate-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shadow-inner">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <h3 class="text-xl font-extrabold text-slate-800">Live Incident Reports</h3>
            <p class="text-xs font-bold text-slate-500 mt-0.5">Most recent user-reported damages and broken stock.</p>
          </div>
        </div>
        <router-link to="/admin/logs" class="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow">
          View Full Logs &rarr;
        </router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead class="bg-white border-b border-slate-100">
            <tr class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th class="px-8 py-5">Reporter</th>
              <th class="px-8 py-5">Item Category</th>
              <th class="px-8 py-5 text-center">Amount</th>
              <th class="px-8 py-5">Incident Note</th>
              <th class="px-8 py-5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            
            <template v-if="isLoading">
              <tr v-for="i in 3" :key="i" class="animate-pulse">
                <td class="px-8 py-5"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-slate-200 rounded-full"></div><div class="h-4 bg-slate-200 rounded w-24"></div></div></td>
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                <td class="px-8 py-5"><div class="h-6 bg-slate-200 rounded-full w-8 mx-auto"></div></td>
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-48"></div></td>
                <td class="px-8 py-5 text-right"><div class="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
              </tr>
            </template>

            <tr v-else-if="recentBroken.length === 0">
              <td colspan="5" class="px-8 py-20 text-center">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-5 border border-emerald-100 shadow-sm">
                  <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 class="text-xl font-black text-slate-800 mb-1">Zero Incidents</h4>
                <p class="text-slate-500 text-sm font-medium">No broken items reported yet. Your inventory is perfectly safe.</p>
              </td>
            </tr>

            <tr v-else v-for="report in recentBroken" :key="report.id" class="hover:bg-slate-50/80 transition-colors group">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-black text-xs border border-slate-300 shadow-sm group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                    {{ getUserName(report.user_id).charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-bold text-slate-700">{{ getUserName(report.user_id) }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-sm font-black text-slate-600">
                {{ getCategoryName(report.category_id) }}
              </td>
              <td class="px-8 py-5 text-center">
                <span class="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-black shadow-sm">
                  {{ report.qty }}
                </span>
              </td>
              <td class="px-8 py-5">
                <span class="text-sm font-medium text-slate-500 max-w-xs truncate block" :title="report.message">
                  {{ report.message || 'No note provided.' }}
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
const brokenStockRecords = ref([]);

// Real-time Listeners
let unsubCategories, unsubUsers, unsubStock, unsubUsed, unsubBrokenStock, unsubBroken;

onMounted(() => {
  unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  unsubStock = onSnapshot(collection(db, 'stock'), (snapshot) => {
    stockRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  unsubUsed = onSnapshot(collection(db, 'used'), (snapshot) => {
    usedRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  unsubBrokenStock = onSnapshot(collection(db, 'broken_stock'), (snapshot) => {
    brokenStockRecords.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

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
  if (unsubBrokenStock) unsubBrokenStock();
  if (unsubBroken) unsubBroken();
});

// Calculate strictly 3 independent stats: Stock, Used, Broken (Available is removed!)
const categoryStats = computed(() => {
  if (!categories.value.length) return [];

  return categories.value.map(category => {
    const totalStock = stockRecords.value
      .filter(record => record.categoryId === category.id)
      .reduce((sum, record) => sum + (Number(record.qty) || 0), 0);

    const totalUsed = usedRecords.value
      .filter(record => record.categoryId === category.id)
      .reduce((sum, record) => sum + (Number(record.qty) || 0), 0);

    const totalBroken = brokenStockRecords.value
      .filter(record => record.categoryId === category.id)
      .reduce((sum, record) => sum + (Number(record.qty) || 0), 0);

    return {
      id: category.id,
      name: category.name,
      totalStock,
      totalUsed,
      totalBroken
    };
  }); 
});

// Calculate Grand Totals across the entire system (No Available logic)
const systemStats = computed(() => {
  let stock = 0, used = 0, broken = 0;
  
  categoryStats.value.forEach(c => {
    stock += c.totalStock;
    used += c.totalUsed;
    broken += c.totalBroken;
  });

  return {
    stock,
    used,
    broken
  };
});

// Helper Functions
const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id);
  return cat ? cat.name : 'Unknown';
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