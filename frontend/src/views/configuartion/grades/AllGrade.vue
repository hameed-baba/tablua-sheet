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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        All Grade Systems
      </h2>

      <div class="header-actions">
        <button class="add-btn" @click="navigateToRegister">
          <i class="fa fa-plus"></i>
          <span class="btn-text">Add New Grade System</span>
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Grade System Name</th>
            <th class="d-none d-lg-table-cell">Grade Type</th>
            <th class="d-none d-lg-table-cell">Total Ranges</th>
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
          <tr v-if="!loading && allGrades.length === 0">
            <td class="text-center" colspan="5">No data</td>
          </tr>
          <tr v-for="(grade, index) in allGrades" :key="index">
            <td>
              <div class="grade-name">{{ grade.grade_name }}</div>
              <div class="d-lg-none mobile-details">
                <div class="mobile-detail-item">
                  <small class="text-muted">{{
                    changeTypeName(grade.grade_type)
                  }}</small>
                </div>
                <div class="mobile-detail-item">
                  <small class="text-muted"
                    >{{ grade.gradeSystems?.length || 0 }} ranges</small
                  >
                </div>
                <div class="mobile-detail-item">
                  <small class="text-muted">
                    {{
                      grade.createdAt ? grade.createdAt.substring(0, 10) : ""
                    }}
                  </small>
                </div>
              </div>
            </td>
            <td class="d-none d-lg-table-cell">
              {{ changeTypeName(grade.grade_type) }}
            </td>
            <td class="d-none d-lg-table-cell">
              {{ grade.gradeSystems?.length || 0 }}
            </td>
            <td class="d-none d-lg-table-cell">
              {{ grade.createdAt ? grade.createdAt.substring(0, 10) : "" }}
            </td>
            <td>
              <button
                class="action-btn edit"
                @click="navigateToUpdate(grade.id)"
              >
                Edit
              </button>
              <button
                class="action-btn delete"
                @click="deleteGradeConfirmation(grade)"
              >
                Delete
              </button>
              <button class="action-btn info" @click="viewGrade(grade)">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ConfirmDeleteModal
    :show="showDeleteModal"
    @confirm="deleteGrade"
    @cancel="showDeleteModal = false"
  />
  <ViewGradeInfo ref="viewGradeRef" :grade-to-view="selectedGrade" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ViewGradeInfo from "./ViewGradeInfo.vue";
import ConfirmDeleteModal from "../../../components/public/ConfirmDeleteModal.vue";
import { useToast } from "../../../composables/useToast";
import apiServices from "../../../services/apiServices";

const router = useRouter();
const toast = useToast();
const loading = ref(false);
const allGrades = ref([]);
const viewGradeRef = ref(null);
const selectedGrade = ref({});
const showDeleteModal = ref(false);

// Hardcoded data from the API response

const getAllGarde = () => {
  loading.value = true;
  apiServices
    .getAllGarde()
    .then((response) => {
      // The array of roles is inside response.data.data
      allGrades.value = response.data.data || [];
    })
    .catch((error) => {
      console.error("Error fetching sections:", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const navigateToRegister = () => {
  router.push("/grades/register");
};

const navigateToUpdate = (id) => {
  router.push(`/grades/update/${id}`);
};

const deleteGradeConfirmation = (grade) => {
  selectedGrade.value = grade;
  showDeleteModal.value = true;
};

const viewGrade = (grade) => {
  selectedGrade.value = grade;
  viewGradeRef.value.toggleModal();
};

const deleteGrade = () => {
  apiServices
    .deleteGrade(selectedGrade.value.id)
    .then((response) => {
      if (response.status === 200) {
        toast.success(
          "Grade System Deleted Successfully",
          `The grade system ${selectedGrade.value.grade_name} has been deleted successfully.`
        );
        showDeleteModal.value = false;
        getAllGarde();
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error(
        "Failed Deleted Grade",
        error.response?.data?.message ||
          `An error occurred while deleting the grade `
      );
    })
    .finally();
};

const changeTypeName = (type) =>
  ({ letter_grade: "Letter Grade", remark_grade: "Remark Grade" }[type] || "");

onMounted(() => {
  getAllGarde();
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

.grade-name {
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

td {
  .action-btn {
    @media (max-width: 767px) {
      padding: 0.375rem 0.75rem;
      font-size: 0.813rem;
    }
  }
}
</style>