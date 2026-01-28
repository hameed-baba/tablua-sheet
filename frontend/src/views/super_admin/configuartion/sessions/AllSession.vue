<template>
  <div class="data-table-container">
    <div class="table-header">
      <h2 class="table-title">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style="
            display: inline-block;
            vertical-align: middle;
            margin-right: 0.5rem;
          "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        All Session
      </h2>

      <div class="header-actions">
        <button class="add-btn" @click="sessionRef.toggleModal()">
          <i class="fa fa-plus"></i>
          <span class="btn-text">Add New Session</span>
        </button>
        <button
          @click="activateRef.toggleActivateModal()"
          class="btn btn-success"
        >
          <span class="btn-text">Activate Session</span>
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Session Name</th>
            <th class="d-none d-lg-table-cell">Status</th>
            <th class="d-none d-lg-table-cell">Payment Status</th>
            <th class="d-none d-lg-table-cell">Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td class="text-center" colspan="5">
              <i class="fa fa-spinner fa-spin"></i>
            </td>
          </tr>
          <tr v-if="!loading && allSessions.length === 0">
            <td class="text-center" colspan="5">No data</td>
          </tr>
          <tr v-for="(session, index) in allSessions" :key="index">
            <td>
              <div class="session-name">{{ session.session_name }}</div>
              <div class="d-lg-none mobile-details">
                <div class="mobile-detail-item">
                  <span
                    :class="[
                      'status-badge',
                      session.status == 'active'
                        ? 'status-active'
                        : 'status-inactive',
                    ]"
                  >
                    {{ session.status == "active" ? "Active" : "Inactive" }}
                  </span>
                </div>
                <div class="mobile-detail-item">
                  <span
                    class="status-badge"
                    :class="getStatusClass(session.payment_status)"
                  >
                    {{ session.payment_status }}
                  </span>
                </div>
                <div class="mobile-detail-item">
                  <small class="text-muted">
                    {{
                      session.createdAt
                        ? session.createdAt.substring(0, 10)
                        : ""
                    }}
                  </small>
                </div>
              </div>
            </td>
            <td class="d-none d-lg-table-cell">
              <span
                :class="[
                  'status-badge',
                  session.status == 'active'
                    ? 'status-active'
                    : 'status-inactive',
                ]"
              >
                {{ session.status == "active" ? "Active" : "Inactive" }}
              </span>
            </td>
            <td class="d-none d-lg-table-cell">
              <span
                class="status-badge"
                :class="getStatusClass(session.payment_status)"
                >{{ session.payment_status }}</span
              >
            </td>
            <td class="d-none d-lg-table-cell">
              {{ session.createdAt ? session.createdAt.substring(0, 10) : "" }}
            </td>
            <td>
              <button
                class="action-btn edit"
                @click="getSelectedSession(session.id)"
              >
                Edit
              </button>
              <button
                class="action-btn delete"
                @click="deleteSessionConfirmation(session)"
              >
                Delete
              </button>
              <button class="action-btn info" @click="viewSession(session)">
                View
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
  <RegisterSession ref="sessionRef" @send-status="getStatus" />
  <UpdateSession
    ref="sessionUpdRef"
    @send-status="getStatus"
    :sessionToUpdate="selectedSession"
  />
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteSession"
    @cancel="showDeleteModal = false"
  />
  <ViewSessionInfo ref="viewSessionRef" :session-to-view="selectedSession" />
  <ActivateSession ref="activateRef" @send-status="getStatus" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import apiServices from "../../../../services/apiServices";
import RegisterSession from "./RegisterSession.vue";
import UpdateSession from "./UpdateSession.vue";
import ConfirmDeleteModal from "../../../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../../../composables/useToast";
import ActivateSession from "./ActivateSession.vue";
import Pagination from "../../../../components/public/Pagination.vue";
import ViewSessionInfo from "./ViewSessionInfo.vue";

const toast = useToast();
const loading = ref(false);
const allSessions = ref([]);
const sessionRef = ref(null);
const sessionUpdRef = ref(null);
const activateRef = ref(null);
const viewSessionRef = ref(null);
const selectedSession = ref({});
const showDeleteModal = ref(false);

const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  limit: 25,
  hasNextPage: false,
  hasPrevPage: false,
});

const getAllSessions = (page = 1) => {
  loading.value = true;
  apiServices
    .getAllSessions(page)
    .then((response) => {
      // The array of roles is inside response.data.data
      allSessions.value = response.data.data?.schoolsessions || [];

      let paginate = response.data.data.pagination;

      // Update pagination data
      if (response.data.data.pagination) {
        pagination.value = {
          currentPage: paginate.currentPage || 1,
          totalPages: paginate.totalPages || 1,
          totalCount: paginate.totalCount || 0,
          limit: paginate.limit || 25,
          hasNextPage: paginate.hasNextPage || false,
          hasPrevPage: paginate.hasPrevPage || false,
        };
      }
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePageChange = (page) => {
  getAllSessions(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getStatus = (status) => {
  if (status === "success") {
    getAllSessions();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0]; // only keep YYYY-MM-DD
};

const getSelectedSession = (id) => {
  const found = allSessions.value.find((s) => s.id === id);

  if (found) {
    // clone to avoid directly mutating allSessions
    selectedSession.value = {
      ...found,
      first_term_start: formatDate(found.first_term_start),
      first_term_end: formatDate(found.first_term_end),
      second_term_start: formatDate(found.second_term_start),
      second_term_end: formatDate(found.second_term_end),
      third_term_start: formatDate(found.third_term_start),
      third_term_end: formatDate(found.third_term_end),
    };

    sessionUpdRef.value.toggleUpdateModal();
  }
};

const deleteSessionConfirmation = (staff) => {
  selectedSession.value = staff;
  showDeleteModal.value = true;
};

const viewSession = (staff) => {
  selectedSession.value = staff;
  viewSessionRef.value.toggleModal();
};

const deleteSession = () => {
  apiServices
    .deleteSession(selectedSession.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Session Deleted Successfully",
          `The session ${selectedSession.value.session_name} has been deleted successfully.`
        );
        getAllSessions();
      }
      // remove role from list or reload data
    })
    .catch((error) => {
      toast.error(
        "Failed Deleted Session",
        error.response?.data?.message ||
          `An error occurred while deleting the session `
      );
    })
    .finally(() => {
      showDeleteModal.value = false;
    });
};

const getStatusClass = (status) => {
  const statusMap = {
    paid: "status-active",
    unpaid: "status-inactive",
    overdue: "status-pending",
    free: "status-progress",
  };
  return statusMap[status] || "status-inactive";
};

// "uppaid", "paid", "overdue", "free"

onMounted(() => {
  getAllSessions();
});
</script>

<style lang="scss" scoped>
.text-muted {
  color: #6b7280;
}

.d-lg-none {
  @media (min-width: 1024px) {
    display: none;
  }
}

.d-none {
  display: none;
}

.d-lg-table-cell {
  @media (min-width: 1024px) {
    display: table-cell;
  }
}

// Responsive header styles
.table-header {
  @media (max-width: 1023px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start !important;
  }

  @media (max-width: 767px) {
    gap: 0.75rem;
  }
}

.table-title {
  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 1023px) {
    width: 100%;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.5rem;
  }

  button {
    @media (max-width: 1023px) {
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 767px) {
      width: 100%;
      justify-content: center;
    }
  }

  .btn-text {
    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }
}

// Mobile table details
.session-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.mobile-details {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.mobile-detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  small {
    font-size: 0.813rem;
  }
}

// Action buttons responsive
td {
  .action-btn {
    @media (max-width: 767px) {
      padding: 0.375rem 0.75rem;
      font-size: 0.813rem;
    }
  }
}
</style>