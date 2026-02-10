<template>
  <!-- Dynamic Role-based Sidebar -->
  <component :is="currentSidebar" v-if="currentSidebar" />

  <!-- Fallback to original sidebar for Super Admin or unknown roles -->
  <div v-else>
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
        <template v-for="item in navigationItems" :key="item.name">
          <!-- Regular nav item without dropdown -->
          <router-link
            v-if="!item.children"
            :to="item.path"
            class="nav-item"
            :class="{ active: $route.name === item.name }"
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
                :d="item.icon"
              />
            </svg>
            <span>{{ item.label }}</span>
          </router-link>

          <!-- Nav item with dropdown (Bootstrap style) -->
          <div v-else class="nav-item-wrapper">
            <a
              class="nav-item nav-link"
              :class="{
                active: isParentActive(item),
                collapsed: openDropdown !== item.name,
              }"
              @click="toggleDropdown(item.name)"
              role="button"
              aria-expanded="false"
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
                  :d="item.icon"
                />
              </svg>
              <span>{{ item.label }}</span>
              <svg
                class="dropdown-toggle-icon"
                :class="{ rotated: openDropdown === item.name }"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>

            <!-- Bootstrap Collapse -->
            <div class="collapse" :class="{ show: openDropdown === item.name }">
              <div class="nav flex-column">
                <router-link
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.path"
                  class="nav-link nav-link-sub"
                  :class="{ active: $route.name === child.name }"
                  @click="closeSidebarOnMobile"
                >
                  <svg
                    class="nav-icon-sub"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="child.icon"
                    />
                  </svg>
                  <span>{{ child.label }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </nav>

      <div class="upgrade-card">
        <h3>School Invoice</h3>
        <p>Manage, generate, and track all school invoices in one place.</p>
        <button class="upgrade-btn">View Now</button>
      </div>

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
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useSidebarStore } from "../../store/sidebarStore";
import { useLoginStore } from "../../store/loginStore";
import { getSchoolName } from "../../utils/schoolInfo";

// Import role-based sidebars
import TeacherSidebar from "./TeacherSidebar.vue";
import StudentSidebar from "./StudentSidebar.vue";
import ParentSidebar from "./ParentSidebar.vue";

const loginStore = useLoginStore();
const router = useRouter();
const sidebarStore = useSidebarStore();

const isMobile = ref(false);
const openDropdown = ref(null);

function formatSchoolName() {
  const name = getSchoolName();
  return name.length > 16 ? name.substring(0, 15) + ".." : name;
}

// Determine which sidebar component to show based on user role from localStorage
const currentSidebar = computed(() => {
  // Try to get role from loginStore first, then fallback to localStorage
  let userRole = loginStore.user?.role?.slug;

  // If not in store, try to get from localStorage
  if (!userRole) {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        // Try to get role slug from the nested structure
        userRole = parsedData.user?.role?.slug || parsedData.role?.slug;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  // Return appropriate sidebar component based on role
  switch (userRole) {
    case "teacher":
      return TeacherSidebar;
    case "student":
      return StudentSidebar;
    case "parent":
      return ParentSidebar;
    case "super_admin":
    case "admin":
    default:
      // Return null to show the original sidebar for super_admin, admin, or unknown roles
      return null;
  }
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const navigationItems = computed(() => {
  // Try to get role from loginStore first, then fallback to localStorage
  let userRole = loginStore.user?.role?.slug;

  // If not in store, try to get from localStorage
  if (!userRole) {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        // Try to get role slug from the nested structure
        userRole = parsedData.user?.role?.slug || parsedData.role?.slug;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      userRole = "super_admin"; // Default fallback
    }
  }

  // Helper function to check if user has access to an item
  const hasAccess = (item) => {
    if (!item.roles) return true; // If no roles specified, show to everyone
    return item.roles.includes(userRole);
  };

  // Filter navigation items based on user role
  const filterItems = (items) => {
    return items.filter((item) => {
      if (!hasAccess(item)) return false;

      // If item has children, filter them too
      if (item.children) {
        item.children = item.children.filter((child) => hasAccess(child));
        // Only show parent if it has accessible children
        return item.children.length > 0;
      }

      return true;
    });
  };

  // All navigation items with role permissions
  const allNavigationItems = [
    // Dashboard - available to super_admin and admin
    {
      name: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      roles: ["super_admin", "admin"],
    },

    // Students Management
    {
      name: "students",
      label: "Students",
      icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
      roles: ["super_admin", "admin"],
      children: [
        {
          name: "students",
          path: "/students",
          label: "All Students",
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          roles: ["super_admin", "admin"],
        },
        {
          name: "student-management",
          path: "/students/management",
          label: "Student Management",
          icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
          roles: ["super_admin", "admin"],
        },
      ],
    },

    // Parents - available to super_admin and admin
    {
      name: "parents",
      path: "/parents",
      label: "Parents",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      roles: ["super_admin", "admin"],
    },

    // Staff - only super_admin
    {
      name: "staff",
      path: "/staff",
      label: "Staff",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      roles: ["super_admin"],
    },

    // Staff Activity - only super_admin
    {
      name: "staff-activity",
      path: "/staff/activity",
      label: "Staff Activity",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      roles: ["super_admin"],
    },

    // Classes - available to super_admin and admin
    {
      name: "classes",
      path: "/classes",
      label: "Classes",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      roles: ["super_admin", "admin"],
    },

    // Subjects - available to super_admin and admin
    {
      name: "subjects",
      path: "/subjects",
      label: "Subjects",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      roles: ["super_admin", "admin"],
    },

    // Exam Management
    {
      name: "exam",
      label: "Exam",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      roles: ["super_admin", "admin"],
      children: [
        {
          name: "add-marks",
          path: "/add-marks",
          label: "Add Result",
          icon: "M12 4v16m8-8H4",
          roles: ["super_admin", "admin"],
        },
        {
          name: "broadsheet",
          path: "/broadsheet",
          label: "Broadsheet",
          icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
          roles: ["super_admin", "admin"],
        },
        {
          name: "report-card",
          path: "/report-card",
          label: "Report Card",
          icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
          roles: ["super_admin", "admin"],
        },
      ],
    },

    // Configuration - only super_admin
    {
      name: "configuration",
      path: "/configuration",
      label: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      roles: ["super_admin"],
    },

    // Profile - available to super_admin and admin
    {
      name: "profile",
      path: "/profile",
      label: "My Profile",
      icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      roles: ["super_admin", "admin"],
    },
  ];

  // Filter and return items based on user role
  return filterItems(allNavigationItems);
});

const toggleDropdown = (name) => {
  openDropdown.value = openDropdown.value === name ? null : name;
};

const isParentActive = (item) => {
  if (!item.children) return false;
  return item.children.some(
    (child) => router.currentRoute.value.name === child.name
  );
};

const logout = () => {
  loginStore.logout().then(() => {
    router.push({ name: "login" });
  });
};

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile when navigation item is clicked
  if (isMobile.value) {
    sidebarStore.close();
    openDropdown.value = null;
  }
};
</script>