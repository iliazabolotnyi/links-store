<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { Form } from '@primevue/forms'
import { supabase } from '@/supabase.js'
import { useToastNofitications } from '@/composables/useToastNotifications.js'
import Toast from 'primevue/toast'

const modelValue = defineModel()
const { showToast } = useToastNofitications()

const isLoading = ref(false)
const categoryName = ref('')
const listCategories = ref([])

const saveCategory = async () => {
  isLoading.value = true

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: categoryName.value })
      .select()
    if (error) throw error
    listCategories.value.push(data[0])
    categoryName.value = ''

    showToast('success', 'Успех', 'Категория добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить категорию')
    categoryName.value = ''
  } finally {
    isLoading.value = false
  }
}

const deleteCategory = (id) => {
}
</script>

<template>
  <Toast/>
  <Dialog header="Категории" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form @submit="saveCategory">
      <div class="gap-2 mb-2">
        <InputText
          v-model="categoryName"
          class="flex-auto w-full"
          autocomplete="off"
          placeholder="Название новой категории"
        />
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Добавить" :loading="isLoading" @click="saveCategory" />
      </div>
      <div
        class="grid mt-3 grid-cols-[1fr_32px] mb-1 gap-5"
        v-for="category in listCategories"
        :key="category.id"
      >
        {{ category.name }}
        <Button
          type="button"
          rounded
          size="small"
          variant="text"
          icon="pi pi-times"
          @click="deleteCategory(category.id)"
        />
      </div>
    </Form>
  </Dialog>
</template>