<script setup>
import Checkbox from 'primevue/checkbox'
import { useLinksStore } from '@/stores/linksStore.js'

const linksStore = useLinksStore()

const updateFilters = () => {
  linksStore.fetchLinks(true)
}
</script>

<template>
  <div class="md:flex gap-5 block">
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linksStore.onlyFavorites"
        inputId="onlyFavorites"
        name="onlyFavorites"
        binary
        @change="updateFilters"
      />
      <label for="onlyFavorites">Предпочитаемые ресурсы</label>
    </div>
  </div>
</template>
