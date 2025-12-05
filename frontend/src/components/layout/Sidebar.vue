<template>
  <!-- Mobile Overlay -->
  <div class="sidebar-overlay" :class="{ show: sidebarStore.isOpen && isMobile }" @click="sidebarStore.close"></div>

  <aside class="sidebar" :class="{
    collapsed: !sidebarStore.isOpen && isMobile,
    open: sidebarStore.isOpen && isMobile,
  }">
    <!-- Header / Logo -->
    <div class="sidebar-header">
      <div class="logo-icon">
        <!-- Placeholder logo icon -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FF5722" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="#FF5722" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#FF5722" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
      <span class="app-name">{{ configStore.schoolName || 'AmbaStack' }}</span>
    </div>

    <!-- User Profile Card -->
    <div class="user-profile-card">
      <div class="user-avatar">
        <span>{{ userInitials }}</span>
      </div>
      <div class="user-info">
        <span class="user-name">{{ userName }}</span>
        <span class="user-email">{{ userEmail }}</span>
      </div>
      <div class="user-menu-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- Navigation -->
    <div class="sidebar-content">
      <!-- Main Links -->
      <nav class="nav-section">
        <router-link to="/dashboard" class="nav-item" exact-active-class="active" @click="closeSidebarOnMobile">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 22V12h6v10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/students/search" class="nav-item" active-class="active" @click="closeSidebarOnMobile">
          <span class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="nav-label">Search</span>
        </router-link>
      </nav>

      <!-- Collapsible Sections -->
      <div class="collapsible-section">
        <div class="section-header" @click="toggleSection('management')">
          <svg class="chevron" :class="{ rotated: openSections.management }" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Management</span>
          <span class="plus-icon">+</span>
        </div>
        <div class="section-content" :class="{ show: openSections.management }">
          <router-link to="/students" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot teal"></span>
            <span class="nav-label">Students</span>
          </router-link>
          <router-link to="/parents" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot blue"></span>
            <span class="nav-label">Parents</span>
          </router-link>
          <router-link to="/staff" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot purple"></span>
            <span class="nav-label">Staff</span>
          </router-link>
        </div>
      </div>

      <div class="collapsible-section">
        <div class="section-header" @click="toggleSection('academics')">
          <svg class="chevron" :class="{ rotated: openSections.academics }" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Academics</span>
          <span class="plus-icon">+</span>
        </div>
        <div class="section-content" :class="{ show: openSections.academics }">
          <router-link to="/classes" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot orange"></span>
            <span class="nav-label">Classes</span>
          </router-link>
          <router-link to="/subjects" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot yellow"></span>
            <span class="nav-label">Subjects</span>
          </router-link>
          <router-link to="/attendance" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot green"></span>
            <span class="nav-label">Attendance</span>
          </router-link>
          <router-link to="/grades" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot red"></span>
            <span class="nav-label">Grades</span>
          </router-link>
        </div>
      </div>

      <div class="collapsible-section">
        <div class="section-header" @click="toggleSection('exams')">
          <svg class="chevron" :class="{ rotated: openSections.exams }" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Exams</span>
          <span class="plus-icon">+</span>
        </div>
        <div class="section-content" :class="{ show: openSections.exams }">
          <router-link to="/add-marks" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot indigo"></span>
            <span class="nav-label">Add Result</span>
          </router-link>
          <router-link to="/broadsheet" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot pink"></span>
            <span class="nav-label">Broadsheet</span>
          </router-link>
          <router-link to="/scoresheet" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot cyan"></span>
            <span class="nav-label">Scoresheet</span>
          </router-link>
          <router-link to="/report-card" class="nav-item sub-item" active-class="active" @click="closeSidebarOnMobile">
            <span class="color-dot lime"></span>
            <span class="nav-label">Report Card</span>
          </router-link>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
      <router-link to="/configuration" class="nav-item" active-class="active" @click="closeSidebarOnMobile">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="nav-label">Settings</span>
      </router-link>

      <a href="#" class="nav-item" @click.prevent="logout">
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18.36 6.64a9 9 0 11-12.73 0" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="12" y1="2" x2="12" y2="12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="nav-label">Support (Logout)</span>
      </a>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useSidebarStore } from "../../store/sidebarStore";
import { useConfigStore } from "../../store/configStore";
import { useLoginStore } from "../../store/loginStore";

const loginStore = useLoginStore();
const router = useRouter();
const sidebarStore = useSidebarStore();
const configStore = useConfigStore();

const isMobile = ref(false);
const openSections = reactive({
  management: true,
  academics: false,
  exams: false
});

const userName = computed(() => loginStore.user?.full_name || "User Name");
const userEmail = computed(() => loginStore.user?.email || "user@example.com");
const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return "GH";
  const parts = name.split(' ').filter(part => part.length > 0);
  if (parts.length === 0) return "GH";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

const toggleSection = (section) => {
  openSections[section] = !openSections[section];
};

const closeSidebarOnMobile = () => {
  if (isMobile.value) {
    sidebarStore.close();
  }
};

const logout = () => {
  loginStore.logout().then(() => {
    router.push({ name: "login" });
  });
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style lang="scss" scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #ffffff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  overflow-y: auto;
  border-right: 1px solid #f3f4f6;

  &.collapsed {
    transform: translateX(-100%);
  }

  &.open {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  .logo-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 87, 34, 0.1);
    border-radius: 8px;
  }

  .app-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1f2937;
    letter-spacing: -0.025em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.user-profile-card {
  background: #fef3c7; // Yellowish background
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    background: #78350f; // Dark brown/orange
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    span {
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user-info {
    flex: 1;
    min-width: 0;

    .user-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .user-menu-icon {
    color: #6b7280;
  }
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 500;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .nav-icon {
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover .nav-icon {
    color: #4b5563;
  }

  &.active .nav-icon {
    color: white;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    background: #ef4444;
    border-radius: 50%;
    margin-left: auto;
  }
}

.collapsible-section {
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    color: #111827;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    user-select: none;

    .chevron {
      color: #9ca3af;
      transition: transform 0.2s ease;

      &.rotated {
        transform: rotate(90deg);
      }
    }

    .plus-icon {
      margin-left: auto;
      color: #9ca3af;
      font-size: 1.25rem;
      font-weight: 400;
    }
  }

  .section-content {
    display: none;
    padding-left: 0.5rem;
    margin-top: 0.25rem;
    flex-direction: column;
    gap: 0.125rem;

    &.show {
      display: flex;
    }

    .sub-item {
      padding: 0.5rem 0.75rem 0.5rem 2rem;
      font-size: 0.875rem;
      color: #6b7280;
      position: relative;

      &:hover,
      &.active {
        color: #111827;
        background: transparent;
      }

      .color-dot {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-radius: 2px;

        &.teal {
          background: #2dd4bf;
        }

        &.blue {
          background: #60a5fa;
        }

        &.purple {
          background: #a78bfa;
        }

        &.orange {
          background: #fb923c;
        }

        &.yellow {
          background: #facc15;
        }

        &.green {
          background: #4ade80;
        }

        &.red {
          background: #f87171;
        }

        &.indigo {
          background: #818cf8;
        }

        &.pink {
          background: #f472b6;
        }

        &.cyan {
          background: #22d3ee;
        }

        &.lime {
          background: #a3e635;
        }
      }
    }
  }
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>