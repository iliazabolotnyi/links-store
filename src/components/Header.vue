<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useStore.js'
import { useAuth } from '@/composables/useAuth.js'
import { useToastNofitications } from '@/composables/useToastNotifications'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menubar from 'primevue/menubar'

const authStore = useUserStore()
const { showToast } = useToastNofitications()
const router = useRouter()
const { signOut, errorMessage } = useAuth()

const emailFirstLetter = computed(() => {
  return authStore.user?.email ? authStore.user.email[0].toUpperCase() : ''
})

const signOutUser = async () => {
  try {
    await signOut()
    authStore.resetUser()
    await router.replace({ name: 'auth' })
  } catch (err) {
    showToast('error', 'Нажмите выход снова', errorMessage.value)
  }
}
</script>

<template>
  <div class="mb-5">
    <Menubar>
      <template #start>
        <div class="flex items-center gap-2">
          <span class="font-bold">Links Manager</span>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-link" rounded />
            <Button icon="pi pi-folder" rounded />
          </div>
        </div>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <Avatar :label="emailFirstLetter" label="A" size="large" shape="circle" />
          <Button icon="pi pi-sign-out" rounded severity="secondary" @click="signOutUser" />
        </div>
      </template>
    </Menubar>
  </div>
</template>