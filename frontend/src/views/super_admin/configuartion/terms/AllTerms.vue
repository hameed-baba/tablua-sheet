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

            <td>
              <button
                class="action-btn"
                :class="term.buttonState === 'activate' ? 'present' : 'warning'"
                @click="handleButtonClick(term)"
              >
                {{ term.buttonState === "activate" ? "Activate" : "Confirm" }}
              </button>
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
import ActivateTerm from "./ActivateTerm.vue";
import { useToast } from "../../../../composables/useToast";

const toast = useToast();
const loading = ref(false);
const allTerms = ref([]);
const modifyRef = ref(null);
const selectedTerm = ref({});
const activateRef = ref(null);
const buttonState = ref("activate");

const getAllTerm = () => {
  loading.value = true;
  apiServices
    .getAllTerm()
    .then((response) => {
      // The array of roles is inside response.data.data
      // allTerms.value = response.data.data?.schoolterms;
      allTerms.value = response.data.data?.schoolterms.map((term) => ({
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
      }
      getAllTerm()
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

onMounted(() => {
  getAllTerm();
});
</script>

<style lang="scss" scoped>
</style>