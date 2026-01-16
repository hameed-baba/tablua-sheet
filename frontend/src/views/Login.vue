<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Left Panel - Blue Wave Design -->
      <div class="left-panel">
        <div class="wave-background">
          <svg
            class="wave"
            viewBox="0 0 400 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L400,0 L400,400 Q350,450 300,400 Q250,350 200,400 Q150,450 100,400 Q50,350 0,400 Z"
              fill="rgba(255,255,255,0.1)"
            />
            <path
              d="M0,50 L400,50 L400,450 Q350,500 300,450 Q250,400 200,450 Q150,500 100,450 Q50,400 0,450 Z"
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        </div>

        <div class="left-content">
          <div class="brand-section">
            <div class="brand-logo">
              <div class="logo-circle">
                <i class="fa fa-graduation-cap"></i>
              </div>
            </div>
            <h1 class="brand-title">Welcome to</h1>
            <h2 class="brand-name">Greenwood Academy</h2>
            <p class="brand-description">
              Streamline your school management with our comprehensive platform.
              Manage students, staff, grades, and operations all in one place.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Login Form -->
      <div class="right-panel">
        <div class="form-container">
          <h2 class="form-title">Access your account</h2>

          <vee-form
            class="login-form"
            :validation-schema="formValidation"
            v-slot="{ errors }"
            @submit="handleLogin"
          >
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <vee-form-field
                type="email"
                v-model="formData.email"
                class="form-input"
                placeholder="Enter your email"
                :disabled="loading"
                name="email"
                :class="{ error: errors.email }"
              />
              <vee-form-error name="email" class="error-message" />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="password-input-container">
                <vee-form-field
                  :type="showPassword ? 'text' : 'password'"
                  v-model="formData.password"
                  class="form-input"
                  placeholder="Enter your password"
                  :disabled="loading"
                  name="password"
                  :class="{ error: errors.password }"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :disabled="loading"
                >
                  <i
                    :class="['fa', showPassword ? 'fa-eye' : 'fa-eye-slash']"
                  ></i>
                </button>
              </div>
              <vee-form-error name="password" class="error-message" />
            </div>

            <button type="submit" class="sign-in-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? "Signing in..." : "Sign In" }}
            </button>
          </vee-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
import apiServices from "../services/apiServices";
import { useLoginStore } from "../store/loginStore";

const formValidation = yup.object().shape({
  email: yup.string().required("Email address is required").email(),
  password: yup.string().required("Password is required"),
  // .min(5, "Password must be at least 8 characters"),
});

const router = useRouter();

const formData = ref({
  email: "",
  password: "",
});
const errorMessage = ref("");

const loading = ref(false);
const showPassword = ref(false);

const handleLogin = () => {
  loading.value = true;

  apiServices
    .login(formData.value)
    .then((response) => {
      if (!response || !response.data) {
        errorMessage.value = "No response from server.";
        return;
      }

      const data = response.data.data;
      const user = data.user;
      const role = user.role;
      const permissions = user.permissions;
      const accessToken = data.token;

      // Save to localStorage
      localStorage.setItem(
        "tebulasheet_active_user",
        JSON.stringify({ user, role, permissions, accessToken })
      );

      useLoginStore()
        .login({
          user: { ...user, role, permissions },
          accessToken,
        })
        .then(() => {
          router.push({ name: "dashboard" });
        });
    })
    .catch((error) => {
      console.error("Login failed:", error);
      errorMessage.value = "Invalid credentials or server error.";
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  /* background: #e5e7eb; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.login-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  max-width: 900px;
  width: 100%;
  min-height: 600px;
}

/* Left Panel - Blue to Purple Gradient */
.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.wave-background {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.wave {
  width: 100%;
  height: 100%;
}

.left-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 40px;
  max-width: 350px;
}

.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-logo {
  margin-bottom: 30px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin: 0 auto;
}

.logo-circle i {
  font-size: 32px;
  color: white;
}

.brand-title {
  font-size: 24px;
  font-weight: 400;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.brand-name {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.brand-description {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.8;
  margin: 0;
}

/* Right Panel - Login Form */
.right-panel {
  flex: 1;
  /* padding: 80px 60px; */
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.form-container {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: #fafbfc;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 40px 0;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 2px;
}

.form-input {
  padding: 16px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: #f9fafb;
  color: #374151;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #d1d5db;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.05);
}

.form-input.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.form-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.password-input-container {
  position: relative;
}

.password-input-container .form-input {
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.password-toggle:hover:not(:disabled) {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.password-toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  font-size: 14px;
  color: #ef4444;
  margin-top: 4px;
}

.sign-in-btn {
  width: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.sign-in-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.sign-in-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .login-wrapper {
    flex-direction: column;
    max-width: 500px;
  }

  .left-panel {
    min-height: 300px;
    padding: 40px 30px;
  }

  .brand-title {
    font-size: 20px;
  }

  .brand-name {
    font-size: 28px;
  }

  .brand-description {
    font-size: 14px;
  }

  .logo-circle {
    width: 60px;
    height: 60px;
  }

  .logo-circle i {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 10px;
  }

  .left-panel {
    padding: 30px 20px;
    min-height: 250px;
  }

  .right-panel {
    padding: 50px 30px;
  }

  .form-container {
    padding: 30px;
  }

  .form-title {
    font-size: 24px;
  }

  .brand-title {
    font-size: 18px;
  }

  .brand-name {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .left-panel {
    padding: 20px 15px;
  }

  .right-panel {
    padding: 40px 20px;
  }

  .form-container {
    padding: 25px;
  }

  .form-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .logo-circle {
    width: 50px;
    height: 50px;
  }

  .logo-circle i {
    font-size: 20px;
  }

  .brand-description {
    font-size: 13px;
  }
}
</style>