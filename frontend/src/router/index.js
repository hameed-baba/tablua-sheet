import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/layout/Layout.vue";
import { useLoginStore } from "../store/loginStore"; // ✅ Import your Pinia store
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/",
    //   redirect: "/dashboard"
    // },
    {
      path: "/",
      name: "login",
      component: () => import("../views/Login.vue"),
      meta: {
        requiresAuth: false,
        title: "Login",
        description: "Sign in to access the school management system.",
      },
    },
    {
      path: "/dashboard",
      component: Layout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/Dashboard.vue"),
          meta: {
            requiresAuth: true,
            title: "Dashboard",
            description:
              "View an overview of key statistics, reports, and recent activities in the school system.",
          },
        },
        {
          path: "/students",
          name: "students",
          component: () => import("../views/Students.vue"),
          meta: {
            requiresAuth: true,
            title: "Students",
            description:
              "Manage student information, enrollment, and performance records.",
          },
        },
        {
          path: "/students/search",
          name: "students-search",
          component: () => import("../views/StudentSearch.vue"),
          meta: {
            requiresAuth: true,
            title: "Student Search",
            description: "Search and filter students across all sessions.",
          },
        },
        {
          path: '/students/register',
          component: () => import('../views/student/RegisterStudent.vue'),
          title: "Register Students",

        },
        {
          path: '/students/update/:id',
          component: () => import('../views/student/UpdateStudent.vue'),
          title: "Update Students",

        },
        {
          path: '/students/:studentId/subjects',
          name: 'student-subjects',
          component: () => import('../views/student/StudentSubjects.vue'),
          meta: {
            requiresAuth: true,
            title: "Student Subjects",
            description: "Manage student subject enrollment by term.",
          },
        },
        {
          path: "/staff",
          name: "staff",
          component: () => import("../views/Staff.vue"),
          meta: {
            requiresAuth: true,
            title: "Staff",
            description:
              "Manage teaching and administrative staff information.",
          },
        },
        {
          path: "/staff/register",
          name: "staff-register",
          component: () => import("../views/staff/StaffRegister.vue"),
          meta: {
            requiresAuth: true,
            title: "Register Staff",
            description: "Register a new staff member.",
          },
        },
        {
          path: "/staff/update/:id",
          name: "staff-update",
          component: () => import("../views/staff/StaffUpdate.vue"),
          meta: {
            requiresAuth: true,
            title: "Update Staff",
            description: "Update staff member information.",
          },
        },
        {
          path: "/staff/profile/:id",
          name: "staff-profile",
          component: () => import("../views/staff/StaffProfile.vue"),
          meta: {
            requiresAuth: true,
            title: "Staff Profile",
            description: "Staff member information.",
          },
        },
        {
          path: "/parents",
          name: "parents",
          component: () => import("../views/Parents.vue"),
          meta: {
            requiresAuth: true,
            title: "Parents",
            description: "Manage parent and guardian information.",
          },
        },
        {
          path: "/classes",
          name: "classes",
          component: () => import("../views/Classes.vue"),
          meta: {
            requiresAuth: true,
            title: "Classes",
            description: "Manage school classes and sections.",
          },
        },
        {
          path: "/classes/:id/students",
          name: "class-students",
          component: () => import("../views/class/ClassStudents.vue"),
          meta: {
            requiresAuth: true,
            title: "Class Students",
            description: "View all students in a class.",
          },
        },
        {
          path: "/subjects",
          name: "subjects",
          component: () => import("../views/Subjects.vue"),
          meta: {
            requiresAuth: true,
            title: "Subjects",
            description: "Manage academic subjects and curriculum.",
          },
        },
        {
          path: "/attendance",
          name: "attendance",
          component: () => import("../views/Attendance.vue"),
          meta: {
            requiresAuth: true,
            title: "Attendance",
            description: "Track and manage student attendance.",
          },
        },
        {
          path: "/grades",
          name: "grades",
          component: () => import("../views/Grades.vue"),
          meta: {
            requiresAuth: true,
            title: "Grades",
            description: "Manage student grades and academic performance.",
          },
        },
        {
          path: "/add-marks",
          name: "add-marks",
          component: () => import("../views/AddMarks.vue"),
          meta: {
            requiresAuth: true,
            title: "Add Marks",
            description: "Enter examination marks for students.",
          },
        },
        {
          path: "/broadsheet",
          name: "broadsheet",
          component: () => import("../views/Broadsheet.vue"),
          meta: {
            requiresAuth: true,
            title: "Broadsheet",
            description: "View comprehensive class performance report with rankings.",
          },
        },
        {
          path: "/scoresheet",
          name: "scoresheet",
          component: () => import("../views/Scoresheet.vue"),
          meta: {
            requiresAuth: true,
            title: "Scoresheet",
            description: "View detailed student scores for all subjects.",
          },
        },
        {
          path: "/report-card",
          name: "report-card",
          component: () => import("../views/ReportCard.vue"),
          meta: {
            requiresAuth: true,
            title: "Report Card",
            description: "Generate individual student report card.",
          },
        },
        {
          path: "/configuration",
          name: "configuration",
          component: () => import("../views/Configuration.vue"),
          meta: {
            requiresAuth: true,
            title: "Configuration",
            description: "Manage system settings and preferences.",
          },
        },
        {
          path: "/grades/register",
          name: "grades-register",
          component: () => import("../views/configuartion/grades/RegisterGradePage.vue"),
          meta: {
            requiresAuth: true,
            title: "Register Grade System",
            description: "Create a new grading system.",
          },
        },
        {
          path: "/grades/update/:id",
          name: "grades-update",
          component: () => import("../views/configuartion/grades/UpdateGradePage.vue"),
          meta: {
            requiresAuth: true,
            title: "Update Grade System",
            description: "Update grade system information.",
          },
        },

        {
          path: "/roles",
          name: "roles",
          component: () => import("../views/Role.vue"),
          meta: {
            requiresAuth: true,
            title: "Role",
            description: "Manage staff role",
          },
        },

        {
          path: "/roles/register",
          name: "roles-register",
          component: () => import("../views/role/RegisterRole.vue"),
          meta: {
            requiresAuth: true,
            title: "Register Role",
            description: "Register staff role",
          },
        },

        {
          path: "/roles/update/:id",
          name: "roles-update",
          component: () => import("../views/role/UpdateRole.vue"),
          meta: {
            requiresAuth: true,
            title: "Register Role",
            description: "Register staff role",
          },
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("../views/Profile.vue"),
          meta: {
            requiresAuth: true,
            title: "My Profile",
            description: "View and update your profile information.",
          },
        },
      ],
    },
    {
      path: "/forbidden",
      name: "forbidden",
      component: () => import("../views/Forbidden.vue"),
      meta: {
        requiresAuth: false,
        title: "Access Denied",
        description: "You don't have permission to access this resource.",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFound.vue"),
      meta: {
        requiresAuth: false,
        title: "Page Not Found",
        description: "The requested page could not be found.",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();
  const { isAuthenticated } = storeToRefs(loginStore);

  document.title = to.meta.title
    ? `TebulaSheet | ${to.meta.title}`
    : "TebulaSheet";

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect unauthenticated users to login
    next({ name: "login" });
  } else if (to.meta.requiresGuest && isAuthenticated.value) {
    // Prevent logged-in users from accessing login page
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
