<template>
  <div v-if="totalPages > 1" class="pagination-container">
    <div class="pagination-info">
      <span class="pagination-text">
        Showing {{ startItem }} to {{ endItem }} of {{ totalCount }} entries
      </span>
    </div>
    
    <div class="pagination-controls">
      <button
        class="pagination-btn"
        :disabled="!hasPrevPage"
        @click="goToPage(currentPage - 1)"
      >
        <i class="fa fa-chevron-left"></i>
        Previous
      </button>
      
      <div class="pagination-pages">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-page"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        class="pagination-btn"
        :disabled="!hasNextPage"
        @click="goToPage(currentPage + 1)"
      >
        Next
        <i class="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  totalCount: {
    type: Number,
    required: true,
    default: 0
  },
  limit: {
    type: Number,
    required: true,
    default: 25
  },
  hasNextPage: {
    type: Boolean,
    default: false
  },
  hasPrevPage: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['page-change']);

const startItem = computed(() => {
  return (props.currentPage - 1) * props.limit + 1;
});

const endItem = computed(() => {
  const end = props.currentPage * props.limit;
  return end > props.totalCount ? props.totalCount : end;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  
  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (props.currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(props.totalPages);
    } else if (props.currentPage >= props.totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = props.totalPages - 3; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(props.currentPage - 1);
      pages.push(props.currentPage);
      pages.push(props.currentPage + 1);
      pages.push('...');
      pages.push(props.totalPages);
    }
  }
  
  return pages;
});

const goToPage = (page) => {
  if (page !== '...' && page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-text {
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-page {
  min-width: 40px;
  height: 40px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-page:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-page.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-info {
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .pagination-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .pagination-page {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }
}
</style>
