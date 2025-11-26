<template>
  <tr>
    <td :colspan="colspan" class="text-center">
      <div class="no-results">
        <i class="fa fa-spinner fa-spin" v-if="loading"></i>

        <svg
          width="48"
          height="48"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          v-else
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <p v-if="loading">Loading...</p>
        <p v-else>No record found</p>
      </div>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  colspan: {
    type: Number,
    default: 8,
  },
});

// export default {
//   name: "NoResultsRow",
//   props: {
//     loading: {
//       type: Boolean,
//       default: false,
//     },
//     colspan: {
//       type: Number,
//       default: 8,
//     },
//   },
// };
</script>
