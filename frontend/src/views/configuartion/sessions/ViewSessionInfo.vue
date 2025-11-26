<template>
  <BaseModal :show="showModal" title="Session Information" @close="toggleModal">
    <div class="session-info-container">
      <!-- Session Header -->
      <div class="session-header">
        <div class="session-name-section">
          <h3 class="session-name">{{ sessionToView?.session_name }}</h3>
          <div class="badges-group">
            <span
              :class="[
                'status-badge',
                sessionToView?.status === 'active'
                  ? 'badge-active'
                  : 'badge-inactive',
              ]"
            >
              {{ sessionToView?.status === "active" ? "Active" : "Inactive" }}
            </span>
            <span
              :class="[
                'status-badge',
                getPaymentStatusClass(sessionToView?.payment_status),
              ]"
            >
              {{ formatPaymentStatus(sessionToView?.payment_status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Session Details -->
      <div class="session-details">
        <div class="detail-row">
          <span class="detail-label">Created Date:</span>
          <span class="detail-value">{{
            formatDate(sessionToView?.createdAt)
          }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Last Updated:</span>
          <span class="detail-value">{{
            formatDate(sessionToView?.updatedAt)
          }}</span>
        </div>
      </div>

      <!-- Terms Section -->
      <div class="terms-section">
        <h4 class="section-title">Academic Terms</h4>

        <!-- First Term -->
        <div class="term-card">
          <div class="term-header">
            <span class="term-title">First Term</span>
            <span class="term-duration">{{
              getTermDuration(
                sessionToView?.first_term_start,
                sessionToView?.first_term_end
              )
            }}</span>
          </div>
          <div class="term-dates">
            <div class="date-item">
              <span class="date-label">Start:</span>
              <span class="date-value">{{
                formatDate(sessionToView?.first_term_start)
              }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">End:</span>
              <span class="date-value">{{
                formatDate(sessionToView?.first_term_end)
              }}</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    getTermProgress(
                      sessionToView?.first_term_start,
                      sessionToView?.first_term_end
                    ) + '%',
                }"
              ></div>
            </div>
            <span class="progress-text"
              >{{
                getTermProgress(
                  sessionToView?.first_term_start,
                  sessionToView?.first_term_end
                )
              }}% Complete</span
            >
          </div>
        </div>

        <!-- Second Term -->
        <div class="term-card">
          <div class="term-header">
            <span class="term-title">Second Term</span>
            <span class="term-duration">{{
              getTermDuration(
                sessionToView?.second_term_start,
                sessionToView?.second_term_end
              )
            }}</span>
          </div>
          <div class="term-dates">
            <div class="date-item">
              <span class="date-label">Start:</span>
              <span class="date-value">{{
                formatDate(sessionToView?.second_term_start)
              }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">End:</span>
              <span class="date-value">{{
                formatDate(sessionToView?.second_term_end)
              }}</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    getTermProgress(
                      sessionToView?.second_term_start,
                      sessionToView?.second_term_end
                    ) + '%',
                }"
              ></div>
            </div>
            <span class="progress-text"
              >{{
                getTermProgress(
                  sessionToView?.second_term_start,
                  sessionToView?.second_term_end
                )
              }}% Complete</span
            >
          </div>
        </div>

        <!-- Third Term -->
        <div class="term-card">
          <div class="term-header">
            <span class="term-title">Third Term</span>
            <span class="term-duration">{{
              getTermDuration(
                sessionToView?.third_term_start,
                sessionToView?.third_term_end
              )
            }}</span>
          </div>
          <div class="term-dates">
            <div class="date-item">
              <span class="date-label">Start:</span>
              <span class="date-value">{{
                formatDate(sessionToView?.third_term_start)
              }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">End:</span>
              <span class="date-value">{{
                formatDate(sessionToView?.third_term_end)
              }}</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    getTermProgress(
                      sessionToView?.third_term_start,
                      sessionToView?.third_term_end
                    ) + '%',
                }"
              ></div>
            </div>
            <span class="progress-text"
              >{{
                getTermProgress(
                  sessionToView?.third_term_start,
                  sessionToView?.third_term_end
                )
              }}% Complete</span
            >
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/public/BaseModal.vue";
import { ref } from "vue";

const props = defineProps({
  sessionToView: Object,
});

const showModal = ref(false);

const toggleModal = () => {
  showModal.value = !showModal.value;
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

const formatPaymentStatus = (status) => {
  if (!status) return "N/A";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getPaymentStatusClass = (status) => {
  const statusMap = {
    paid: "badge-paid",
    unpaid: "badge-unpaid",
    overdue: "badge-overdue",
    free: "badge-free",
  };
  return statusMap[status] || "badge-unpaid";
};

const getTermDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days`;
};

const getTermProgress = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (now < start) return 0;
  if (now > end) return 100;

  const totalDuration = end - start;
  const elapsed = now - start;
  const progress = (elapsed / totalDuration) * 100;

  return Math.min(Math.max(Math.round(progress), 0), 100);
};

defineExpose({
  toggleModal,
});
</script>

<style lang="scss" scoped>
.session-info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.session-header {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.session-name-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.session-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.badges-group {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge-active {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-paid {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-unpaid {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-overdue {
  background-color: #fecaca;
  color: #991b1b;
}

.badge-free {
  background-color: #e0e7ff;
  color: #3730a3;
}

.session-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.813rem;
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  font-size: 0.813rem;
  font-weight: 600;
  color: #111827;
}

.terms-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 0.938rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.term-card {
  padding: 0.875rem;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-color: #d1d5db;
  }
}

.term-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.term-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.term-duration {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.188rem 0.5rem;
  border-radius: 4px;
}

.term-dates {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.date-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.date-label {
  font-size: 0.688rem;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.date-value {
  font-size: 0.813rem;
  font-weight: 600;
  color: #374151;
}

.progress-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 9999px;
  transition: width 0.6s ease;
}

.progress-text {
  font-size: 0.688rem;
  font-weight: 600;
  color: #6b7280;
  text-align: right;
}

@media (max-width: 640px) {
  .session-name {
    font-size: 1rem;
  }

  .term-card {
    padding: 0.75rem;
  }

  .term-dates {
    gap: 0.75rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.125rem;
  }
}
</style>
