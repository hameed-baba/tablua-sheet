<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo p-2">
          <h4>
            Daylight Academy <br />
            <small> Talata Mafara</small>
          </h4>
        </div>
        <h1>Sign in to Dashboard</h1>
        <p>Welcome back! Please sign in to continue</p>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit" novalidate>
        <div class="input-group" :class="{ error: errors.email }">
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            autocomplete="email"
            placeholder="Enter your email address"
            @blur="validateEmail"
          />
          <span class="error-message" :class="{ show: errors.email }">
            {{ errors.email }}
          </span>
        </div>

        <div class="input-group" :class="{ error: errors.password }">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            required
            autocomplete="current-password"
            placeholder="Enter your password"
            @blur="validatePassword"
          />
          <button
            type="button"
            class="password-toggle"
            @click="togglePasswordVisibility"
            aria-label="Toggle password visibility"
          >
            <svg
              class="eye-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 3C4.5 3 1.6 5.6 1 8c.6 2.4 3.5 5 7 5s6.4-2.6 7-5c-.6-2.4-3.5-5-7-5zm0 8.5A3.5 3.5 0 118 4.5a3.5 3.5 0 010 7zm0-5.5a2 2 0 100 4 2 2 0 000-4z"
                fill="currentColor"
              />
            </svg>
          </button>
          <span class="error-message" :class="{ show: errors.password }">
            {{ errors.password }}
          </span>
        </div>

        <!-- General error message -->
        <div v-if="errorMessage" class="general-error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="submit-btn"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          <span class="btn-text">Sign in</span>
          <div class="btn-loader">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle
                cx="9"
                cy="9"
                r="7"
                stroke="currentColor"
                stroke-width="2"
                opacity="0.25"
              />
              <path
                d="M16 9a7 7 0 01-7 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
        </button>
      </form>

      <!-- <div class="divider">
        <span>or continue with</span>
      </div> -->
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

// Reactive state - updated to match Login2 form structure
const form = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: "",
  password: "",
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

// Validation methods
const validateEmail = () => {
  if (!form.value.email) {
    errors.value.email = "Email is required";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = "Please enter a valid email address";
    return false;
  }

  errors.value.email = "";
  return true;
};

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = "Password is required";
    return false;
  }

  if (form.value.password.length < 6) {
    errors.value.password = "Password must be at least 6 characters";
    return false;
  }

  errors.value.password = "";
  return true;
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Main login handler - using the actual API logic from Login.vue
const handleSubmit = async () => {
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await apiServices.login(form.value);

    if (!response || !response.data) {
      errorMessage.value = "No response from server.";
      return;
    }

    const data = response.data.data;
    const user = data.user;
    const role = user.role;
    const accessToken = data.token;

    // Save to localStorage
    localStorage.setItem(
      "tebulasheet_active_user",
      JSON.stringify({ user, role, accessToken })
    );

    await useLoginStore().login({
      user: { ...user, role },
      accessToken,
    });

    const roleSlug = role.slug;
    let adminAccess = ["admin", "super_admin"];

    if (adminAccess.includes(roleSlug)) {
      router.push({ name: "dashboard" });
    } else if (roleSlug === "teacher") {
      router.push({ name: "teacher-dashboard" });
    } else {
      errorMessage.value = "Unauthorized User.";
    }

    // router.push({ name: "dashboard" });
  } catch (error) {
    console.error("Login failed:", error);
    errorMessage.value = error.response.data.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Responsive utility classes */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 32px;
  }
}

.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
}

.login-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1),
    0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.logo h4 {
  text-align: center;
  color: #1a1f36;
  font-weight: 600;
  line-height: 1.4;
}

.login-header h1 {
  color: #1a1f36;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.login-header p {
  color: #8792a2;
  font-size: 14px;
  font-weight: 400;
}

/* Input Groups */
.input-group {
  position: relative;
  margin-bottom: 24px;
}

.input-group input {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e3e8ee;
  border-radius: 8px !important;
  padding: 16px 14px;
  color: #1a1f36;
  font-size: 16px;
  font-weight: 400;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  min-height: 48px; /* Better touch target */
}

.input-group input:focus {
  border-color: #635bff;
  box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.1);
}

.input-group input::placeholder {
  color: #8792a2;
  font-size: 16px;
}

/* Password Toggle */
.input-group:has(.password-toggle) input {
  padding-right: 42px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #8792a2;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px; /* Better touch target */
  min-height: 32px; /* Better touch target */
}

.password-toggle:hover {
  color: #635bff;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #6b7385;
  font-weight: 500;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1.5px solid #d1d9e0;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
}

.checkbox-container input[type="checkbox"]:checked + .checkmark {
  background: #635bff;
  border-color: #635bff;
  color: white;
}

.forgot-link {
  color: #635bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #4c44d4;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 14px 20px;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  margin-bottom: 24px;
  transition: all 0.2s ease;
  overflow: hidden;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-color: #3b82f6;
}

.submit-btn:hover {
  // background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #a2a7b5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-text {
  transition: opacity 0.2s ease;
}

.btn-loader {
  position: absolute;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: #ffffff;
}

.submit-btn.loading .btn-text {
  opacity: 0;
}

.submit-btn.loading .btn-loader {
  opacity: 1;
}

/* Divider */
.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e3e8ee;
}

.divider span {
  background: #ffffff;
  color: #8792a2;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Social Buttons */
.social-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  flex: 1;
  background: #ffffff;
  color: #6b7385;
  border: 1px solid #e3e8ee;
  border-radius: 6px;
  padding: 12px 16px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-height: 44px;
}

.social-btn:hover {
  border-color: #d1d9e0;
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.social-btn:active {
  transform: translateY(0);
}

/* Signup Link */
.signup-link {
  text-align: center;
  font-size: 14px;
  color: #8792a2;
}

.signup-link a {
  color: #635bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  color: #4c44d4;
  text-decoration: underline;
}

/* Error States */
.error-message {
  color: #f56565;
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.2s ease;
}

.error-message.show {
  opacity: 1;
  transform: translateY(0);
}

.general-error-message {
  color: #f56565;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
}

.input-group.error input {
  border-color: #f56565;
  background: #fef5f5;
}

.input-group.error input:focus {
  border-color: #f56565;
}

.input-group.error label {
  color: #f56565;
}

.input-group.error .input-border {
  background: #f56565;
}

/* Success Message */
.success-message {
  display: none;
  text-align: center;
  padding: 32px 20px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.3s ease;
}

.success-message.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.success-icon {
  margin: 0 auto 16px;
  animation: successPop 0.5s ease-out;
}

@keyframes successPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.success-message h3 {
  color: #1a1f36;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.success-message p {
  color: #8792a2;
  font-size: 14px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }

  .login-card {
    padding: 32px 24px;
    border-radius: 8px;
    // max-width: 100%;
  }

  .login-header h1 {
    font-size: 1.25rem;
  }

  .login-header p {
    font-size: 13px;
  }

  .input-group input {
    padding: 14px 12px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  .password-toggle {
    right: 10px;
  }

  .submit-btn {
    padding: 12px 20px;
    font-size: 15px;
    min-height: 44px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .social-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .social-btn {
    padding: 10px 16px;
    min-height: 40px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 12px;
  }

  .login-card {
    padding: 28px 20px;
    border-radius: 6px;
  }

  .login-header {
    margin-bottom: 28px;
  }

  .login-header h1 {
    font-size: 1.125rem;
  }

  .logo h4 {
    font-size: 0.9rem;
    line-height: 1.3;
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group input {
    padding: 12px 10px;
  }

  .password-toggle {
    right: 8px;
  }

  .submit-btn {
    padding: 10px 16px;
    min-height: 40px;
  }
}

/* Tablet Responsive */
@media (min-width: 769px) and (max-width: 1024px) {
  .login-container {
    padding: 24px;
  }

  .login-card {
    max-width: 400px;
    padding: 40px 36px;
  }
}

/* Large Screen Responsive */
@media (min-width: 1025px) {
  .login-container {
    padding: 32px;
  }

  .login-card {
    max-width: 420px;
  }
}

/* Extra Small Devices */
@media (max-width: 360px) {
  .login-container {
    padding: 8px;
  }

  .login-card {
    padding: 24px 16px;
    border-radius: 4px;
  }

  .login-header h1 {
    font-size: 1rem;
  }

  .logo h4 {
    font-size: 0.8rem;
  }

  .input-group input {
    padding: 10px 8px;
    font-size: 16px;
  }

  .password-toggle {
    right: 6px;
    min-width: 28px;
    min-height: 28px;
  }

  .submit-btn {
    padding: 8px 12px;
    font-size: 14px;
    min-height: 36px;
  }
}

/* Landscape Mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .login-container {
    min-height: 100vh;
    padding: 16px;
  }

  .login-card {
    padding: 24px 20px;
  }

  .login-header {
    margin-bottom: 20px;
  }

  .login-header h1 {
    font-size: 1.125rem;
  }

  .input-group {
    margin-bottom: 16px;
  }
}
</style>