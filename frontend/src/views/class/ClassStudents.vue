<template>
  <div class="page">
    <div class="page-header mt-4">
      <div>
        <h1>{{ classInfo.class_name || "Class" }} Students</h1>
        <p v-if="classInfo.SchoolStaff">
          Teacher: {{ classInfo.SchoolStaff.full_name }} | Section:
          {{ classInfo.Section?.section_name }} | Grading:
          {{ classInfo.GradeList?.grade_name }}
        </p>
      </div>
      <button class="add-btn" @click="goBack">
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
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
          <h3>{{ students.length }}</h3>
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
          <h3>{{ maleCount }}</h3>
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
          <h3>{{ femaleCount }}</h3>
          <p>Female Students</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ activeCount }}</h3>
          <p>Active Students</p>
        </div>
      </div>
    </div>

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
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Status:</label>
          <select
            v-model="filters.status"
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="data-table-container">
        <div class="table-header">
          <h2 class="table-title">Students List</h2>
          <button class="export-btn" @click="exportToExcel">
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
          </button>
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
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ student.admission_number }}</strong>
                </td>
                <td>
                  <strong>{{ student.full_name }}</strong>
                  <div class="d-md-none">
                    <small class="text-muted">{{ student.gender }}</small>
                  </div>
                </td>
                <td class="d-none d-md-table-cell">
                  <span
                    class="gender-badge"
                    :class="student.gender?.toLowerCase()"
                  >
                    {{ student.gender }}
                  </span>
                </td>
                <td class="d-none d-lg-table-cell">
                  {{ formatDate(student.date_of_birth) }}
                </td>
                <td class="d-none d-xl-table-cell">
                  {{ student.parent_name || "N/A" }}
                </td>
                <td class="d-none d-xl-table-cell">
                  {{ student.parent_phone || "N/A" }}
                </td>
                <td>
                  <span
                    class="status-badge"
                    :class="student.status?.toLowerCase()"
                  >
                    {{ student.status }}
                  </span>
                </td>
                <td>
                  <button class="action-btn info" @click="viewStudent(student)">
                    View
                  </button>
                  <button
                    class="action-btn success"
                    @click="manageStudentSubjects(student)"
                  >
                    Subjects
                  </button>
                  <button class="action-btn edit" @click="editStudent(student)">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
                <th class="d-none d-md-table-cell">Subject Code</th>
                <th>Teacher</th>
                <th class="d-none d-lg-table-cell">Assigned Date</th>
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
                  <strong>{{ subject.subject_name }}</strong>
                  <div class="d-md-none">
                    <small class="text-muted">{{ subject.subject_code }}</small>
                  </div>
                </td>
                <td class="d-none d-md-table-cell">
                  <span class="subject-code-badge">{{
                    subject.subject_code
                  }}</span>
                </td>
                <td>{{ subject.teacher_name || "Not Assigned" }}</td>
                <td class="d-none d-lg-table-cell">
                  {{ formatDate(subject.assigned_date) }}
                </td>
                <td>
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
  <AssignSubjectModal
    ref="assignSubjectRef"
    :class-id="classId"
    :class-info="classInfo"
    @subject-assigned="handleSubjectAssigned"
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
    @manage-subjects="handleManageSubjectsFromModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "../../composables/useToast";
import apiServices from "../../services/apiServices";
import NoResultsRow from "../../components/public/NoResultsRow.vue";
import AssignSubjectModal from "./AssignSubjectModal.vue";
import ConfirmDeleteModal from "../../components/public/ConfirmDeleteModal.vue";
import StudentQuickViewModal from "./StudentQuickViewModal.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const classInfo = ref({});
const classId = ref(null);
const students = ref([]);
const loading = ref(false);
const activeTab = ref("students");

// Subjects related
const assignedSubjects = ref([]);
const loadingSubjects = ref(false);
const assignSubjectRef = ref(null);
const selectedSubject = ref(null);
const showDeleteSubjectModal = ref(false);

// Student quick view
const studentQuickViewRef = ref(null);

const filters = ref({
  gender: "",
  status: "",
  search: "",
});

// Computed properties for stats
const maleCount = computed(
  () => students.value.filter((s) => s.gender === "Male").length
);

const femaleCount = computed(
  () => students.value.filter((s) => s.gender === "Female").length
);

const activeCount = computed(
  () => students.value.filter((s) => s.status === "Active").length
);

// Filtered students based on search and filters
const filteredStudents = computed(() => {
  let result = students.value;

  if (filters.value.gender) {
    result = result.filter((s) => s.gender === filters.value.gender);
  }

  if (filters.value.status) {
    result = result.filter((s) => s.status === filters.value.status);
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(searchLower) ||
        s.admission_number?.toLowerCase().includes(searchLower)
    );
  }

  return result;
});

const applyFilters = () => {
  // Filters are reactive
};

const handleSearch = () => {
  // Search is reactive
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

const handleManageSubjectsFromModal = (student) => {
  manageStudentSubjects(student);
};

const editStudent = (student) => {
  // Navigate to edit student page
  router.push({ path: `/students/update/${student.id}` });
};

const manageStudentSubjects = (student) => {
  router.push({
    name: "student-subjects",
    params: {
      studentId: student.id,
    },
    query: {
      studentName: student.full_name,
      className: classInfo.value.class_name,
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
      "Date of Birth": formatDate(student.date_of_birth),
      "Parent/Guardian": student.parent_name || "N/A",
      Contact: student.parent_phone || "N/A",
      Status: student.status,
      "Blood Group": student.blood_group || "N/A",
      Religion: student.religion || "N/A",
      Address: student.address || "N/A",
      City: student.city || "N/A",
      State: student.state || "N/A",
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

const getClassStudents = async (id) => {
  loading.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Hardcoded students data
  students.value = [
    {
      id: 1,
      admission_number: "STD001",
      full_name: "John Doe",
      gender: "Male",
      date_of_birth: "2010-05-15",
      parent_name: "Mr. James Doe",
      parent_phone: "+234 801 234 5678",
      parent_email: "james.doe@email.com",
      parent_relationship: "Father",
      status: "Active",
      blood_group: "O+",
      religion: "Christianity",
      address: "15 Victoria Island Road, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 12,
      attendance_rate: "95%",
      average_grade: "85%",
    },
    {
      id: 2,
      admission_number: "STD002",
      full_name: "Jane Smith",
      gender: "Female",
      date_of_birth: "2010-08-22",
      parent_name: "Mrs. Mary Smith",
      parent_phone: "+234 802 345 6789",
      parent_email: "mary.smith@email.com",
      parent_relationship: "Mother",
      status: "Active",
      blood_group: "A+",
      religion: "Christianity",
      address: "28 Lekki Phase 1, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 13,
      attendance_rate: "92%",
      average_grade: "88%",
    },
    {
      id: 3,
      admission_number: "STD003",
      full_name: "Michael Johnson",
      gender: "Male",
      date_of_birth: "2010-03-10",
      parent_name: "Mr. Robert Johnson",
      parent_phone: "+234 803 456 7890",
      parent_email: "robert.johnson@email.com",
      parent_relationship: "Father",
      status: "Active",
      blood_group: "B+",
      religion: "Christianity",
      address: "42 Ikoyi Crescent, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 14,
      attendance_rate: "98%",
      average_grade: "92%",
    },
    {
      id: 4,
      admission_number: "STD004",
      full_name: "Sarah Williams",
      gender: "Female",
      date_of_birth: "2010-11-05",
      parent_name: "Mrs. Linda Williams",
      parent_phone: "+234 804 567 8901",
      parent_email: "linda.williams@email.com",
      parent_relationship: "Mother",
      status: "Active",
      blood_group: "AB+",
      religion: "Christianity",
      address: "7 Surulere Street, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 11,
      attendance_rate: "90%",
      average_grade: "78%",
    },
    {
      id: 5,
      admission_number: "STD005",
      full_name: "David Brown",
      gender: "Male",
      date_of_birth: "2010-07-18",
      parent_name: "Mr. Thomas Brown",
      parent_phone: "+234 805 678 9012",
      parent_email: "thomas.brown@email.com",
      parent_relationship: "Father",
      status: "Inactive",
      blood_group: "O-",
      religion: "Islam",
      address: "33 Yaba Road, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 10,
      attendance_rate: "65%",
      average_grade: "70%",
    },
    {
      id: 6,
      admission_number: "STD006",
      full_name: "Emily Davis",
      gender: "Female",
      date_of_birth: "2010-09-30",
      parent_name: "Mrs. Patricia Davis",
      parent_phone: "+234 806 789 0123",
      parent_email: "patricia.davis@email.com",
      parent_relationship: "Mother",
      status: "Active",
      blood_group: "A-",
      religion: "Christianity",
      address: "19 Ikeja GRA, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 13,
      attendance_rate: "96%",
      average_grade: "89%",
    },
    {
      id: 7,
      admission_number: "STD007",
      full_name: "James Wilson",
      gender: "Male",
      date_of_birth: "2010-04-25",
      parent_name: "Mr. Charles Wilson",
      parent_phone: "+234 807 890 1234",
      parent_email: "charles.wilson@email.com",
      parent_relationship: "Father",
      status: "Active",
      blood_group: "B-",
      religion: "Christianity",
      address: "51 Ajah Estate, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 12,
      attendance_rate: "93%",
      average_grade: "82%",
    },
    {
      id: 8,
      admission_number: "STD008",
      full_name: "Olivia Martinez",
      gender: "Female",
      date_of_birth: "2010-12-12",
      parent_name: "Mrs. Maria Martinez",
      parent_phone: "+234 808 901 2345",
      parent_email: "maria.martinez@email.com",
      parent_relationship: "Mother",
      status: "Active",
      blood_group: "O+",
      religion: "Christianity",
      address: "8 Maryland Avenue, Lagos",
      city: "Lagos",
      state: "Lagos State",
      enrolled_subjects: 14,
      attendance_rate: "97%",
      average_grade: "91%",
    },
  ];

  loading.value = false;
};

const getClassSubjects = async (id) => {
  loadingSubjects.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Hardcoded subjects data
  assignedSubjects.value = [
    {
      id: 1,
      subject_id: 1,
      subject_name: "Mathematics",
      subject_code: "MATH101",
      teacher_id: 1,
      teacher_name: "Mrs. Emily Davis",
      assigned_date: "2024-09-01",
    },
    {
      id: 2,
      subject_id: 2,
      subject_name: "English Language",
      subject_code: "ENG101",
      teacher_id: 2,
      teacher_name: "Mr. Michael Chen",
      assigned_date: "2024-09-01",
    },
    {
      id: 3,
      subject_id: 3,
      subject_name: "Physics",
      subject_code: "PHY101",
      teacher_id: 3,
      teacher_name: "Mrs. Sarah Johnson",
      assigned_date: "2024-09-01",
    },
    {
      id: 4,
      subject_id: 4,
      subject_name: "Chemistry",
      subject_code: "CHEM101",
      teacher_id: 4,
      teacher_name: "Mr. Ahmed Suleiman",
      assigned_date: "2024-09-01",
    },
    {
      id: 5,
      subject_id: 5,
      subject_name: "Biology",
      subject_code: "BIO101",
      teacher_id: 5,
      teacher_name: "Mrs. Grace Okafor",
      assigned_date: "2024-09-02",
    },
    {
      id: 6,
      subject_id: 6,
      subject_name: "Computer Science",
      subject_code: "CS101",
      teacher_id: 6,
      teacher_name: "Mr. David Thompson",
      assigned_date: "2024-09-02",
    },
  ];

  loadingSubjects.value = false;
};

const openAssignSubjectModal = () => {
  assignSubjectRef.value.toggleModal();
};

const handleSubjectAssigned = () => {
  getClassSubjects(classId.value);
};

const editSubjectAssignment = (subject) => {
  selectedSubject.value = subject;
  assignSubjectRef.value.toggleModal(subject);
};

const removeSubjectConfirmation = (subject) => {
  selectedSubject.value = subject;
  showDeleteSubjectModal.value = true;
};

const removeSubject = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Remove from local array
  assignedSubjects.value = assignedSubjects.value.filter(
    (s) => s.id !== selectedSubject.value.id
  );

  toast.success(
    "Subject Removed",
    `${selectedSubject.value.subject_name} has been removed from this class.`
  );

  showDeleteSubjectModal.value = false;
};

onMounted(() => {
  classId.value = route.params.id;
  if (classId.value) {
    // Get class info from route params if passed
    if (route.params.classData) {
      classInfo.value = route.params.classData;
    }
    getClassStudents(classId.value);
    getClassSubjects(classId.value);
  } else {
    toast.error("Invalid Class", "No class ID provided.");
    router.push({ name: "classes" });
  }
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
</style>
