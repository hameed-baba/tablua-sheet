import apiClient from "./apiClient";

export default {
  // ====================== AUTH ======================
  login(credentials) {
    return apiClient.post("/auth/login", credentials);
  },

  // =================== ROLE MANAGEMENT ===================
  getAllRoles() {
    return apiClient.get("/roles");
  },

  createRole(roleData) {
    return apiClient.post("/roles", roleData);
  },

  updateRole(roleId, roleData) {
    return apiClient.put(`/roles/${roleId}`, roleData);
  },

  deleteRole(roleId) {
    return apiClient.delete(`/roles/${roleId}`);
  },

  getAllPermissions() {
    return apiClient.get("/permissions");
  },
  getRolePermission(roleId) {
    return apiClient.get("/role-permissions/" + roleId);
  },

  // =================== STAFF MANAGEMENT ===================
  getAllStaffs(page) {
    let url = "/staff";
    if (page) {
      url += `?page=${page}`;
    }
    return apiClient.get(url);
  },
  createStaff(staffData) {
    return apiClient.post("/staff", staffData);
  },
  getStaffById(id) {
    return apiClient.get("/staff/" + id);
  },
  updateStaff(id, data) {
    return apiClient.put("/staff/" + id, data);
  },
  getStaffProfile(id) {
    return apiClient.get("/staff/profile/" + id);
  },
  deleteStaff(id) {
    return apiClient.delete("/staff/" + id);
  },
  toggleAccount(id) {
    return apiClient.patch(`/staff/${id}/toggle-access`);
  },
  toggleStaffStatus(id) {
    return apiClient.patch(`/staff/${id}/toggle-status`);
  },
  searchStaff(search) {
    return apiClient.get(`/staff?search=${search}`);
  },
  getStaffBySection(section_id) {
    return apiClient.get(`/staff/section/${section_id}`);
  },

  // =================== SECTIONS MANAGEMENT ===================
  getAllSections(page) {
    return apiClient.get(`/school-sections?page=${page}`);
  },
  createSection(sectionData) {
    return apiClient.post("/school-sections", sectionData);
  },
  getSectionById(id) {
    return apiClient.get("/school-sections/" + id);
  },
  updateSection(id, data) {
    return apiClient.put("/school-sections/" + id, data);
  },
  deleteSection(id) {
    return apiClient.delete("/school-sections/" + id);
  },

  // =================== SECTIONS MANAGEMENT ===================
  getAllSessions(page) {
    return apiClient.get(`/school-sessions?page=${page}`);
  },
  getAllRowSessions() {
    return apiClient.get("/school-sessions/row");
  },
  createSession(data) {
    return apiClient.post("/school-sessions", data);
  },
  getSessionById(id) {
    return apiClient.get("/school-sessions/" + id);
  },
  updateSession(id, data) {
    return apiClient.put("/school-sessions/" + id, data);
  },
  deleteSession(id) {
    return apiClient.delete("/school-sessions/" + id);
  },
  activateSession(id) {
    return apiClient.put(`/school-sessions/${id}/activate`);
  },

  // =================== TERM MANAGEMENT ===================
  getSessionTerms() {
    return apiClient.get("/school-terms/active-session");
  },
  updateTerm(id, data) {
    return apiClient.put("/school-terms/" + id, data);
  },
  activateTerm(id) {
    return apiClient.put(`/school-terms/${id}/activate`);
  },
  getAllTerm() {
    return apiClient.get("/school-terms");
  },
  // =================== SUBJECT MANAGEMENT ===================
  getAllSubject(page) {
    return apiClient.get(`/school-subjects/?page=${page}`);
  },
  createSubject(data) {
    return apiClient.post("/school-subjects", data);
  },
  updateSubject(id, data) {
    return apiClient.put(`/school-subjects/${id}`, data);
  },
  deleteSubject(id) {
    return apiClient.delete("/school-subjects/" + id);
  },

  // =================== PARENTS MANAGEMENT ===================

  getParents(page = 1) {
    return apiClient.get(`/parents?page=${page}`);
  },
  searchParents(search) {
    return apiClient.get(`/parents?search=${search}`);
  },
  createParent(data) {
    return apiClient.post("/parents", data);
  },
  updateParent(id, data) {
    return apiClient.put(`/parents/${id}`, data);
  },
  deleteParent(id) {
    return apiClient.delete("/parents/" + id);
  },
  searchParent(search) {
    return apiClient.get(`/parents?search=${search}`);
  },
  // =================== GRADE MANAGEMENT ===================
  getAllGarde() {
    return apiClient.get("/grade-lists");
  },
  createGrade(data) {
    return apiClient.post("/grade-lists", data);
  },
  updateGrade(id, data) {
    return apiClient.put("/grade-lists/" + id, data);
  },
  deleteGrade(id) {
    return apiClient.delete("/grade-lists/" + id);
  },
  // =================== CLASS MANAGEMENT ===================
  getAllClases(page) {
    return apiClient.get(`/school-classes?page=${page}`);
  },
  getAllRowClases() {
    return apiClient.get(`/school-classes/row`);
  },
  createClass(data) {
    return apiClient.post("/school-classes", data);
  },
  updateClass(id, data) {
    return apiClient.put("/school-classes/" + id, data);
  },
  deleteClass(id) {
    return apiClient.delete("/school-classes/" + id);
  },
  getClassStudents(classId) {
    return apiClient.get(`/school-classes/${classId}/students`);
  },
  getClassSubjects(classId) {
    return apiClient.get(`/school-classes/${classId}/subjects`);
  },
  assignSubjectToClass(classId, data) {
    return apiClient.post(`/school-classes/${classId}/subjects`, data);
  },
  updateClassSubject(classId, assignmentId, data) {
    return apiClient.put(
      `/school-classes/${classId}/subjects/${assignmentId}`,
      data
    );
  },
  removeClassSubject(classId, assignmentId) {
    return apiClient.delete(
      `/school-classes/${classId}/subjects/${assignmentId}`
    );
  },

  // =================== STUDENT SUBJECTS MANAGEMENT ===================
  getActivSessionStudents(page = 1) {
    return apiClient.get(`/students/session?page=${page}`);
  },
  searchActiveSessionStudents(search) {
    return apiClient.get(`/students/session?search=${search}`);
  },
  createStudent(data) {
    return apiClient.post("/students", data);
  },
  updateStudent(id, data) {
    return apiClient.put("/students/" + id, data);
  },
  getStudentById(id) {
    return apiClient.get("/students/" + id);
  },
  deleteStudent(id) {
    return apiClient.delete("/students/" + id);
  },
  searchStudentsByQuery(params) {
    return apiClient.get("/students/search/query", { params });
  },
  getStudentSubjects(studentId) {
    return apiClient.get(`/students/${studentId}/subjects`);
  },
  updateStudentSubjects(studentId, data) {
    return apiClient.put(`/students/${studentId}/subjects`, data);
  },
};
