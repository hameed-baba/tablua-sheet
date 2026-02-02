<template>
  <div class="bottom-nav">
    <template v-for="item in navItems" :key="item.id">
      <!-- Regular navigation items -->
      <router-link 
        v-if="item.id !== 'logout'"
        :to="item.route"
        :class="['nav-item']"
        active-class="active"
      >
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </router-link>
      
      <!-- Logout button -->
      <button 
        v-else
        :class="['nav-item']"
        @click="$emit('logout')"
      >
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  navItems: {
    type: Array,
    required: true
  }
})

// Define emits
const emit = defineEmits(['logout'])
</script>

<style scoped>
/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 8px;
  min-width: 60px;
  cursor: pointer;
}

/* Button specific styles */
button.nav-item {
  border: none;
  background: none;
  font-family: inherit;
}

.nav-item:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.nav-item.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.logout-btn:hover {
  color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

.nav-item span {
  font-size: 12px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 480px) {
  .nav-item span {
    display: none;
  }
  
  .nav-item {
    min-width: 40px;
  }
}
</style>