import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/layout/Layout.vue";
import MiniLayout from "../components/mini_layout/MiniLayout.vue";
import { useLoginStore } from "../store/loginStore"; // ✅ Import your Pinia store
import { storeToRefs } from "pinia";
import { getDashboardRouteName, hasRouteAccess } from "../utils/roleNavigation";

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
      component: () => import("../views/Login2.vue"),
      meta: {
        requiresAuth: false,
        title: "Login",
        description: "Sign in to access the school management system.",
      },
    },

    // Super Admin Routes (existing dashboard routes)
    {
      path: "/dashboard",
      component: Layout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("../views/super_admin/Dashboard.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Dashboard",
            description:
              "View an overview of key statistics, reports, and recent activities in the school system.",
          },
        },
        {
          path: "/students",
          name: "students",
          component: () => import("../views/super_admin/Students.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Students",
            description:
              "Manage student information, enrollment, and performance records.",
          },
        },
        {
          path: "/students/search",
          name: "students-search",
          component: () => import("../views/super_admin/StudentSearch.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Student Search",
            description: "Search and filter students across all sessions.",
          },
        },
        {
          path: "/students/register",
          component: () =>
            import("../views/super_admin/student/RegisterStudent.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Register Students",
            description: "Register a new student.",
          },
        },
        {
          path: "/students/update/:id",
          component: () =>
            import("../views/super_admin/student/UpdateStudent.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Update Students",
            description: "Update student information.",
          },
        },
        {
          path: "/students/:studentId/subjects",
          name: "student-subjects",
          component: () =>
            import("../views/super_admin/student/StudentSubjects.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Student Subjects",
            description: "Manage student subject enrollment by term.",
          },
        },
        {
          path: "/students/management",
          name: "student-management",
          component: () => import("../views/super_admin/StudentManagement.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin", "admin"],
            title: "Student Management",
            description: "Manage student status and class promotions.",
          },
        },
        {
          path: "/staff",
          name: "staff",
          component: () => import("../views/super_admin/Staff.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin"],
            title: "Staff",
            description:
              "Manage teaching and administrative staff information.",
          },
        },
        {
          path: "/staff/register",
          name: "staff-register",
          component: () =>
            import("../views/super_admin/staff/StaffRegister.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin"],
            title: "Register Staff",
            description: "Register a new staff member.",
          },
        },
        {
          path: "/staff/update/:id",
          name: "staff-update",
          component: () => import("../views/super_admin/staff/StaffUpdate.vue"),
          meta: {
            requiresAuth: true,
            roles: ["super_admin"],
            title: "Update Staff",
            description: "Update staff member information.",
          },
        },
        {
          path: "/staff/profile/:id",
          name: "staff-profile",
          component: () =>
            import("../views/super_admin/staff/StaffProfile.vue"),
          meta: {
            requiresAuth: true,
            title: "Staff Profile",
            roles: ["super_admin"],
            description: "Staff member information.",
          },
        },
        {
          path: "/staff/activity",
          name: "staff-activity",
          component: () =>
            import("../views/super_admin/staff/StaffActivity.vue"),
          meta: {
            requiresAuth: true,
            title: "Staff Activity",
            roles: ["super_admin"],
            description: "Monitor staff login sessions and activity.",
          },
        },
        {
          path: "/parents",
          name: "parents",
          component: () => import("../views/super_admin/Parents.vue"),
          meta: {
            requiresAuth: true,
            title: "Parents",
            roles: ["super_admin", "admin"],
            description: "Manage parent and guardian information.",
          },
        },
        {
          path: "/classes",
          name: "classes",
          component: () => import("../views/super_admin/Classes.vue"),
          meta: {
            requiresAuth: true,
            title: "Classes",
            roles: ["super_admin", "admin"],
            description: "Manage school classes and sections.",
          },
        },
        {
          path: "/classes/:id/students",
          name: "class-students",
          component: () =>
            import("../views/super_admin/class/ClassStudents.vue"),
          meta: {
            requiresAuth: true,
            title: "Class Students",
            roles: ["super_admin", "admin"],
            description: "View all students in a class.",
          },
        },
        {
          path: "/subjects",
          name: "subjects",
          component: () => import("../views/super_admin/Subjects.vue"),
          meta: {
            requiresAuth: true,
            title: "Subjects",
            roles: ["super_admin", "admin"],
            description: "Manage academic subjects and curriculum.",
          },
        },
        // {
        //   path: "/attendance",
        //   name: "attendance",
        //   component: () => import("../views/super_admin/Attendance.vue"),
        //   meta: {
        //     requiresAuth: true,
        //     title: "Attendance",
        //     description: "Track and manage student attendance.",
        //   },
        // },
        // {
        //   path: "/grades",
        //   name: "grades",
        //   component: () => import("../views/super_admin/Grades.vue"),
        //   meta: {
        //     requiresAuth: true,
        //     title: "Grades",
        //     description: "Manage student grades and academic performance.",
        //   },
        // },
        {
          path: "/add-marks",
          name: "add-marks",
          component: () => import("../views/super_admin/eaxm/AddMarks.vue"),
          meta: {
            requiresAuth: true,
            title: "Add Marks",
            roles: ["super_admin", "admin"],
            description: "Enter examination marks for students.",
          },
        },
        {
          path: "/broadsheet",
          name: "broadsheet",
          component: () => import("../views/super_admin/eaxm/Broadsheet.vue"),
          meta: {
            requiresAuth: true,
            title: "Broadsheet",
            roles: ["super_admin", "admin"],
            description:
              "View comprehensive class performance report with rankings.",
          },
        },
        // {
        //   path: "/scoresheet",
        //   name: "scoresheet",
        //   component: () => import("../views/super_admin/Scoresheet.vue"),
        //   meta: {
        //     requiresAuth: true,
        //     title: "Scoresheet",
        //     roles: ['super_admin', 'admin'],
        //     description: "View detailed student scores for all subjects.",
        //   },
        // },
        {
          path: "/report-card",
          name: "report-card",
          component: () => import("../views/super_admin/eaxm/ReportCard.vue"),
          meta: {
            requiresAuth: true,
            title: "Report Card",
            roles: ["super_admin", "admin"],
            description: "Generate individual student report card.",
          },
        },
        {
          path: "/configuration",
          name: "configuration",
          component: () => import("../views/super_admin/Configuration.vue"),
          meta: {
            requiresAuth: true,
            title: "Configuration",
            roles: ["super_admin"],
            description: "Manage system settings and preferences.",
          },
        },
        {
          path: "/grades/register",
          name: "grades-register",
          component: () =>
            import("../views/super_admin/configuartion/grades/RegisterGradePage.vue"),
          meta: {
            requiresAuth: true,
            title: "Register Grade System",
            roles: ["super_admin"],

            description: "Create a new grading system.",
          },
        },
        {
          path: "/grades/update/:id",
          name: "grades-update",
          component: () =>
            import("../views/super_admin/configuartion/grades/UpdateGradePage.vue"),
          meta: {
            requiresAuth: true,
            title: "Update Grade System",
            roles: ["super_admin"],

            description: "Update grade system information.",
          },
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("../views/super_admin/Profile.vue"),
          meta: {
            requiresAuth: true,
            title: "My Profile",
            roles: ["super_admin", "admin"],

            description: "View and update your profile information.",
          },
        },
      ],
    },


    // Teacher Routes
    {
      path: "/teacher",
      component: MiniLayout,
      children: [
        {
          path: "",
          name: "teacher-dashboard",
          component: () => import("../views/teacher/Dashboard.vue"),
          meta: {
            requiresAuth: true,
            roles: ['teacher'],
            title: "Teacher Dashboard",
            description:
              "Manage your classes, students, and academic activities.",
          },
        },
        {
          path: "marks/add",
          name: "teacher-add-marks",
          component: () => import("../views/teacher/AddMarks.vue"),
          meta: {
            requiresAuth: true,
            roles: ["teacher"],
            title: "Enter Marks",
            description: "Record marks for your assigned classes.",
          },
        },
        // Add more teacher routes as needed
      ],
    },

    // Student Routes
    {
      path: "/student",
      component: Layout,
      children: [
        {
          path: "",
          name: "student-dashboard",
          component: () => import("../views/student_role/Dashboard.vue"),
          meta: {
            requiresAuth: true,
            // roles: ['student'],
            title: "Student Portal",
            description: "View your academic progress, grades, and schedule.",
          },
        },
        // Add more student routes as needed
      ],
    },

    // Parent Routes
    {
      path: "/parent",
      component: Layout,
      children: [
        {
          path: "",
          name: "parent-dashboard",
          component: () => import("../views/parent_role/Dashboard.vue"),
          meta: {
            requiresAuth: true,
            roles: ["parent"],
            title: "Parent Portal",
            description:
              "Monitor your children's academic progress and school activities.",
          },
        },
        // Add more parent routes as needed
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
  const { isAuthenticated, userRole } = storeToRefs(loginStore);

  document.title = to.meta.title
    ? `TebulaSheet | ${to.meta.title}`
    : "TebulaSheet";

  // Handle authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirect unauthenticated users to login
    next({ name: "login" });
    return;
  }

  if (to.meta.requiresGuest && isAuthenticated.value) {
    // Prevent logged-in users from accessing login page
    const dashboardRouteName = getDashboardRouteName(userRole.value);
    next({ name: dashboardRouteName });
    return;
  }

  // Handle role-based access control
  if (to.meta.roles && isAuthenticated.value) {
    const allowedRoles = to.meta.roles;

    if (!hasRouteAccess(userRole.value, allowedRoles)) {
      // User doesn't have permission for this route
      next({ name: "forbidden" });
      return;
    }
  }

  // Handle root path redirect based on user role
  if (to.path === "/" && isAuthenticated.value) {
    const dashboardRouteName = getDashboardRouteName(userRole.value);
    next({ name: dashboardRouteName });
    return;
  }

  next();
});

export default router;
