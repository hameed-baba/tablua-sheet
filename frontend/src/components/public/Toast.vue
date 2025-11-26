<template>
  <div
    v-if="visible"
    class="position-fixed top-0 end-0 p-3"
    style="z-index: 1060;"
  >
    <div
      class="toast show align-items-center text-white border-0 shadow-lg fade"
      :class="toastClass"
      role="alert"
    >
      <div class="d-flex align-items-center px-3 py-2">
        <i :class="['me-2 fs-4', iconClass]"></i>
        <div class="flex-grow-1">
          <strong class="d-block">{{ title }}</strong>
          <small>{{ message }}</small>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white ms-3"
          @click="closeToast"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppToast",
  props: {
    type: {
      type: String,
      default: "success", // success, danger, info, warning, primary
    },
    title: {
      type: String,
      default: "Success",
    },
    message: {
      type: String,
      default: "Action completed successfully.",
    },
    duration: {
      type: Number,
      default: 4500, // auto-hide after 3s
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    toastClass() {
      const colors = {
        success: "bg-success",
        danger: "bg-danger",
        info: "bg-info",
        warning: "bg-warning",
        primary: "bg-primary",
      };
      return colors[this.type] || "bg-success";
    },
    iconClass() {
      const icons = {
        success: "fa-solid fa-circle-check",
        danger: "fa-solid fa-circle-xmark",
        info: "fa-solid fa-circle-info",
        warning: "fa-solid fa-triangle-exclamation",
        primary: "fa-solid fa-bell",
      };
      return icons[this.type] || "fa-solid fa-circle-check";
    },
  },
  methods: {
    closeToast() {
      this.visible = false;
    },
  },
  mounted() {
    if (this.duration > 0) {
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    }
  },
};
</script>

<style scoped>
.toast {
  transition: opacity 0.4s ease-in-out;
}
</style>
