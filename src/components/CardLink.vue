<script setup>
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import { useToastNotifications } from '@/composables/useToastNotifications.js'
import SpeedDial from 'primevue/speeddial'
import { useLinksStore } from '@/stores/linksStore'
import CreateLinkModal from '@/components/Modals/CreateLinkModal.vue'

const { link } = defineProps({
  link: {
    type: Object,
    required: true,
  },
})

const createLinkDialogVisible = ref(false)
const linksStore = useLinksStore()
const { showToast } = useToastNotifications()

const itemsMenuButton = ref([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: async () => {
      try {
        await linksStore.changeIsFavorite(link.id)
        showToast('success', 'Успешно', 'Изменения сохранены')
      } catch {
        showToast('error', 'Ошибка')
      }
    },
  },
  {
    label: 'Скопировать',
    icon: 'pi pi-link',
    command: () => {
      copyToClipboard()
    },
  },
  {
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    command: () => {
      createLinkDialogVisible.value = true
    },
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        await linksStore.removeLink(link.id)
        showToast('success', 'Успешно', 'Ссылка удалена')
      } catch {
        showToast('error', 'Ошибка')
      }
    },
  },
])

const isFavoriteBgCard = computed(() => {
  return link.is_favorite ? 'var(--p-button-outlined-warn-hover-background' : ''
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.url)
    showToast('success', `Успешно`, `Скопировано ${link.name}`)
  } catch {
    showToast('error', 'Ошибка при копировании')
  }
}

const openLink = () => {
  linksStore.addClickCount(link.id)
}
</script>

<template>
  <Toast />
  <CreateLinkModal v-model="createLinkDialogVisible" isEdit :id="link.id" />
  <Card class="relative" :style="{ backgroundColor: isFavoriteBgCard }">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.preview_image" :alt="link.name" />
        <a :href="link.url" target="_blank" @click="openLink">{{ link.name }}</a>
        <SpeedDial
          :model="itemsMenuButton"
          :tooltipOptions="{ position: 'left' }"
          direction="down"
          style="position: absolute; right: 20px; top: 20px"
        />
      </div>
    </template>
    <template #content>
      <div class="flex gap-2 flex-col">
        <div class="font-bold">{{ link.categories.name }}</div>
        <div class="h-full" v-if="link.description">{{ link.description }}</div>
      </div>
    </template>
  </Card>
</template>
