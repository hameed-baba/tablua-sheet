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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        All Terms
      </h2>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Secton Name</th>
            <th class="d-none d-lg-table-cell">Status</th>
            <th class="d-none d-lg-table-cell">Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(term, index) in allTerms" :key="index">
            <td>
              {{ term.term_name }}
              <div class="d-lg-none">
                <!-- <small class="text-muted">{{ term.status }}</small> -->
                <small
                  :class="[
                    'status-badge',
                    term.status == 'active'
                      ? 'status-active'
                      : 'status-inactive',
                  ]"
                >
                  {{ term.status == "active" ? "Active" : "Inactive" }}
                </small>
              </div>
              <div class="d-lg-none">
                <!-- <small class="text-muted">{{ term.status }}</small> -->
                <small
                  :class="[
                    'status-badge',
                    term.was_paid == true ? 'status-active' : 'status-pending',
                  ]"
                >
                  {{ term.was_paid == true ? "Paid" : "Pending" }}
                </small>
              </div>
              <div class="d-xl-none">
                <small class="text-muted d-block">{{
                  term.start_date ? term.start_date.substring(0, 10) : ""
                }}</small>
              </div>
              <div class="d-xl-none">
                <small class="text-muted d-block">{{
                  term.end_date ? term.end_date.substring(0, 10) : ""
                }}</small>
              </div>
            </td>
            <td class="d-none d-lg-table-cell">
              <span
                :class="[
                  'status-badge',
                  term.status == 'active' ? 'status-active' : 'status-inactive',
                ]"
              >
                {{ term.status == "active" ? "Active" : "Inactive" }}
              </span>
            </td>

            <td class="d-none d-lg-table-cell">
              <span
                :class="[
                  'status-badge',
                  term.was_paid == true ? 'status-active' : 'status-pending',
                ]"
              >
                {{ term.was_paid == true ? "Paid" : "Pending" }}
              </span>
            </td>

            <td>
              <button
                v-if="term.status !== 'active'"
                class="action-btn"
                :class="term.buttonState === 'activate' ? 'present' : 'warning'"
                @click="handleButtonClick(term)"
              >
                {{ term.buttonState === "activate" ? "Activate" : "Confirm" }}
              </button>
              <button v-else class="action-btn" disabled>Active</button>
              <!-- <button class="action-btn" @click="generateInvoice(term)">
                Generate Invoice
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import apiServices from "../../../../services/apiServices";
import { useToast } from "../../../../composables/useToast";

const toast = useToast();
const loading = ref(false);
const allTerms = ref([]);
const selectedTerm = ref({});
const sessionId = ref("");

const getAllTerm = () => {
  loading.value = true;
  apiServices
    .getAllTerm()
    .then((response) => {
      const data = response.data.data;
      sessionId.value = data.session_id;
      allTerms.value = data.terms.map((term) => ({
        ...term,
        buttonState: "activate", // add button state per term
      }));
    })
    .catch((error) => {
      console.error("Error fetching terms:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleButtonClick = (term) => {
  if (term.buttonState === "activate") {
    selectedTerm.value = term;
    term.buttonState = "confirming";

    // Auto-revert if not confirmed in 5 seconds
    setTimeout(() => {
      if (term.buttonState === "confirming") {
        term.buttonState = "activate";
      }
    }, 5000);
  } else {
    activateSelectedTerm(term);
  }
};

const activateSelectedTerm = (term) => {
  if (!term) return;

  loading.value = true;

  apiServices
    .activateTerm(term.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Success",
          `Term "${term.term_name}" activated successfully.`
        );

        // Update the term locally
        term.status = "active";
        term.buttonState = "activate";

        selectedTerm.value = null; // reset selection

        // Automatically generate invoice after successful activation
        generateInvoice(term);
      }
      getAllTerm();
    })
    .catch((error) => {
      console.error("Error activating term:", error);
      toast.error(
        "Failed to Activate Term",
        error.response?.data?.message ||
          "An error occurred while activating the term. Please try again."
      );

      // Revert button state if activation fails
      term.buttonState = "activate";
    })
    .finally(() => {
      loading.value = false;
    });
};

const generateInvoice = (term) => {
  const payload = {
    school_session_id: sessionId.value,
    school_term_id: term.id,
  };

  console.log(payload);

  // call API
  apiServices
    .createSchoolInvoice(payload)
    .then((response) => {
      toast.success("Success", "Invoice generated successfully");
    })
    .catch((error) => {
      toast.error("Error", error.response?.data?.message);
    });
};

onMounted(() => {
  getAllTerm();
});
</script>

<style lang="scss" scoped>
.disabled-btn {
  background-color: #9e9e9e !important;
  color: #ffffff !important;
  cursor: not-allowed !important;
  opacity: 1;
}
</style>