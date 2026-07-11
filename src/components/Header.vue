<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useStore.js'
import { useAuth } from '@/composables/useAuth.js'
import { useToastNotifications } from '@/composables/useToastNotifications'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menubar from 'primevue/menubar'
import CategoriesModal from '@/components/Modals/CategoriesModal.vue'
import CreateLinkModal from '@/components/Modals/CreateLinkModal.vue'

const authStore = useUserStore()
const { showToast } = useToastNotifications()
const router = useRouter()
const { signOut, errorMessage } = useAuth()

const categoriesDialogVisible = ref(false)
const createLinkDialogVisible = ref(false)

const emailFirstLetter = computed(() => {
  return authStore.user?.email ? authStore.user.email[0].toUpperCase() : ''
})

const signOutUser = async () => {
  try {
    await signOut()
    authStore.resetUser()
    await router.push('/auth')
  } catch (err) {
    showToast('error', 'Нажмите выход снова', errorMessage.value)
  }
}
</script>

<template>
  <CategoriesModal v-model="categoriesDialogVisible" />
  <CreateLinkModal v-model="createLinkDialogVisible" />
  <div class="mb-5">
    <Menubar>
      <template #start>
        <div class="flex items-center gap-2">
          <span class="font-bold">Links Store</span>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-link" rounded @click="createLinkDialogVisible = true" />
            <Button icon="pi pi-folder" rounded @click="categoriesDialogVisible = true" />
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
