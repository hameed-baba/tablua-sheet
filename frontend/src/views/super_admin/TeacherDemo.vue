<template>
  <div class="demo-page">
    <div class="demo-container">
      <h1>Teacher Dashboard Demo</h1>
      <p>Click the button below to access the Teacher Dashboard</p>
      
      <div class="demo-actions">
        <router-link to="/teacher-dashboard" class="demo-btn">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1"/>
          </svg>
          Access Teacher Dashboard
        </router-link>
        
        <router-link to="/dashboard" class="demo-btn secondary">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
          </svg>
          Admin Dashboard
        </router-link>
      </div>

      <div class="demo-info">
        <h3>Teacher Dashboard Features:</h3>
        <ul>
          <li>View assigned classes and subjects</li>
          <li>Enter CA1, CA2, and Exam marks</li>
          <li>Bulk mark entry for efficiency</li>
          <li>Real-time progress tracking</li>
          <li>Student search and filtering</li>
          <li>No sidebar - clean, focused interface</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// Demo page - no complex logic needed
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.demo-container {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.demo-container h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.demo-container p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.demo-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.demo-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.4);
  color: white;
  text-decoration: none;
}

.demo-btn.secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.demo-btn.secondary:hover {
  box-shadow: 0 10px 20px -5px rgba(107, 114, 128, 0.4);
}

.demo-info {
  text-align: left;
  background: #f9fafb;
  padding: 2rem;
  border-radius: 8px;
}

.demo-info h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.demo-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.demo-info li {
  padding: 0.5rem 0;
  color: #4b5563;
  position: relative;
  padding-left: 1.5rem;
}

.demo-info li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .demo-container {
    padding: 2rem;
  }

  .demo-container h1 {
    font-size: 2rem;
  }

  .demo-actions {
    flex-direction: column;
  }

  .demo-btn {
    justify-content: center;
  }
}
</style>