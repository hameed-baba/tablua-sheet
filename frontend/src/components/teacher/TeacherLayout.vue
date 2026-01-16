<template>
  <div class="teacher-layout">
    <!-- Top Navigation Bar -->
    <nav class="teacher-navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <h2>TebulaSheet</h2>
          <span class="teacher-badge">Teacher</span>
        </div>
        
        <div class="navbar-actions">
          <div class="user-info">
            <span class="user-name">{{ teacherName }}</span>
          </div>
          
          <button class="logout-btn" @click="logout">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="teacher-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const toast = useToast()

// This would typically come from auth store
const teacherName = ref('John Doe')

const logout = () => {
  // Handle logout logic here
  toast.success('Logged out', 'You have been successfully logged out')
  router.push('/')
}
</script>

<style scoped>
.teacher-layout {
  min-height: 100vh;
  background-color: #fafbfc;
}

.teacher-navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-brand h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 700;
}

.teacher-badge {
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 500;
  color: #1a1a1a;
  font-size: 0.875rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.teacher-main {
  min-height: calc(100vh - 70px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-content {
    padding: 0 1rem;
  }

  .navbar-brand h2 {
    font-size: 1.25rem;
  }

  .teacher-badge {
    display: none;
  }

  .user-name {
    display: none;
  }

  .logout-btn {
    padding: 0.5rem;
  }

  .logout-btn span {
    display: none;
  }
}
</style>