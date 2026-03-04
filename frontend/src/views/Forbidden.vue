<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <div class="error-illustration">
        <div class="error-number">403</div>
        <div class="error-icon">
          <svg
            width="120"
            height="120"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      <div class="error-text">
        <h1>Access Denied</h1>
        <p>
          Sorry, you don't have permission to access this resource. Your account
          may not have the required privileges, or you may need to contact your
          administrator for access.
        </p>
      </div>

      <div class="error-actions">
        <button @click="goHome" class="btn-primary">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            class="me-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Go to Dashboard
        </button>

        <button @click="goBack" class="btn-secondary">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            class="me-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Back
        </button>
      </div>

      <div class="helpful-info">
        <h3>Need Help?</h3>
        <div class="info-grid">
          <div class="info-item">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div>
              <h4>Contact Administrator</h4>
              <p>
                Reach out to your system administrator to request access to this
                resource.
              </p>
            </div>
          </div>

          <div class="info-item">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div>
              <h4>Try Again Later</h4>
              <p>
                Sometimes permissions are updated. You can try accessing this
                resource again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="forbidden-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
      <div class="bg-shape shape-4"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/dashboard");
};

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/dashboard");
  }
};
</script>

<style scoped>
.forbidden-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.forbidden-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 64px 48px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 10;
  text-align: center;
}

.error-illustration {
  position: relative;
  margin-bottom: 40px;
}

.error-number {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 20px;
}

.error-icon {
  color: #f87171;
  opacity: 0.6;
}

.error-text {
  margin-bottom: 40px;
}

.error-text h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.error-text p {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #64748b;
  border: 2px solid #e2e8f0;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.helpful-info {
  border-top: 1px solid rgba(239, 68, 68, 0.1);
  padding-top: 32px;
}

.helpful-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 24px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.15);
}

.info-item svg {
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.info-item p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Background decoration */
.forbidden-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.05);
  backdrop-filter: blur(10px);
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  right: 10%;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 10%;
  animation: float 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 60%;
  right: 20%;
  animation: float 12s ease-in-out infinite;
}

.shape-4 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 20%;
  animation: float 6s ease-in-out infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .forbidden-content {
    padding: 48px 32px;
  }

  .error-number {
    font-size: 80px;
  }

  .error-text h1 {
    font-size: 24px;
  }

  .error-text p {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .info-grid {
    gap: 16px;
  }

  .info-item {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .forbidden-content {
    padding: 32px 24px;
    margin: 16px;
  }

  .error-number {
    font-size: 64px;
  }

  .info-item {
    flex-direction: column;
    text-align: center;
  }

  .info-item svg {
    margin-top: 0;
  }
}
</style>