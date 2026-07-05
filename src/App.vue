<script setup>
  import { onMounted } from 'vue'
  import { useUserStore } from '@/stores/useStore.js'
  import { RouterView } from 'vue-router'
  import Header from '@/components/Header.vue'

  const authStore = useUserStore()
  onMounted(async () => {
    await authStore.getUser()
  })
</script>


<template>
  <Header v-if="authStore.user"/>
  <RouterView />
</template>

<style scoped></style>
