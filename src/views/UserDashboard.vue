<template>
  <div class="relative min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white flex flex-col items-center justify-center p-4 overflow-hidden">
    
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[80px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

    <header class="absolute top-0 w-full max-w-7xl px-6 py-6 flex items-center justify-between z-20">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <div class="hidden sm:block">
          <h1 class="text-lg font-black tracking-widest text-slate-800 leading-tight">INVENTORY</h1>
          <span class="text-[10px] font-bold text-indigo-500 tracking-[0.2em] uppercase">User Portal</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-bold text-slate-800">{{ currentUserName }}</p>
          <p class="text-xs font-medium text-slate-500">Staff Member</p>
        </div>
        <button @click="handleLogout" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm" title="Logout">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </header>

    <div class="w-full max-w-xl bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white p-8 md:p-12 relative z-10 transition-all duration-500">
      
      <transition name="fade">
        <div v-if="notification.show" class="absolute top-0 left-0 right-0 -translate-y-full pb-4 z-20">
          <div :class="[
            'p-4 rounded-2xl text-sm font-bold flex items-center justify-center shadow-lg border backdrop-blur-md',
            notification.type === 'error' ? 'bg-rose-500/90 text-white border-rose-400' : 'bg-emerald-500/90 text-white border-emerald-400'
          ]">
            <svg v-if="notification.type === 'error'" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
            {{ notification.message }}
          </div>
        </div>
      </transition>

      <transition name="fade-slide" mode="out-in">
        
        <div v-if="status === 'idle'" key="idle" class="text-center py-4">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6 border border-slate-200 shadow-inner">
            <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h2 class="text-3xl font-black text-slate-800 mb-3 tracking-tight">Take / Use Items</h2>
          <p class="text-slate-500 font-medium mb-10 max-w-sm mx-auto">For security reasons, you must request unlock permission from the admin before removing stock.</p>
          
          <button 
            @click="requestAccess" 
            class="w-full relative flex justify-center items-center py-4 px-6 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/30 group disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:-translate-y-1 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              Request Access via Telegram
            </span>
          </button>
        </div>

        <div v-else-if="status === 'pending'" key="pending" class="text-center py-10">
          <div class="relative w-24 h-24 mx-auto mb-8">
            <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center text-indigo-600">
              <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <h3 class="text-2xl font-black text-slate-800 mb-3 tracking-tight">Awaiting Approval</h3>
          <p class="text-slate-500 font-medium">A notification has been sent to the Admin. Waiting for them to approve your request via Telegram...</p>
        </div>

        <div v-else-if="status === 'true'" key="form" class="py-2">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-black text-slate-800 tracking-tight">Decrease Stock</h3>
            <div class="flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-xs font-bold uppercase tracking-wide shadow-sm">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span> Unlocked
            </div>
          </div>

          <div class="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold text-amber-700 flex items-start gap-2">
            <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p>Submitting this form will automatically decrease the inventory stock level for the selected item.</p>
          </div>

          <form @submit.prevent="submitStockUpdate" class="space-y-6">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Category</label>
              <div class="relative">
                <select v-model="form.categoryId" class="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 appearance-none cursor-pointer" required>
                  <option value="" disabled>Choose a category...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity to Take / Remove</label>
              <input v-model.number="form.qty" type="number" min="1" class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200" required>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Purpose / Note</label>
              <textarea v-model="form.message" rows="3" placeholder="e.g., Taken for office use, or item was broken..." class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-200 resize-none" required></textarea>
            </div>

            <button type="submit" class="w-full relative flex justify-center items-center py-4 px-6 rounded-2xl text-white font-bold text-lg bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed group" :disabled="isSubmitting">
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>Confirm & Decrease Stock</span>
            </button>
          </form>
        </div>

        <div v-else-if="status === 'false'" key="denied" class="text-center py-6">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 mb-6 border border-rose-100">
            <svg class="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-3xl font-black text-slate-800 mb-3 tracking-tight">Permission Denied</h3>
          <p class="text-rose-600 font-semibold mb-8">Your access request was rejected or revoked by the administrator.</p>
          <button @click="status = 'idle'" class="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            Return to Start
          </button>
        </div>

      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { db } from '../firebase';
// We added getDoc and setDoc here so we can do the math and update stock!
import { collection, onSnapshot, doc, addDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Router & State
const router = useRouter();
const currentUserName = ref('User');
const currentUserId = ref('');

const status = ref('idle'); 
const requestId = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);
const categories = ref([]);
const notification = ref({ show: false, message: '', type: 'success' });

const form = ref({
  categoryId: '',
  qty: 1,
  message: ''
});

onMounted(() => {
  currentUserName.value = localStorage.getItem('userName') || 'Staff Member';
  currentUserId.value = localStorage.getItem('userId') || 'unknown_user';

  onSnapshot(collection(db, 'categories'), (snapshot) => {
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
});

const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const handleLogout = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  router.push('/');
};

const requestAccess = async () => {
  isLoading.value = true;
  try {
    const res = await axios.post('https://inventory-management-di.onrender.com/api/request-permission', {
      userId: currentUserId.value,
      userName: currentUserName.value 
    });
    
    requestId.value = res.data.requestId;
    status.value = 'pending';
    listenToFirebaseChanges(requestId.value);
  } catch (error) {
    console.error("Error asking Node backend:", error);
    showNotification("Could not reach the server. Is Node.js running?", "error");
    status.value = 'idle';
  } finally {
    isLoading.value = false;
  }
};

const listenToFirebaseChanges = (id) => {
  onSnapshot(doc(db, "requests", id), (docSnap) => {
    if (docSnap.exists()) {
      status.value = docSnap.data().status; 
    }
  });
};

// THIS IS THE NEW LOGIC THAT DECREASES STOCK
const submitStockUpdate = async () => {
  isSubmitting.value = true;
  try {
    
    // 1. SAVE THE LOG HISTORY (The Admin will still see this in the Recent Reports table)
    await addDoc(collection(db, 'broken'), {
      user_id: currentUserId.value,
      category_id: form.value.categoryId,
      qty: form.value.qty,
      message: form.value.message,
      timestamp: serverTimestamp()
    });

    // 2. FETCH THE CURRENT STOCK LEVEL
    const stockRef = doc(db, 'stock', form.value.categoryId);
    const stockSnap = await getDoc(stockRef);

    let currentQty = 0;
    if (stockSnap.exists()) {
      currentQty = Number(stockSnap.data().qty) || 0;
    }

    // 3. SUBTRACT THE TAKEN AMOUNT
    const newQty = currentQty - form.value.qty;

    // 4. SAVE THE NEW DECREASED NUMBER BACK TO FIREBASE
    await setDoc(stockRef, {
      categoryId: form.value.categoryId,
      qty: newQty < 0 ? 0 : newQty, // Prevent stock from going into negative numbers
      updatedAt: serverTimestamp()
    }, { merge: true });

    showNotification('Stock decreased and logged successfully!');
    
    // Reset form and lock them back out after 2 seconds
    form.value = { categoryId: '', qty: 1, message: '' };
    setTimeout(() => {
      status.value = 'idle';
    }, 2000);

  } catch (error) {
    console.error("Error updating stock:", error);
    showNotification('Failed to update stock.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};



</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

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