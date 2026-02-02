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
  getTermAndSession(){
    return apiClient.get("/school-terms/active-terms-session");
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
  getClassAssignedSubjects(classId) {
    return apiClient.get(`/school-subjects/class-assign-subject/${classId}`);
  },
  getStaffWithSubjectsByClassId(classId) {
    return apiClient.get(`/school-subjects/class/${classId}`);
  },

  // =================== CLASS SUBJECTS ASSIGN MANAGEMENT ===================
  getAllClassSubjectsAssignments(page) {
    return apiClient.get(`/class-subject-assigns/?page=${page}`);
  },
  createClassSubjectAssignment(data) {
    return apiClient.post("/class-subject-assigns", data);
  },
  createBulkClassSubjectAssignment(data) {
    // Uses the same endpoint but with bulk data structure
    return apiClient.post("/class-subject-assigns", data);
  },
  assignSubjectToClassStudents(data) {
    return apiClient.post(
      "/class-subject-assigns/student/assign-subject",
      data,
    );
  },
  getClassSubjectAssignmentById(id) {
    return apiClient.get(`/class-subject-assigns/${id}`);
  },
  updateClassSubjectAssignment(id, data) {
    return apiClient.put(`/class-subject-assigns/${id}`, data);
  },
  getClassAssignedSubject(classId) {
    return apiClient.get(`/class-subject-assigns/class/${classId}`);
  },
  updateClassSubjectAssignment(id, data) {
    return apiClient.put(`/class-subject-assigns/${id}`, data);
  },
  deleteClassSubjectAssignment(id) {
    return apiClient.delete("/class-subject-assigns/" + id);
  },
  getClassAssignedSubjectByClassId(classId) {
    return apiClient.get(`/class-subject-assigns/class/${classId}`);
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
    return apiClient.get(`/subjects/class/${classId}`);
  },
  assignSubjectToClass(classId, data) {
    return apiClient.post(`/school-classes/${classId}/subjects`, data);
  },
  updateClassSubject(classId, assignmentId, data) {
    return apiClient.put(
      `/school-classes/${classId}/subjects/${assignmentId}`,
      data,
    );
  },
  removeClassSubject(classId, assignmentId) {
    return apiClient.delete(
      `/school-classes/${classId}/subjects/${assignmentId}`,
    );
  },

  // =================== STUDENT SUBJECTS MANAGEMENT ===================
  getActivSessionStudents(params = {}) {
    return apiClient.get("/students/session", { params });
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

  // Student Management Methods
  updateStudentStatus(studentId, data) {
    return apiClient.put(`/students/${studentId}/status`, data);
  },

  promoteStudent(studentId, data) {
    return apiClient.put(`/students/${studentId}/promote`, data);
  },

  bulkPromoteStudents(data) {
    return apiClient.put("/students/bulk-promote", data);
  },

  getStudentsByStatus(status, params = {}) {
    return apiClient.get(`/students/status/${status}`, { params });
  },
  searchStudentsByQuery(params) {
    return apiClient.get("/students/search", { params });
  },
  getStudentSubjects(studentId) {
    return apiClient.get(`/students/${studentId}/subjects`);
  },
  updateStudentSubjects(studentId, data) {
    return apiClient.put(`/students/${studentId}/subjects`, data);
  },

  getStudents(params = {}) {
    return apiClient.get("/students/search", { params });
  },
  getStudentsByClassId(classId, params = {}) {
    return apiClient.get(`/students/class/${classId}`, { params });
  },
  getStudentAssignedSubjects(studentId, params = {}) {
    return apiClient.get(`/students/${studentId}/subjects`, { params });
  },
  generateAddmissionNumber(){
    return apiClient.get("/students/generate-admission-number");
  },

  // ===================CA CONFIG MANAGEMENT ===================
  getLatestCaConfig() {
    return apiClient.get("/ca-configs/latest");
  },
  createCaConfig(data) {
    return apiClient.post("/ca-configs", data);
  },
  updateCaConfig(id, data) {
    return apiClient.put("/ca-configs/" + id, data);
  },

  // =================== STUDENT SUBJECT ASSIGN MARKS MANAGEMENT ===================

  // Update CA1 score for a student's subject assignment
  updateCA1Score(data) {
    return apiClient.put("/student-subject-assigns/update-ca1-score", data);
  },

  // Update exam score for a student's subject assignment
  updateExamScore(data) {
    return apiClient.put("/student-subject-assigns/update-exam-score", data);
  },

  // Update both CA1 and exam scores in a single request
  updateScores(data) {
    return apiClient.put("/student-subject-assigns/update-scores", data);
  },

  // Get student subject assignment by identifiers
  getByIdentifiers(params) {
    return apiClient.get("/student-subject-assigns/by-identifiers", { params });
  },

  // Get CA and exam marks for a student's subject assignment
  getMarks(params) {
    return apiClient.get("/student-subject-assigns/marks", { params });
  },

  // Note: getClassCAScores and getClassExamScores removed - use getAssignedSubjectsByFilters instead

  // Get all marks for a single student
  getStudentMarks(studentId, params = {}) {
    return apiClient.get(
      `/student-subject-assigns/student/${studentId}/marks`,
      { params },
    );
  },

  // Get student assigned subjects by class, subject, session, and term
  getAssignedSubjectsByFilters(params) {
    return apiClient.get("/student-subject-assigns/assigned-subjects", {
      params,
    });
  },

  getAssignedSubjects(current_class_id, current_session_id, current_term_id) {
    return apiClient.get(
      `/student-subject-assigns/assigned-subjects-2?current_class_id=${current_class_id}&current_session_id=${current_session_id}&current_term_id=${current_term_id}`,
    );
  },

  // Get all student subjects with scores by session, term, and class
  getAllStudentSubjectsWithScores(params) {
    return apiClient.get("/student-subject-assigns/all-subjects-with-scores", {
      params,
    });
  },

  // Get all student subject assignments
  getAllStudentSubjectAssigns(params = {}) {
    return apiClient.get("/student-subject-assigns", { params });
  },

  // Get student subject assignment by ID
  getStudentSubjectAssignById(id) {
    return apiClient.get(`/student-subject-assigns/${id}`);
  },

  // Create new student subject assignment
  createStudentSubjectAssign(data) {
    return apiClient.post("/student-subject-assigns", data);
  },

  // Update student subject assignment by ID
  updateStudentSubjectAssign(id, data) {
    return apiClient.put(`/student-subject-assigns/${id}`, data);
  },

  // Delete student subject assignment
  deleteStudentSubjectAssign(id) {
    return apiClient.delete(`/student-subject-assigns/${id}`);
  },

  // =================== STUDENT MANAGEMENT ===================
  // Update student status
  updateStudentStatus(studentId, status) {
    return apiClient.put(`/students/${studentId}/status`, {
      student_status: status,
    });
  },

  // Promote single student
  promoteStudent(studentId, data) {
    return apiClient.put(`/students/${studentId}/promote`, data);
  },

  // Bulk promote students
  bulkPromoteStudents(data) {
    return apiClient.put("/students/bulk-promote", data);
  },

  // Get students by status
  getStudentsByStatus(status, params = {}) {
    return apiClient.get(`/students/status/${status}`, { params });
  },

  // =================== PDF GENERATION ===================
  generatePdfMakeReport(data) {
    return apiClient.post("/pdf/generate-pdfmake", data, {
      responseType: "blob",
    });
  },


  // =================== STAFF ACTIVITY ===================
  getStaffActivityStatus() {
    return apiClient.get("/staff-activity/status");
  },
  getStaffSessions(staffId = null, params = {}) {
    const url = staffId
      ? `/staff-activity/sessions/${staffId}`
      : "/staff-activity/sessions";
    return apiClient.get(url, { params });
  },
  recordLogin(data) {
    return apiClient.post("/staff-activity/login", data);
  },
  recordLogout(data) {
    return apiClient.post("/staff-activity/logout", data);
  },
  cleanupStaleSessions() {
    return apiClient.post("/staff-activity/cleanup");
  },
  getStaffAssigned(id){
    return apiClient.get(`/staff/assigned-subjects/${id}`);
  },

  // =================== DASHBOARD ===================
  getDashboardSummary() {
    return apiClient.get("/dashboard/summary");
  },
  getDashboardOverview() {
    return apiClient.get("/dashboard/overview");
  },
 

  // =================== PDF ===================
  // generatePdfMakeReport2() {
  //   return apiClient.get("/pdf/generate-pdfmake-2", {
  //     responseType: "blob",
  //   });
  // },

  generatePdfMakeReport2(studentsData) {
    return apiClient.post(
      "/pdf/generate-pdfmake-2",
      studentsData,
      { responseType: "blob" }, // important to get PDF
    );
  },

  generatePdfBroadsheet(studentsData, classSubjects) {
    return apiClient.post(
      "/pdf/generate-broadheet",
      { studentsData, classSubjects },
      { responseType: "blob" }, // important to get PDF
    );
  },
};
