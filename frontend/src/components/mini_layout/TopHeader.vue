<template>
  <div class="mini-top-header">
    <div class="header-content">
      <!-- Left side - Logo/Brand -->
      <div class="header-left">
        <span class="brand-name">{{ currentPageName }}</span>
      </div>

      <!-- Right side - User info (display only) -->
      <div class="header-right">
        <!-- User Profile (display only) -->
        <div class="user-profile">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Define props
const props = defineProps({
  currentPageName: {
    type: String,
    default: "Dashboard",
  },
  userName: {
    type: String,
    default: "Mrs. Sarah Johnson",
  },
  userRole: {
    type: String,
    default: "Teacher",
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
});

// Define emits

// Local state

// Computed properties
const userInitials = computed(() => {
  return props.userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
});
</script>

<style scoped>
.mini-top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1001;
  height: 70px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin: 0 auto;
  padding: 0 45px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #667eea;
}

.brand-name {
  font-size: 25px;
  font-weight: 700;
  color: #1e293b;
}

/* Center - Search */
.header-center {
  flex: 1;
  max-width: 400px;
  margin: 0 40px;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

/* Right side - User Profile */
/* .header-right {
  display: flex;
  align-items: center;
} */

/* User Profile (display only) */
.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 25px;
  background: #f8fafc;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #64748b;
  line-height: 1.2;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .header-center {
    display: none;
  }

  .brand-name {
    /* display: none; */
    font-size: 16px;
  }

  .user-info {
    display: none;
  }

  .user-profile {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .user-profile {
    padding: 4px;
  }
}
</style>