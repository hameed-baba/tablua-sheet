<template>
  <!-- Mobile Overlay - only show on mobile when sidebar is open -->
  <div
    class="sidebar-overlay"
    :class="{ show: sidebarStore.isOpen && isMobile }"
    @click="sidebarStore.close"
  ></div>

  <aside
    class="sidebar"
    :class="{
      collapsed: !sidebarStore.isOpen && isMobile,
      open: sidebarStore.isOpen && isMobile,
    }"
  >
    <div class="logo">
      {{ formatSchoolName() }}
    </div>

    <nav class="nav-items">
      <!-- Dashboard -->
      <router-link
        to="/parent"
        class="nav-item"
        :class="{ active: $route.name === 'parent-dashboard' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>Dashboard</span>
      </router-link>

      <!-- Children Overview -->
      <router-link
        to="/parent/children"
        class="nav-item"
        :class="{ active: $route.name === 'parent-children' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span>Children Overview</span>
      </router-link>

      <!-- Academic Performance -->
      <router-link
        to="/parent/children/grades"
        class="nav-item"
        :class="{ active: $route.name === 'parent-grades' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span>Academic Performance</span>
      </router-link>

      <!-- Attendance Records -->
      <router-link
        to="/parent/children/attendance"
        class="nav-item"
        :class="{ active: $route.name === 'parent-attendance' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Attendance Records</span>
      </router-link>

      <!-- Messages -->
      <router-link
        to="/parent/communications"
        class="nav-item"
        :class="{ active: $route.name === 'parent-communications' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>Messages</span>
      </router-link>

      <!-- Parent Meetings -->
      <router-link
        to="/parent/meetings"
        class="nav-item"
        :class="{ active: $route.name === 'parent-meetings' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Parent Meetings</span>
      </router-link>

      <!-- School Events -->
      <router-link
        to="/parent/events"
        class="nav-item"
        :class="{ active: $route.name === 'parent-events' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>School Events</span>
      </router-link>

      <!-- Announcements -->
      <router-link
        to="/parent/announcements"
        class="nav-item"
        :class="{ active: $route.name === 'parent-announcements' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
        <span>Announcements</span>
      </router-link>

      <!-- Profile -->
      <router-link
        to="/profile"
        class="nav-item"
        :class="{ active: $route.name === 'profile' }"
        @click="closeSidebarOnMobile"
      >
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>My Profile</span>
      </router-link>
    </nav>

    <button class="logout-btn" @click="logout">
      <svg
        class="nav-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Logout</span>
    </button>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useSidebarStore } from "../../store/sidebarStore";
import { useLoginStore } from "../../store/loginStore";
import { getSchoolName } from "../../utils/schoolInfo";

const loginStore = useLoginStore();
const router = useRouter();
const sidebarStore = useSidebarStore();

const isMobile = ref(false);

function formatSchoolName() {
  const name = getSchoolName();
  return name.length > 16 ? name.substring(0, 15) + ".." : name;
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
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