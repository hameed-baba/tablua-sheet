import { defineStore } from "pinia";

export const useTeacherAssignedSubjectStore = defineStore(
  "teacherAssignedSubjectStore",
  {
    state: () => ({
      staff: null,
      summary: null,
      assignments: [],
      isSubjectLoaded: false,
    }),

    getters: {
      getStaff: (state) => state.staff,
      getSummary: (state) => state.summary,
      getAssignments: (state) => state.assignments,
      isLoaded: (state) => state.isSubjectLoaded,
    },

    actions: {
      SET_TEACHER_DATA(payload = {}) {
        this.staff = payload.staff || null;
        this.summary = payload.summary || null;
        this.assignments = payload.assignments || [];
        this.isSubjectLoaded = true;
      },

      CLEAR_TEACHER_DATA() {
        this.staff = null;
        this.summary = null;
        this.assignments = [];
        this.isSubjectLoaded = false;
      },
    },
  }
);
