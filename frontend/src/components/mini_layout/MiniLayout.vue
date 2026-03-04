<template>
  <div class="mini-layout-container">
    <TopHeader
      :current-page-name="currentPageName"
      :user-name="userName"
      :user-role="userRole"
    />
    <main class="mini-main-content">
      <div class="page-content">
        <router-view />
      </div>
    </main>
    <BottomNav :nav-items="navItems" @logout="logout" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TopHeader from "./TopHeader.vue";
import BottomNav from "./BottomNav.vue";
import DashboardIcon from "./icons/DashboardIcon.vue";
import AddMarksIcon from "./icons/AddMarksIcon.vue";
import ProfileIcon from "./icons/ProfileIcon.vue";
import LogoutIcon from "./icons/LogoutIcon.vue";
import { useLoginStore } from "../../store/loginStore";

const loginStore = useLoginStore();
const route = useRoute();
const router = useRouter();

// Mock user data - in real app, this would come from a store or props
const userName = "Mrs. Sarah Johnson";
const userRole = "Teacher";

// Navigation items for bottom nav
const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    route: "/teacher",
  },
  {
    id: "add-marks",
    label: "Add Marks",
    icon: AddMarksIcon,
    route: "/teacher/marks/add",
  },
  {
    id: "profile",
    label: "My Profile",
    icon: ProfileIcon,
    route: "/teacher-profile",
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogoutIcon,
    route: "/logout",
  },
];

// Compute current page name based on route
const currentPageName = computed(() => {
  const routeToTitle = {
    "/teacher": "Dashboard",
    "/teacher/marks/add": "Add Marks",
    "/teacher-profile": "My Profile",
    "/logout": "Logout",
  };

  return routeToTitle[route.path] || "Dashboard";
});

const logout = () => {
  loginStore.logout().then(() => {
    router.push({ name: "login" });
  });
};
</script>

<style scoped>
.mini-layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.mini-main-content {
  flex: 1;
  overflow-y: auto;
  padding-top: 70px; /* Space for fixed top header */
  padding-bottom: 80px; /* Space for fixed bottom nav */
}

.page-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-content {
    padding: 16px;
  }
}

@media (max-width: 1200px) {
  .page-content {
    max-width: 95%;
  }
}
</style>