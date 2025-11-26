<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <i class="fa fa-graduation-cap logo-icon" aria-hidden="true"></i>
          <h1>Greenwood Academy</h1>
        </div>
        <p class="login-subtitle">School Management System</p>
      </div>

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
            :class="{ 'text-danger': errors.email }"
          />
          <vee-form-error name="email" class="text-danger" />
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
              :class="{ 'text-danger': errors.email }"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :disabled="loading"
            >
              <i :class="['fa', showPassword ? 'fa-eye' : 'fa-eye-slash']"></i>
            </button>
          </div>
          <vee-form-error name="password" class="text-danger" />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>
      </vee-form>
    </div>

    <!-- Background decoration -->
    <div class="login-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 10;
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo-icon {
  color: #667eea;
  font-size: 24px;
}

.logo h1 {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.login-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-container .form-input {
  padding-right: 44px; /* Make room for the toggle button */
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 6px;
  border-radius: 5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.password-toggle:hover:not(:disabled) {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.password-toggle:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  text-align: center;
  margin-top: 18px;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #764ba2;
}

.demo-credentials {
  margin-top: 24px;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.demo-credentials h4 {
  margin: 0 0 10px 0;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
}

.demo-item {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.demo-item:last-child {
  margin-bottom: 0;
}

.demo-item strong {
  color: #475569;
}

.spinner {
  width: 14px;
  height: 14px;
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

/* Background decoration */
.login-bg {
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
  background: #f8f6fa;
  /* background: rgba(255, 255, 255, 0.1); */
  backdrop-filter: blur(10px);
}

.shape-1 {
  width: 250px;
  height: 250px;
  top: -125px;
  right: -125px;
  animation: float 6s ease-in-out infinite;
}

.shape-2 {
  width: 180px;
  height: 180px;
  bottom: -90px;
  left: -90px;
  animation: float 8s ease-in-out infinite reverse;
}

.shape-3 {
  width: 130px;
  height: 130px;
  top: 50%;
  left: -65px;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    padding: 24px 20px;
    margin: 16px;
  }

  .logo h1 {
    font-size: 20px;
  }

  .form-input {
    padding: 11px 14px;
    font-size: 14px;
  }

  .password-input-container .form-input {
    padding-right: 40px; /* Adjust for smaller screens */
  }

  .password-toggle {
    right: 10px;
    padding: 5px;
  }

  .login-btn {
    padding: 11px 18px;
  }
}
</style>