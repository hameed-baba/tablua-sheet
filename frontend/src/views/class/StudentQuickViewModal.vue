<template>
  <BaseModal 
    :show="showModal" 
    @close="toggleModal" 
    title="Student Details"
    :modal-style="{ background: 'white', maxWidth: '900px', width: '90%' }"
  >
    <div v-if="student" class="student-details">
      <!-- Header Section -->
      <div class="student-header">
        <div class="student-avatar">
          <div class="avatar-placeholder">
            {{ getInitials(student.full_name) }}
          </div>
        </div>
        <div class="student-basic-info">
          <h2>{{ student.full_name }}</h2>
          <div class="info-badges">
            <span class="badge badge-primary">{{ student.admission_number }}</span>
            <span class="badge" :class="student.status === 'Active' ? 'badge-success' : 'badge-danger'">
              {{ student.status }}
            </span>
            <span class="badge badge-info">{{ student.gender }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Age</span>
            <span class="stat-value">{{ calculateAge(student.date_of_birth) }} years</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Subjects</span>
            <span class="stat-value">{{ student.enrolled_subjects || 12 }}</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Attendance</span>
            <span class="stat-value">{{ student.attendance_rate || '95%' }}</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Average</span>
            <span class="stat-value">{{ student.average_grade || '85%' }}</span>
          </div>
        </div>
      </div>

      <!-- Information Sections -->
      <div class="info-sections">
        <!-- Personal Information -->
        <div class="info-section">
          <h3 class="section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Date of Birth</span>
              <span class="info-value">{{ formatDate(student.date_of_birth) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender</span>
              <span class="info-value">{{ student.gender }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Blood Group</span>
              <span class="info-value">{{ student.blood_group || 'O+' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Religion</span>
              <span class="info-value">{{ student.religion || 'Christianity' }}</span>
            </div>
          </div>
        </div>

        <!-- Parent/Guardian Information -->
        <div class="info-section">
          <h3 class="section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Parent/Guardian Information
          </h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Parent Name</span>
              <span class="info-value">{{ student.parent_name || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number</span>
              <span class="info-value">{{ student.parent_phone || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ student.parent_email || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Relationship</span>
              <span class="info-value">{{ student.parent_relationship || 'Father' }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="info-section">
          <h3 class="section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Contact & Address
          </h3>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="info-label">Home Address</span>
              <span class="info-value">{{ student.address || '123 Main Street, Lagos, Nigeria' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">City</span>
              <span class="info-value">{{ student.city || 'Lagos' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">State</span>
              <span class="info-value">{{ student.state || 'Lagos State' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" @click="toggleModal">
          Close
        </button>
        <button type="button" class="btn btn-primary" @click="editStudent">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Student
        </button>
        <button type="button" class="btn btn-success" @click="manageSubjects">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Manage Subjects
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../../components/public/BaseModal.vue';

const emit = defineEmits(['edit-student', 'manage-subjects']);

const showModal = ref(false);
const student = ref(null);

const toggleModal = (studentData = null) => {
  showModal.value = !showModal.value;
  if (showModal.value && studentData) {
    student.value = studentData;
  }
};

const getInitials = (name) => {
  if (!name) return 'NA';
  const names = name.split(' ');
  return names.length >= 2 
    ? `${names[0][0]}${names[1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const editStudent = () => {
  emit('edit-student', student.value);
  toggleModal();
};

const manageSubjects = () => {
  emit('manage-subjects', student.value);
  toggleModal();
};

defineExpose({
  toggleModal
});
</script>

<style scoped>
.student-details {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
}

.student-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.student-basic-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: #2d3748;
}

.info-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-primary {
  background: #e6f2ff;
  color: #0066cc;
}

.badge-success {
  background: #c6f6d5;
  color: #22543d;
}

.badge-danger {
  background: #fed7d7;
  color: #742a2a;
}

.badge-info {
  background: #e6f7ff;
  color: #0066cc;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 16px;
  height: 16px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.stat-label {
  font-size: 0.6875rem;
  color: #718096;
  font-weight: 500;
}

.stat-value {
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.info-section {
  background: #f7fafc;
  border-radius: 8px;
  padding: 0.875rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 0 0.75rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #2d3748;
}

.section-title svg {
  color: #667eea;
  width: 16px;
  height: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 600;
  word-break: break-word;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
  margin-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .student-header {
    flex-direction: column;
    text-align: center;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item {
    flex-direction: column;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
