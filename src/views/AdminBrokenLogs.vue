<template>
  <div class="max-w-7xl mx-auto relative">
    
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Broken Stock Logs</h2>
        <p class="text-sm font-medium text-slate-500 mt-1">Complete history of all reported damages and broken items.</p>
      </div>
      <div v-if="!isLoading" class="hidden sm:flex items-center bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5">
        <span class="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
        <span class="text-xs font-bold text-slate-600">Showing: {{ filteredRecords.length }} Reports</span>
      </div>
    </div>

    <div class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col mb-10">
      
      <div class="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <h3 class="text-xl font-extrabold text-slate-800 whitespace-nowrap">Log History</h3>
        
        <div class="flex flex-col lg:flex-row items-center gap-3 w-full xl:w-auto">
          
          <div class="flex bg-slate-200/60 p-1 rounded-xl w-full lg:w-auto shadow-inner border border-slate-200/80">
            <button @click="filterMode = 'all'" :class="filterMode === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex-1 lg:flex-none">All</button>
            <button @click="filterMode = 'today'" :class="filterMode === 'today' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex-1 lg:flex-none">Today</button>
            <button @click="filterMode = 'month'" :class="filterMode === 'month' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex-1 lg:flex-none">Monthly</button>
            <button @click="filterMode = 'year'" :class="filterMode === 'year' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'" class="px-4 py-2 text-xs font-bold rounded-lg transition-all flex-1 lg:flex-none">Yearly</button>
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="filterMode === 'month'" class="relative w-full lg:w-44">
              <select v-model="selectedMonth" class="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer">
                <option v-if="availableMonths.length === 0" value="" disabled>No Data</option>
                <option v-for="month in availableMonths" :key="month.value" :value="month.value">{{ month.label }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            <div v-else-if="filterMode === 'year'" class="relative w-full lg:w-32">
              <select v-model="selectedYear" class="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer">
                <option v-if="availableYears.length === 0" value="" disabled>No Data</option>
                <option v-for="year in availableYears" :key="year.value" :value="year.value">{{ year.label }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </transition>

          <div class="relative w-full lg:w-56">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Search reason..." class="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm">
          </div>

          <button 
            @click="exportToPDF" 
            :disabled="isExporting || filteredRecords.length === 0" 
            class="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-md rounded-xl text-sm font-black transition-all shadow-sm border border-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg v-if="isExporting" class="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <svg v-else class="w-4 h-4 text-indigo-600 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>{{ isExporting ? 'Exporting...' : 'Export PDF' }}</span>
          </button>

        </div>
      </div>
      
      <div class="overflow-x-auto flex-1">
        <table class="w-full whitespace-nowrap">
          <thead class="bg-slate-50/50 border-b border-slate-100">
            <tr class="text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th class="px-8 py-5">Date & Time</th>
              <th class="px-8 py-5">Reported By</th>
              <th class="px-8 py-5">Category</th>
              <th class="px-8 py-5 text-center">Quantity</th>
              <th class="px-8 py-5">Reason / Message</th>
              <th class="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100/80">
            
            <template v-if="isLoading">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                <td class="px-8 py-5"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-slate-200 rounded-full"></div><div class="h-4 bg-slate-200 rounded w-24"></div></div></td>
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-20"></div></td>
                <td class="px-8 py-5"><div class="h-6 bg-slate-200 rounded-full w-10 mx-auto"></div></td>
                <td class="px-8 py-5"><div class="h-4 bg-slate-200 rounded w-48"></div></td>
                <td class="px-8 py-5"><div class="h-8 bg-slate-200 rounded-lg w-8 ml-auto"></div></td>
              </tr>
            </template>

            <tr v-else-if="paginatedRecords.length === 0">
              <td colspan="6" class="px-8 py-20 text-center">
                <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-5 border border-slate-100 shadow-sm">
                  <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 class="text-xl font-bold text-slate-800 mb-2">No Reports Found</h4>
                <p class="text-slate-500 font-medium">Try adjusting your filters or selecting a different time frame.</p>
              </td>
            </tr>

            <tr v-else v-for="report in paginatedRecords" :key="report.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-5 text-xs font-bold text-slate-500">
                {{ formatDate(report.timestamp) }}
              </td>
              
              <td class="px-8 py-5">
                <div class="flex items-center">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 border shadow-sm',
                    report._collection === 'transactions' ? 'bg-gradient-to-tr from-rose-100 to-rose-200 text-rose-700 border-rose-200' : 'bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-700 border-indigo-200'
                  ]">
                    {{ getUserName(report.user_id).charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm font-bold text-slate-800">
                    {{ getUserName(report.user_id) }}
                    <span v-if="report._collection === 'transactions'" class="ml-1 text-[9px] text-rose-500 uppercase tracking-wide bg-rose-50 px-1.5 py-0.5 rounded">(Admin)</span>
                  </span>
                </div>
              </td>

              <td class="px-8 py-5">
                <span class="text-sm font-bold text-slate-600">{{ getCategoryName(report.category_id) }}</span>
              </td>
              
              <td class="px-8 py-5 text-center">
                <span class="inline-flex items-center justify-center px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-xs font-black shadow-sm">
                  {{ report.qty }}
                </span>
              </td>
              
              <td class="px-8 py-5">
                <span class="text-sm font-medium text-slate-500 max-w-sm truncate block" :title="report.message">
                  {{ report.message }}
                </span>
              </td>
              
              <td class="px-8 py-5 text-right">
                <button @click="openDeleteModal(report)" class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all focus:outline-none" title="Delete Report">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <span class="text-xs font-bold text-slate-500">
          Showing <span class="text-slate-800">{{ startIndex + 1 }}</span> to <span class="text-slate-800">{{ Math.min(endIndex, filteredRecords.length) }}</span> of <span class="text-slate-800">{{ filteredRecords.length }}</span> entries
        </span>
        
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="currentPage === 1" class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-black border border-indigo-100 shadow-sm">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

    </div>

    <div style="position: fixed; left: -9999px; top: 0; width: 1000px; z-index: -9999; visibility: hidden;">
      <div id="pdf-content" style="background-color: #ffffff; font-family: sans-serif; color: #1e293b;">
        
        <div v-for="(chunk, pageIndex) in pdfChunks" :key="pageIndex" :class="{'pdf-page-break': pageIndex > 0}" style="padding: 24px;">

          <div v-if="pageIndex === 0" style="margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px;">
            <h1 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Broken Stock & Usage Report</h1>
            <p style="font-size: 14px; color: #64748b; margin-top: 8px; font-weight: bold;">
              Generated: {{ new Date().toLocaleString() }} | Filter: {{ displayFilterContext }} | Total Records: {{ filteredRecords.length }}
            </p>
          </div>
          
          <div v-if="pageIndex > 0" style="margin-bottom: 16px; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
            Broken Stock Report (Continued)
          </div>

          <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #4f46e5; color: #ffffff;">
                <th style="padding: 10px 12px; border: 1px solid #4338ca; font-weight: bold; font-size: 14px;">Date & Time</th>
                <th style="padding: 10px 12px; border: 1px solid #4338ca; font-weight: bold; font-size: 14px;">Reported By</th>
                <th style="padding: 10px 12px; border: 1px solid #4338ca; font-weight: bold; font-size: 14px;">Category</th>
                <th style="padding: 10px 12px; border: 1px solid #4338ca; font-weight: bold; font-size: 14px; text-align: center;">Qty</th>
                <th style="padding: 10px 12px; border: 1px solid #4338ca; font-weight: bold; font-size: 14px;">Reason / Message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in chunk" :key="index" :style="{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }">
                <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-size: 13px;">{{ formatDate(record.timestamp) }}</td>
                <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-size: 13px;">{{ getUserName(record.user_id) }}</td>
                <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: bold; color: #334155;">{{ getCategoryName(record.category_id) }}</td>
                <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-size: 13px; text-align: center; font-weight: 900; color: #e11d48;">{{ record.qty }}</td>
                <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-size: 13px; line-height: 1.4;">{{ record.message || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <transition name="fade-scale">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 transform transition-all">
          <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <svg class="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">Delete Report?</h3>
          <p class="text-slate-500 text-center text-sm font-medium mb-8">Are you sure you want to permanently remove this broken stock report?</p>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert.vue';

import html2pdf from 'html2pdf.js';

const isLoading = ref(true);
const isExporting = ref(false); 

// Separate arrays for the two different streams of data
const userBrokenRecords = ref([]);
const adminTxRecords = ref([]);

const categories = ref([]);
const users = ref([]);

const searchQuery = ref('');
const filterMode = ref('all'); 
const selectedMonth = ref(''); 
const selectedYear = ref('');  

const notification = ref({ show: false, message: '', type: 'success' });
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null); 
const isDeleting = ref(false);

const currentPage = ref(1);
const itemsPerPage = 50;

let unsubBroken, unsubTransactions, unsubCategories, unsubUsers;

onMounted(() => {
  unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // 1. Fetch User Reports (from 'broken' collection)
  unsubBroken = onSnapshot(query(collection(db, 'broken'), orderBy('timestamp', 'desc')), (snapshot) => {
    userBrokenRecords.value = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      _collection: 'broken', 
      ...doc.data() 
    }));
    checkLoadingState();
  });

  // 2. Fetch Admin Manual Actions (from 'transactions' collection)
  unsubTransactions = onSnapshot(query(collection(db, 'transactions'), orderBy('timestamp', 'desc')), (snapshot) => {
    adminTxRecords.value = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      _collection: 'transactions', 
      ...doc.data() 
    }));
    checkLoadingState();
  });
});

const checkLoadingState = () => {
  setTimeout(() => { isLoading.value = false; }, 400);
};

onUnmounted(() => {
  if (unsubCategories) unsubCategories();
  if (unsubUsers) unsubUsers();
  if (unsubBroken) unsubBroken();
  if (unsubTransactions) unsubTransactions();
});

// --- MAGIC MERGE FUNCTION ---
const combinedRecords = computed(() => {
  const mappedAdminTx = adminTxRecords.value
    .filter(tx => tx.type === 'out') // Only grab the removals
    .map(tx => ({
      id: tx.id,
      _collection: 'transactions',
      user_id: tx.user_id || 'ADMIN_MANUAL', // <--- NOW READS THE REAL ADMIN ID!
      category_id: tx.categoryId,
      qty: tx.qty,
      message: tx.reason,
      timestamp: tx.timestamp
    }));

  const all = [...userBrokenRecords.value, ...mappedAdminTx];
  
  all.sort((a, b) => {
    const timeA = a.timestamp ? a.timestamp.toMillis() : Date.now();
    const timeB = b.timestamp ? b.timestamp.toMillis() : Date.now();
    return timeB - timeA;
  });
  
  return all;
});

const availableMonths = computed(() => {
  const map = new Map();
  combinedRecords.value.forEach(record => {
    if (!record.timestamp) return;
    const d = record.timestamp.toDate();
    const monthStr = d.getMonth().toString().padStart(2, '0');
    const key = `${d.getFullYear()}-${monthStr}`;
    if (!map.has(key)) {
      map.set(key, { value: key, label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }) });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.value.localeCompare(a.value));
});

const availableYears = computed(() => {
  const map = new Map();
  combinedRecords.value.forEach(record => {
    if (!record.timestamp) return;
    const d = record.timestamp.toDate();
    const year = d.getFullYear().toString();
    if (!map.has(year)) {
      map.set(year, { value: year, label: year });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.value.localeCompare(a.value));
});

const filteredRecords = computed(() => {
  let result = combinedRecords.value;

  if (filterMode.value !== 'all') {
    const now = new Date();
    if (filterMode.value === 'today') {
      result = result.filter(r => r.timestamp && r.timestamp.toDate().toDateString() === now.toDateString());
    } 
    else if (filterMode.value === 'month' && selectedMonth.value) {
      const [yearStr, monthStr] = selectedMonth.value.split('-');
      result = result.filter(r => {
        if (!r.timestamp) return false;
        const d = r.timestamp.toDate();
        return d.getFullYear() === parseInt(yearStr) && d.getMonth() === parseInt(monthStr);
      });
    } 
    else if (filterMode.value === 'year' && selectedYear.value) {
      result = result.filter(r => {
        if (!r.timestamp) return false;
        return r.timestamp.toDate().getFullYear() === parseInt(selectedYear.value);
      });
    }
  }

  if (searchQuery.value) {
    const lowerSearch = searchQuery.value.toLowerCase();
    result = result.filter(record => {
      const catName = getCategoryName(record.category_id).toLowerCase();
      const reason = (record.message || '').toLowerCase();
      return catName.includes(lowerSearch) || reason.includes(lowerSearch);
    });
  }

  return result;
});

const pdfChunks = computed(() => {
  const chunks = [];
  const records = filteredRecords.value;
  
  const firstPageSize = 10; 
  const normalPageSize = 13; 
  
  if (records.length === 0) return [];
  
  chunks.push(records.slice(0, firstPageSize));
  
  for (let i = firstPageSize; i < records.length; i += normalPageSize) {
    chunks.push(records.slice(i, i + normalPageSize));
  }
  
  return chunks;
});

const displayFilterContext = computed(() => {
  if (filterMode.value === 'today') return 'Today';
  if (filterMode.value === 'month') {
    const m = availableMonths.value.find(x => x.value === selectedMonth.value);
    return m ? m.label : 'Monthly';
  }
  if (filterMode.value === 'year') {
    const y = availableYears.value.find(x => x.value === selectedYear.value);
    return y ? y.label : 'Yearly';
  }
  return 'All Time';
});

watch(filterMode, (newMode) => {
  currentPage.value = 1;
  if (newMode === 'month' && !selectedMonth.value && availableMonths.value.length > 0) {
    selectedMonth.value = availableMonths.value[0].value;
  }
  if (newMode === 'year' && !selectedYear.value && availableYears.value.length > 0) {
    selectedYear.value = availableYears.value[0].value;
  }
});

watch([searchQuery, selectedMonth, selectedYear], () => {
  currentPage.value = 1;
});

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id);
  return cat ? cat.name : 'Unknown';
};

// --- UPDATED USER NAME HELPER ---
const getUserName = (id) => {
  if (id === 'ADMIN_MANUAL') return 'Administrator (Legacy)'; // Fallback for old transactions before we added the ID
  const user = users.value.find(u => u.id === id);
  return user ? user.name : 'Unknown User'; // Now returns the ACTUAL Admin's name!
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date);
};

// Pagination Logic
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / itemsPerPage)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedRecords = computed(() => {
  return filteredRecords.value.slice(startIndex.value, endIndex.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const openDeleteModal = (report) => {
  itemToDelete.value = report;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  itemToDelete.value = null;
};

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => { notification.value.show = false; }, 3000);
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteDoc(doc(db, itemToDelete.value._collection, itemToDelete.value.id));
    showNotification('Report permanently deleted.', 'success');
    isDeleteModalOpen.value = false;
    itemToDelete.value = null;
  } catch (error) {
    showNotification('Failed to delete report.', 'error');
  } finally {
    isDeleting.value = false;
  }
};

const exportToPDF = async () => {
  isExporting.value = true;
  
  try {
    const element = document.getElementById('pdf-content');
    const fileNameDate = new Date().toISOString().split('T')[0];
    
    const filterName = displayFilterContext.value.replace(/ /g, '_');

    const opt = {
      margin:       [0.5, 0.5, 0.5, 0.5], 
      filename:     `Broken_Stock_Report_${filterName}_${fileNameDate}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, scrollX: 0, scrollY: 0 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' },
      pagebreak:    { mode: 'css', before: '.pdf-page-break' } 
    };

    await html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        const totalPagesCount = pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= totalPagesCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(148, 163, 184);
          
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          pdf.text(
            `Page ${i} of ${totalPagesCount}`, 
            pageWidth - 0.5, 
            pageHeight - 0.3, 
            { align: 'right' }
          );
        }
      })
      .save();
    
    showNotification('PDF Downloaded successfully!', 'success');
  } catch (error) {
    console.error("PDF Export Error:", error);
    showNotification('Failed to generate PDF.', 'error');
  } finally {
    isExporting.value = false;
  }
};
</script>