<template>
  <RouterView />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useLoginStore } from "./store/loginStore";
import sessionManager from "./utils/sessionManager";

const loginStore = useLoginStore();
const res = ref(null);

onMounted(() => {
  // Check if user explicitly logged out
  const explicitLogout = localStorage.getItem("tebulasheet_explicit_logout");
  
  if (explicitLogout) {
    // User explicitly logged out, don't auto-login even if token exists
    localStorage.removeItem("tebulasheet_active_user");
    localStorage.removeItem("tebulasheet_explicit_logout");
    return;
  }

  const authUser = localStorage.getItem("tebulasheet_active_user");

  if (authUser) {
    const parsed = JSON.parse(authUser);
    res.value = parsed;

    if (parsed?.accessToken) {
      loginStore.login({
        user: {
          ...parsed.user,
          role: parsed.user.role,
          permissions: parsed.user.permissions,
        },
        accessToken: parsed.accessToken,
      });
    }
  }
});

onUnmounted(() => {
  // Clean up session manager when app is destroyed
  sessionManager.destroy();
});
</script>

<style scoped>
</style>