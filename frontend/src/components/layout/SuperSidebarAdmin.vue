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
const openDropdown = ref(null);

function formatSchoolName() {
  const name = getSchoolName();
  return name.length > 16 ? name.substring(0, 15) + ".." : name;
}

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
  const userRole = loginStore.user?.role;

  // Base navigation items for all roles
  const baseItems = [
    {
      name: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      roles: ["super_admin", "admin", "teacher", "student", "parent"],
    },
    {
      name: "profile",
      path: "/profile",
      label: "My Profile",
      icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      roles: ["super_admin", "admin", "teacher", "student", "parent"],
    },
  ];

  // Role-specific navigation items
  const roleSpecificItems = {
    super_admin: [
      {
        name: "students",
        label: "Students",
        icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
        children: [
          {
            name: "students",
            path: "/students",
            label: "All Students",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          },
          {
            name: "student-management",
            path: "/students/management",
            label: "Student Management",
            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
          },
        ],
      },
      {
        name: "parents",
        path: "/parents",
        label: "Parents",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      },
      {
        name: "staff",
        path: "/staff",
        label: "Staff",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      },
      {
        name: "classes",
        path: "/classes",
        label: "Classes",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        name: "subjects",
        path: "/subjects",
        label: "Subjects",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
      {
        name: "exam",
        label: "Exam",
        icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        children: [
          {
            name: "add-marks",
            path: "/add-marks",
            label: "Add Result",
            icon: "M12 4v16m8-8H4",
          },
          {
            name: "broadsheet",
            path: "/broadsheet",
            label: "Broadsheet",
            icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
          },
          {
            name: "report-card",
            path: "/report-card",
            label: "Report Card",
            icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
          },
        ],
      },
      {
        name: "configuration",
        path: "/configuration",
        label: "Settings",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      },
    ],
    admin: [
      {
        name: "students",
        path: "/admin/students",
        label: "Students",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      },
      {
        name: "staff",
        path: "/admin/staff",
        label: "Staff",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      },
      {
        name: "classes",
        path: "/admin/classes",
        label: "Classes",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        name: "subjects",
        path: "/admin/subjects",
        label: "Subjects",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
      {
        name: "marks",
        path: "/admin/marks/add",
        label: "Enter Marks",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      },
      {
        name: "reports",
        path: "/admin/reports",
        label: "Reports",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
    ],
    teacher: [
      {
        name: "my-classes",
        path: "/teacher/classes",
        label: "My Classes",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      },
      {
        name: "my-students",
        path: "/teacher/students",
        label: "My Students",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      },
      {
        name: "enter-marks",
        path: "/teacher/marks/add",
        label: "Enter Marks",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
      },
      {
        name: "attendance",
        path: "/teacher/attendance",
        label: "Attendance",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        name: "class-reports",
        path: "/teacher/reports",
        label: "Class Reports",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        name: "timetable",
        path: "/teacher/timetable",
        label: "My Timetable",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      },
    ],
    student: [
      {
        name: "my-grades",
        path: "/student/grades",
        label: "My Grades",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        name: "my-subjects",
        path: "/student/subjects",
        label: "My Subjects",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
      {
        name: "report-card",
        path: "/student/report-card",
        label: "Report Card",
        icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      },
      {
        name: "my-attendance",
        path: "/student/attendance",
        label: "My Attendance",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        name: "class-timetable",
        path: "/student/timetable",
        label: "Class Timetable",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      },
      {
        name: "school-events",
        path: "/student/events",
        label: "School Events",
        icon: "M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z",
      },
    ],
    parent: [
      {
        name: "children-overview",
        path: "/parent/children",
        label: "Children Overview",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      },
      {
        name: "academic-performance",
        path: "/parent/children/grades",
        label: "Academic Performance",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      },
      {
        name: "attendance-records",
        path: "/parent/children/attendance",
        label: "Attendance Records",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        name: "communications",
        path: "/parent/communications",
        label: "Messages",
        icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      },
      {
        name: "parent-meetings",
        path: "/parent/meetings",
        label: "Parent Meetings",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      },
      {
        name: "school-events",
        path: "/parent/events",
        label: "School Events",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      },
      {
        name: "announcements",
        path: "/parent/announcements",
        label: "Announcements",
        icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
      },
    ],
  };

  // Get role-specific items or default to super_admin items
  const roleItems =
    roleSpecificItems[userRole] || roleSpecificItems.super_admin;

  // Combine base items with role-specific items
  return [...baseItems, ...roleItems];
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