<template>
  <div class="page">
    <div class="page-header mt-4">
      <div>
        <h1>{{ classInfo.class_name || "Class" }} <small>Students</small></h1>
        <p>
          <b> Class Master:</b> {{ classInfo.class_master }} | <b>Section:</b>
          {{ classInfo.class_section }} | <b>Grading:</b>
          {{ classInfo.grade_name }}
        </p>
      </div>
      <button class="add-btn" @click="goBack">
        <i class="fa fa-arrow-left mt-1"></i>
        Back to Classes
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <div class="sum-box">
            <i class="fa fa-spinner fa-spin" v-if="loading"></i>
            <h3 v-else>{{ summary.totalStudents }}</h3>
          </div>
          <p>Total Students</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <div class="sum-box">
            <i class="fa fa-spinner fa-spin" v-if="loading"></i>
            <h3 v-else>{{ summary.totalMale }}</h3>
          </div>
          <p>Male Students</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <div class="sum-box">
            <i class="fa fa-spinner fa-spin" v-if="loading"></i>
            <h3 v-else>{{ summary.totalFemale }}</h3>
          </div>
          <p>Female Students</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">
          <i class="fa fa-book" style="font-size: 19px"></i>
        </div>
        <div class="stat-content">
          <div class="sum-box">
            <i class="fa fa-spinner fa-spin" v-if="loading"></i>
            <h3 v-else>{{ totalAssignedSubjects }}</h3>
          </div>
          <p>Total Class Subjects</p>
        </div>
      </div>
    </div>

    <!-- <pre>{{ assignedSubjects }}</pre> -->

    <!-- Tabs Navigation -->
    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'students' }"
        @click="activeTab = 'students'"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        Students
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'subjects' }"
        @click="activeTab = 'subjects'"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        Subjects
      </button>
    </div>

    <!-- Students Tab Content -->
    <div v-show="activeTab === 'students'">
      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Gender:</label>
          <select
            v-model="filters.gender"
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div class="search-filter-group">
          <label class="filter-label">Search:</label>
          <div class="search-container">
            <input
              type="text"
              v-model="filters.search"
              class="search-box"
              placeholder="Search by name or admission number..."
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <!-- <button
              v-if="filters.search"
              class="btn-clear-filters ms-0"
              @click="clearSearch"
            >
              <svg
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button> -->
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="data-table-container">
        <div class="table-header">
          <h2 class="table-title">Students List</h2>
          <!-- <button class="export-btn" @click="exportToExcel">
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export
          </button> -->
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Admission No.</th>
                <th>Full Name</th>
                <th class="d-none d-md-table-cell">Gender</th>
                <th class="d-none d-lg-table-cell">Date of Birth</th>
                <th class="d-none d-xl-table-cell">Parent/Guardian</th>
                <th class="d-none d-xl-table-cell">Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <no-results-row v-if="loading" :loading="loading" :colspan="9" />
              <no-results-row
                v-else-if="filteredStudents.length === 0"
                :colspan="9"
              />
              <tr
                v-else
                v-for="(student, index) in filteredStudents"
                :key="student.id"
              >
                <td>{{ getSerialNumber(index) }}</td>
                <td>
                  <strong>{{ student.admission_number }}</strong>
                </td>
                <td>
                  <strong>{{ student.full_name }}</strong>
                  <div class="d-md-none">
                    <small class="text-muted">{{ student.gender }}</small>
                  </div>
                </td>
                <td class="d-none d-md-table-cell text-capitalize">
                  <span
                    class="gender-badge"
                    :class="student.gender?.toLowerCase()"
                  >
                    {{ student.gender }}
                  </span>
                </td>
                <td class="d-none d-lg-table-cell">
                  {{ formatDate(student.dob) }}
                </td>
                <td class="d-none d-xl-table-cell">
                  {{ student.Parent?.full_name || "N/A" }}
                </td>
                <td class="d-none d-xl-table-cell">
                  {{ student.Parent?.phone_number || "N/A" }}
                </td>
                <td>
                  <span
                    :class="[
                      'status-badge',
                      `status-${student.student_status}`,
                    ]"
                  >
                    {{ student.student_status }}
                  </span>
                </td>
                <td>
                  <button class="action-btn info" @click="viewStudent(student)">
                    View
                  </button>
                  <button class="action-btn edit" @click="editStudent(student)">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ps-5 pe-5">
          <Pagination
            v-if="pagination.totalPages > 0"
            :currentPage="pagination.currentPage"
            :totalPages="pagination.totalPages"
            :totalCount="pagination.totalCount"
            :limit="pagination.limit"
            :hasNextPage="pagination.hasNextPage"
            :hasPrevPage="pagination.hasPrevPage"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Subjects Tab Content -->
    <div v-show="activeTab === 'subjects'">
      <div class="data-table-container">
        <div class="table-header">
          <h2 class="table-title">Assigned Subjects</h2>
          <button class="add-btn" @click="openAssignSubjectModal">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Assign Subject
          </button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Subject Name</th>
                <th>Teacher</th>
                <th class="d-none d-lg-table-cell">Total Student Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <no-results-row
                v-if="loadingSubjects"
                :loading="loadingSubjects"
                :colspan="6"
              />
              <no-results-row
                v-else-if="assignedSubjects.length === 0"
                :colspan="6"
              />
              <tr
                v-else
                v-for="(subject, index) in assignedSubjects"
                :key="subject.id"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ subject.Subject?.subject_name }}</strong>
                </td>

                <td>{{ subject.Staff?.full_name || "Not Assigned" }}</td>
                <td class="d-none d-lg-table-cell">
                  <div class="assign-list">
                    <span
                      class="status-badge"
                      :class="
                        subject.total_students === 0
                          ? 'status-inactive'
                          : 'status-active'
                      "
                    >
                      {{ subject.total_students }} Student{{
                        subject.total_students > 1 ? "s" : ""
                      }}
                    </span>
                  </div>
                </td>

                <td>
                  <button
                    class="action-btn primary"
                    :disabled="isAssigningSubjects"
                    @click="getSelectedSubject(subject.Subject?.id)"
                    v-html="assignSUbjectBtn"
                  ></button>
                  <button
                    class="action-btn edit"
                    @click="editSubjectAssignment(subject)"
                  >
                    Edit
                  </button>
                  <button
                    class="action-btn delete"
                    @click="removeSubjectConfirmation(subject)"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Assign Subject Modal -->
  <AssignSubjectModal ref="assignSubjectRef" @send-status="getStatus($event)" />
  <UpdateAssignSubjectModal
    ref="updateAssignSubjectRef"
    :subject-info="selectedSubject"
    @send-status="getStatus($event)"
  />

  <!-- Confirm Delete Modal -->
  <ConfirmDeleteModal
    :show="showDeleteSubjectModal"
    @confirm="removeSubject"
    @cancel="showDeleteSubjectModal = false"
  />

  <!-- Student Quick View Modal -->
  <StudentQuickViewModal
    ref="studentQuickViewRef"
    @edit-student="handleEditFromModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";
import NoResultsRow from "../../../components/public/NoResultsRow.vue";
import AssignSubjectModal from "./AssignSubjectModal.vue";
import ConfirmDeleteModal from "../../../components/public/ConfirmDeleteModal.vue";
import StudentQuickViewModal from "./StudentQuickViewModal.vue";
import Pagination from "../../../components/public/Pagination.vue";
import UpdateAssignSubjectModal from "./UpdateAssignSubjectModal.vue";
import { gsap } from "gsap";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const summary = ref({
  totalStudents: 0,
  totalMale: 0,
  totalFemale: 0,
});

const isRemoving = ref(false);

const classInfo = ref({});
const classId = ref(null);
const students = ref([]);
const loading = ref(false);
const activeTab = ref("students");
const singleAssignPayload = ref({});
const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

// Subjects related
const assignedSubjects = ref([]);
const loadingSubjects = ref(false);
const isAssigningSubjects = ref(false);
const assignSubjectRef = ref(null);
const selectedSubject = ref(null);
const showDeleteSubjectModal = ref(false);
const updateAssignSubjectRef = ref(null);

// Student quick view
const studentQuickViewRef = ref(null);

const filters = ref({
  gender: "",
  search: "",
});

// Computed properties for stats

const totalAssignedSubjects = computed(
  () => assignedSubjects.value.length || 0
);

// Filtered students - now done on backend, so just return all students
const filteredStudents = computed(() => {
  return students.value;
});

const applyFilters = () => {
  // Trigger API call with filters
  getClassStudents(classId.value, 1);
};

const handleSearch = () => {
  // Trigger API call with search term
  getClassStudents(classId.value, 1);
};

const clearSearch = () => {
  filters.value.search = "";
  getClassStudents(classId.value, 1);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const goBack = () => {
  router.push({ name: "classes" });
};

const viewStudent = (student) => {
  studentQuickViewRef.value.toggleModal(student);
};

const handleEditFromModal = (student) => {
  editStudent(student);
};

const editStudent = (student) => {
  // Navigate to edit student page
  router.push({
    path: `/students/update/${student.id}`,
    query: {
      from: "class",
      classId: classId.value,
    },
  });
};

const exportToExcel = () => {
  try {
    // Prepare data for export
    const exportData = filteredStudents.value.map((student, index) => ({
      SN: index + 1,
      "Admission Number": student.admission_number,
      "Full Name": student.full_name,
      Gender: student.gender,
      "Date of Birth": formatDate(student.dob),
      "Parent/Guardian": student.Parent?.full_name || "N/A",
      Contact: student.Parent?.phone_number || "N/A",
      Status: student.student_status,
      "Blood Group": student.blood_group || "N/A",
      Religion: student.religion || "N/A",
      Address: student.address || "N/A",
      State: student.state || "N/A",
      "Local Government": student.local_gov || "N/A",
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in values
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${classInfo.value.class_name || "Class"}_Students_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      "Export Successful",
      "Students list has been exported to CSV."
    );
  } catch (error) {
    console.error("Export error:", error);
    toast.error(
      "Export Failed",
      "An error occurred while exporting the students list."
    );
  }
};

const getClassStudents = (id, page = 1) => {
  loading.value = true;

  const params = {
    page,
    limit: pagination.value.limit,
  };

  // Add search parameter if provided
  if (filters.value.search) {
    params.search = filters.value.search.trim();
  }

  // Add gender filter if provided
  if (filters.value.gender) {
    params.gender = filters.value.gender;
  }

  apiServices
    .getStudentsByClassId(id, params)
    .then((response) => {
      // Check 204 first
      if (response.status === 204) {
        students.value = [];
        summary.value = {
          totalStudents: 0,
          totalMale: 0,
          totalFemale: 0,
        };
        classInfo.value = {
          class_name: "",
          class_master: "",
          class_section: "",
          grade_name: "",
        };

        toast.error("No Students", "This class has no students assigned yet.");
        loading.value = false;
        return; // Stop further processing
      }

      // Normal 200 response
      const data = response.data?.data?.students || [];
      const summaryData = response.data?.data?.summary || {
        totalStudents: 0,
        totalMale: 0,
        totalFemale: 0,
      };

      summary.value = summaryData;
      students.value = data;

      classInfo.value = {
        class_name: data[0]?.Class?.class_name || "",
        class_master: data[0]?.Class?.SchoolStaff?.full_name || "",
        class_section: data[0]?.Class?.Section?.section_name || "",
        grade_name: data[0]?.Class?.GradeList?.grade_name || "",
      };

      // Pagination
      const paginate = response.data?.data?.pagination;
      if (paginate) {
        pagination.value = {
          currentPage: paginate.currentPage,
          totalPages: paginate.totalPages,
          totalCount: paginate.totalCount,
          limit: paginate.limit,
          hasNextPage: paginate.hasNextPage,
          hasPrevPage: paginate.hasPrevPage,
        };
      }

      loading.value = false;
    })
    .catch((error) => {
      console.error("Error fetching students:", error);

      toast.error(
        "Failed to Load Students",
        error.response?.data?.message ||
          "An error occurred while fetching students."
      );
      students.value = [];
      loading.value = false;
    });
};

const getClassSubjects = async () => {
  loadingSubjects.value = true;

  apiServices
    .getClassAssignedSubjectByClassId(classId.value)
    .then((response) => {
      if (response.status === 200) {
        assignedSubjects.value = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loadingSubjects.value = false;
    });
};

const getSelectedSubject = async (id) => {
  if (!students.value?.length) {
    toast.error("error", "No students available for assignment");
    return;
  }

  const selectedSubject = assignedSubjects.value.find(
    (item) => item.Subject?.id === id
  );

  if (!selectedSubject) {
    toast.error("error", "No subject found", "Selected subject not found");
    return;
  }

  const studentinfo = students.value[0];

  singleAssignPayload.value = {
    subject_id: selectedSubject.school_subject_id,
    current_class_id: studentinfo.current_class_id,
    current_session_id: studentinfo.current_session_id,
  };

  await assignSubjectToClassStudents(singleAssignPayload.value);
};

const assignSubjectToClassStudents = async (data) => {
  isAssigningSubjects.value = true;

  apiServices
    .assignSubjectToClassStudents(data)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "success",
          response.data.message || "Subject successfully assigned to students"
        );
      } else {
        toast.success("error", "Assignment Failed");
      }
      getClassSubjects();
    })
    .catch((error) => {
      console.error(error);

      toast.error(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    })
    .finally(() => {
      isAssigningSubjects.value = false;
    });
};

const removeSubjectFromClassStudents = async (data) => {
  isRemoving.value = true;

  apiServices
    .removeSubjectFromClassStudents(data)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Subject Removed",
          response.data.message || "Subject has been removed from this class."
        );
      } else {
        toast.error("error", "Assignment Failed");
      }
      getClassSubjects();
    })
    .catch((error) => {
      console.error(error);

      toast.error(
        "error",
        error?.response?.data?.message || "Something went wrong"
      );
    })
    .finally(() => {
      isRemoving.value = false;
    });
};

const assignSUbjectBtn = computed(() => {
  return isAssigningSubjects.value
    ? "<i class='fa fa-spinner fa-spin'></i> Assigning..."
    : "Assign to student";
});

const getStatus = (status) => {
  if (status === "success") {
    getClassSubjects(classId.value);
  }
};

const openAssignSubjectModal = () => {
  assignSubjectRef.value.toggleModal();
};

const editSubjectAssignment = (subject) => {
  selectedSubject.value = subject;
  updateAssignSubjectRef.value.toggleModal();
};

const removeSubjectConfirmation = (subject) => {
  selectedSubject.value = subject;
  showDeleteSubjectModal.value = true;
};

const removeSubject = async (id) => {
  // Simulate API delay

  if (!students.value?.length) {
    toast.error("error", "No students available for assignment");
    return;
  }

  if (!selectedSubject.value) {
    toast.error("error", "No subject found", "Selected subject not found");
    return;
  }

  const studentinfo = students.value[0];

  singleAssignPayload.value = {
    subject_id: selectedSubject.value.school_subject_id,
    current_class_id: studentinfo.current_class_id,
    current_session_id: studentinfo.current_session_id,
    class_subject_assign_id:selectedSubject.value.id,
  };

  console.log(singleAssignPayload.value);

  await removeSubjectFromClassStudents(singleAssignPayload.value);

  showDeleteSubjectModal.value = false;
};

const getSerialNumber = (index) => {
  const currentPage = Number(pagination.value.currentPage) || 1;
  const limit = Number(pagination.value.limit) || 25;
  return (currentPage - 1) * limit + index + 1;
};

const handlePageChange = (page) => {
  getClassStudents(classId.value, page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  classId.value = route.params.id;
  if (classId.value) {
    // Get class info from route params if passed

    getClassStudents(classId.value);
    getClassSubjects(classId.value);
  } else {
    toast.error("Invalid Class", "No class ID provided.");
    router.push({ name: "classes" });
  }

  gsap.from(".sum-box", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2, // each block enters one after another
    ease: "power3.out",
  });
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.stat-icon.success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.stat-icon.warning {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  color: white;
}

.stat-icon.info {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #2d3748;
}

.stat-content p {
  font-size: 0.875rem;
  color: #718096;
  margin: 0.25rem 0 0;
}

.gender-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-btn.primary {
  background: #48bb78;
  color: #fff;
}

.gender-badge.male {
  background: #e6f7ff;
  color: #0066cc;
}

.gender-badge.female {
  background: #fff0f6;
  color: #c41d7f;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.export-btn:hover {
  background: #38a169;
}

.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #718096;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #4a5568;
  background: #f7fafc;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: #f7fafc;
}

.subject-code-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #edf2f7;
  color: #4a5568;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .tab-btn {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}

/* Active - Green */
.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

/* Graduated - Blue */
.status-graduated {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Transferred - Purple */
.status-transferred {
  background-color: #e9d5ff;
  color: #6b21a8;
}

/* Suspended - Orange */
.status-suspended {
  background-color: #fed7aa;
  color: #9a3412;
}

/* Withdrawn - Red */
.status-withdrawn {
  background-color: #fecaca;
  color: #991b1b;
}

/* Leave - Yellow */
.status-leave {
  background-color: #fef3c7;
  color: #92400e;
}

.assign-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>
