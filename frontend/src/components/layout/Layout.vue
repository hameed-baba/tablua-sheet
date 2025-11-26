<template>
  <div class="dashboard-container">
    <Sidebar />
    <main
      class="main-content"
      :class="{ expanded: !sidebarStore.isOpen && (isMobile || isTablet) }"
    >
      <Navbar />
      <div class="page-content">
        <router-view />
      </div>
      <Footer />
    </main>
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useSidebarStore } from "../../store/sidebarStore";
import { useBreakpoints } from "../../composables/useBreakpoints";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";

const route = useRoute();
const sidebarStore = useSidebarStore();
const { isMobile, isTablet, isDesktop } = useBreakpoints();

// Watch for screen size changes and auto-manage sidebar
watch(
  [isMobile, isDesktop],
  ([newIsMobile, newIsDesktop], [oldIsMobile, oldIsDesktop]) => {
    // Auto-close sidebar when switching to mobile/tablet
    if (!oldIsMobile && newIsMobile) {
      sidebarStore.close();
    }

    // Auto-open sidebar when switching to desktop
    if (!oldIsDesktop && newIsDesktop) {
      sidebarStore.open();
    }
  },
  { immediate: false }
);

// Watch for route changes and close sidebar on mobile/tablet
watch(route, () => {
  if ((isMobile.value || isTablet.value) && sidebarStore.isOpen) {
    sidebarStore.close();
  }
});

onMounted(() => {
  // Set initial sidebar state based on screen size
  if (isMobile.value || isTablet.value) {
    sidebarStore.close();
  } else {
    sidebarStore.open();
  }
});
</script>