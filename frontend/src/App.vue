<template>
  <RouterView />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useLoginStore } from "./store/loginStore";

const loginStore = useLoginStore();
const res = ref(null);
onMounted(() => {
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
</script>

<style scoped>
</style>