<template>
  <div class="page">
    <div class="page-header mt-4">
      <div>
        <h1>Invoice Management</h1>
        <p>Manage school invoices and payments</p>
      </div>
      <!-- <button class="add-btn">
        <i class="fa fa-plus"></i>
        Create New Invoice
      </button> -->
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <h2 class="table-title">All Invoices</h2>
        <div class="filter-section">
          <select v-model="selectedSessionId" @change="handleSessionFilter" class="form-select">
            <option value="">All Sessions</option>
            <option v-for="session in sessions.schoolsessions" :key="session.id" :value="session.id">
              {{ session.session_name }}
            </option>
          </select>
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Term</th>
              <th>Total Students</th>
              <th>Amount to Pay</th>
              <th>Amount Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th v-if="false">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td>{{ invoice.Session?.session_name }}</td>
              <td>{{ invoice.Term?.term_name }}</td>
              <td>{{ invoice.total_students }}</td>
              <td>{{ formatAmount(invoice.amount_to_pay) }}</td>
              <td>{{ formatAmount(invoice.amount_to_paid) }}</td>
              <td>{{ formatAmount(invoice.balance) }}</td>
              <td>
                <span :class="['status-badge', `status-${invoice.status}`]">
                  {{ invoice.status }}
                </span>
              </td>
              <td v-if="false">
                <button
                  class="action-btn edit"
                  @click="editInvoice(invoice)"
                  :disabled="isUpdating"
                >
                  {{
                    isUpdating && selectedInvoice?.id === invoice.id
                      ? "Updating..."
                      : "Recalculate"
                  }}
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteInvoiceConfirmation(invoice)"
                >
                  Delete
                </button>
                <button class="action-btn info" @click="viewInvoice(invoice)">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="pagination-container" v-if="pagination.totalPages > 1">
        <button 
          class="pagination-btn" 
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
        >
          Previous
        </button>
        <span class="pagination-info">
          Page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} total)
        </span>
        <button 
          class="pagination-btn" 
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
        >
          Next
        </button>
      </div>
    </div>

    <ConfirmDeleteModal
      :show="showDeleteModal"
      @confirm="deleteInvoice"
      @cancel="closeDeleteModal"
      :loading="isDeleting"
    />

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Invoice Details</h3>
          <button class="close-btn" @click="closeViewModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">Session:</span>
            <span class="detail-value">{{
              selectedInvoice?.Session?.session_name
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Term:</span>
            <span class="detail-value">{{
              selectedInvoice?.Term?.term_name
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Students:</span>
            <span class="detail-value">{{
              selectedInvoice?.total_students
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Amount to Pay:</span>
            <span class="detail-value">{{
              formatAmount(selectedInvoice?.amount_to_pay)
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Amount Paid:</span>
            <span class="detail-value">{{
              formatAmount(selectedInvoice?.amount_to_paid)
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Balance:</span>
            <span class="detail-value">{{
              formatAmount(selectedInvoice?.balance)
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span
              :class="['status-badge', `status-${selectedInvoice?.status}`]"
            >
              {{ selectedInvoice?.status }}
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeViewModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiServices from "../../services/apiServices";
import ConfirmDeleteModal from "../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../composables/useToast";

const toast = useToast();

const invoices = ref([]);
const sessions = ref([]);
const selectedSessionId = ref("");
const selectedInvoice = ref(null);
const showDeleteModal = ref(false);
const showViewModal = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

const getAllSchoolInvoices = () => {
  const params = {
    page: pagination.value.page,
    limit: pagination.value.limit,
  };

  if (selectedSessionId.value) {
    params.school_session_id = selectedSessionId.value;
  }

  apiServices
    .getAllSchoolInvoices(params)
    .then((response) => {
      console.log(response);
      invoices.value = response.data.data.invoices;
      pagination.value = response.data.data.pagination;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getAllSessions = () => {
  apiServices
    .getAllSessions()
    .then((response) => {
      sessions.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleSessionFilter = () => {
  pagination.value.page = 1;
  getAllSchoolInvoices();
};

const changePage = (page) => {
  pagination.value.page = page;
  getAllSchoolInvoices();
};

const editInvoice = (invoice) => {
  selectedInvoice.value = invoice;

  // Confirm recalculation
  if (
    confirm(
      "This will recalculate the invoice based on current active students. Continue?"
    )
  ) {
    updateInvoice();
  }
};

const updateInvoice = () => {
  if (!selectedInvoice.value) return;

  isUpdating.value = true;
  apiServices
    .updateSchoolInvoice(selectedInvoice.value.id, {})
    .then((response) => {
      toast.success(
        "Invoice Recalculated",
        "Invoice has been recalculated successfully based on current active students."
      );
      getAllSchoolInvoices();
    })
    .catch((error) => {
      console.log("Error updating invoice:", error);
      toast.error(
        "Update Failed",
        error.response?.data?.message || "Failed to recalculate invoice"
      );
    })
    .finally(() => {
      isUpdating.value = false;
    });
};

const viewInvoice = (invoice) => {
  selectedInvoice.value = invoice;
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedInvoice.value = null;
};

const deleteInvoiceConfirmation = (invoice) => {
  selectedInvoice.value = invoice;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deleteInvoice = () => {
  if (!selectedInvoice.value) return;

  isDeleting.value = true;
  apiServices
    .deleteSchoolInvoice(selectedInvoice.value.id)
    .then((response) => {
      console.log("Invoice deleted:", response);
      toast.success(
        "Invoice Deleted",
        "Invoice has been deleted successfully."
      );
      getAllSchoolInvoices();
      closeDeleteModal();
    })
    .catch((error) => {
      console.log("Error deleting invoice:", error);
      toast.error(
        "Delete Failed",
        error.response?.data?.message || "Failed to delete invoice"
      );
    })
    .finally(() => {
      isDeleting.value = false;
    });
};

onMounted(() => {
  getAllSessions();
  getAllSchoolInvoices();
});
</script>

<style scoped>
.status-badge {
  text-transform: capitalize;
}

.status-unpaid {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-paid {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-overdue {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-free {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  color: #111827;
}

.filter-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}
</style>