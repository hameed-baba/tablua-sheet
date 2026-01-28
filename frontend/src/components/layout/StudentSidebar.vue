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
        to="/student"
        class="nav-item"
        :class="{ active: $route.name === 'student-dashboard' }"
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

      <!-- My Grades -->
      <router-link
        to="/student/grades"
        class="nav-item"
        :class="{ active: $route.name === 'student-grades' }"
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
        <span>My Grades</span>
      </router-link>

      <!-- My Subjects -->
      <router-link
        to="/student/subjects"
        class="nav-item"
        :class="{ active: $route.name === 'student-subjects' }"
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <span>My Subjects</span>
      </router-link>

      <!-- Report Card -->
      <router-link
        to="/student/report-card"
        class="nav-item"
        :class="{ active: $route.name === 'student-report-card' }"
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
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Report Card</span>
      </router-link>

      <!-- My Attendance -->
      <router-link
        to="/student/attendance"
        class="nav-item"
        :class="{ active: $route.name === 'student-attendance' }"
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
        <span>My Attendance</span>
      </router-link>

      <!-- Class Timetable -->
      <router-link
        to="/student/timetable"
        class="nav-item"
        :class="{ active: $route.name === 'student-timetable' }"
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
        <span>Class Timetable</span>
      </router-link>

      <!-- School Events -->
      <router-link
        to="/student/events"
        class="nav-item"
        :class="{ active: $route.name === 'student-events' }"
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
            d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z"
          />
        </svg>
        <span>School Events</span>
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