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
        to="/teacher"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-dashboard' }"
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

      <!-- My Classes -->
      <router-link
        to="/teacher/classes"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-classes' }"
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span>My Classes</span>
      </router-link>

      <!-- My Students -->
      <router-link
        to="/teacher/students"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-students' }"
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
        <span>My Students</span>
      </router-link>

      <!-- Enter Marks -->
      <router-link
        to="/teacher/marks/add"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-marks' }"
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <span>Enter Marks</span>
      </router-link>

      <!-- Attendance -->
      <router-link
        to="/teacher/attendance"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-attendance' }"
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
        <span>Attendance</span>
      </router-link>

      <!-- Class Reports -->
      <router-link
        to="/teacher/reports"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-reports' }"
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
        <span>Class Reports</span>
      </router-link>

      <!-- My Timetable -->
      <router-link
        to="/teacher/timetable"
        class="nav-item"
        :class="{ active: $route.name === 'teacher-timetable' }"
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
        <span>My Timetable</span>
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