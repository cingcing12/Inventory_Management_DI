<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed bottom-4 right-4 z-50 flex items-center w-full max-w-xs p-4 space-x-3 text-gray-700 bg-white rounded-xl shadow-2xl border-l-4" :class="borderColor">
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg" :class="iconBgColor">
        <span class="text-xl">{{ icon }}</span>
      </div>
      <div class="text-sm font-semibold">{{ message }}</div>
      <button @click="show = false" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8">
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
  type: { type: String, default: 'success' }, // 'success', 'error', 'warning'
  message: String
});

const emit = defineEmits(['update:show']);

const borderColor = computed(() => {
  if (props.type === 'success') return 'border-green-500';
  if (props.type === 'error') return 'border-red-500';
  return 'border-yellow-500';
});

const iconBgColor = computed(() => {
  if (props.type === 'success') return 'bg-green-100 text-green-500';
  if (props.type === 'error') return 'bg-red-100 text-red-500';
  return 'bg-yellow-100 text-yellow-500';
});

const icon = computed(() => {
  if (props.type === 'success') return '✅';
  if (props.type === 'error') return '❌';
  return '⚠️';
});
</script>