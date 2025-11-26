<template>
  <header class="top-header">
    <div class="d-flex align-items-center">
      <button class="menu-toggle" @click="sidebarStore.toggle">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style="vertical-align:baseline;"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>

    <div class="user-profile" @click="goToProfile">
      <div class="user-info">
        <div class="user-name">{{ loginStore.currentUser?.full_name }}</div>
        <div class="user-role">{{ loginStore.userRole?.name }}</div>
      </div>
      <div class="user-avatar">{{ userInitials }}</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSidebarStore } from "../../store/sidebarStore";
import { useConfigStore } from "../../store/configStore";
import { useLoginStore } from "../../store/loginStore";

const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const configStore = useConfigStore();

const pageTitle = computed(() => {
  const titles = {
    dashboard: "Dashboard",
    students: "Students Management",
    staff: "Staff Management",
    "staff-register": "Add New Staff Member",
    "staff-update": "Update Staff Member",
    parents: "Parents Management",
    classes: "Classes Management",
    subjects: "Subjects Management",
    attendance: "Attendance Management",
    grades: "Grades Management",
  };
  return titles[route.name] || "Dashboard";
});

const userInitials = computed(() => {
  return loginStore.currentUser?.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const goToProfile = () => {
  router.push({ name: 'profile' });
};
</script>

