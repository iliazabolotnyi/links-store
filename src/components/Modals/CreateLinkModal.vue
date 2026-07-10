<script setup>
import { ref, watch } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { supabase } from '@/supabase.js'
import { useToastNofitications } from '@/composables/useToastNotifications.js'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import Loader from '@/components/Loader.vue'
import Toast from 'primevue/toast'
import { useUserStore } from '@/stores/useStore.js'

const userStore = useUserStore()
const modelValue = defineModel()
const { showToast } = useToastNofitications()
const isLoading = ref(false)
const isLoadingButton = ref(false)

const rules = z.object({
  name: z.string().min(1, { message: 'Название обязательно для заполнение' }),
  url: z.string().url({ message: 'Некорректная ссылка' }),
})

const resolver = ref(zodResolver(rules))

const formInputs = ref({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const listCategories = ref([])

const clear = () => {
  formInputs.value = {
    name: '',
    url: '',
    description: '',
    category: null,
    isFavorite: false,
  }
}

const getCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select()
    if (error) throw error
    listCategories.value = data
    formInputs.value.category = listCategories.value[0]
  } catch {
    showToast('error', 'Ошибка', 'Не удалось получить категории')
  }
}

const getDomain = (url) => {
  const { hostname } = new URL(url)
  const parts = hostname.split('.')
  if (parts.length > 2) {
    return parts.slice(-2).join('.')
  }
  return hostname
}

const addNewLink = async () => {
  isLoadingButton.value = true
  const hostname = getDomain(formInputs.value.url)
  const payload = {
    name: formInputs.value.name,
    url: formInputs.value.url,
    description: formInputs.value.description,
    category: formInputs.value.category.id,
    click_count: 0,
    is_favorite: formInputs.value.isFavorite,
    preview_image: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=32`,
    user_id: userStore.user.id,
  }

  try {
    const { error } = await supabase.from('links').insert(payload).select()
    if (error) throw error
    modelValue.value = false
    clear()
    showToast('success', 'Успех', 'Ссылка добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить ссылку')
  } finally {
    isLoadingButton.value = false
  }
}

const submitForm = async () => {
  await addNewLink()
}

const loadModal = async () => {
  isLoading.value = true
  await getCategories()
  isLoading.value = false
}

watch(modelValue, async (newValue) => {
  if (newValue) {
    await loadModal()
  }
})
</script>

<template>
  <Toast />
  <Dialog modal header="Создание ссылки" v-model:visible="modelValue" class="w-[25rem]">
    <Form
      v-slot="$form"
      :initial-values="formInputs"
      :resolver="resolver"
      validateOnBlur
      :validateOnValueUpdate="false"
      @submit="submitForm"
    >
      <Loader v-if="isLoading" />
      <template v-else>
        <div class="mb-3">
          <InputText
            name="name"
            v-model="formInputs.name"
            class="w-full"
            autocomplete="off"
            placeholder="Название ссылки"
          />
          <Message v-if="$form.name?.invalid" severity="error" variant="simple" size="small">
            {{ $form.name.error.message }}
          </Message>
        </div>
        <div class="mb-3">
          <InputText
            name="url"
            v-model="formInputs.url"
            class="w-full"
            autocomplete="off"
            placeholder="Ссылка"
          />
          <Message v-if="$form.url?.invalid" severity="error" variant="simple" size="small">
            {{ $form.url.error.message }}
          </Message>
        </div>
        <div class="mb-3">
          <Select
            v-model="formInputs.category"
            :options="listCategories"
            optionLabel="name"
            placeholder="Выберите категорию"
            class="w-full"
          />
        </div>
        <div class="mb-3">
          <Textarea
            v-model="formInputs.description"
            class="w-full resize-none"
            placeholder="Описание"
          />
        </div>
        <div class="mb-3 flex items-center gap-2">
          <Checkbox v-model="formInputs.isFavorite" inputId="isFavorite" binary />
          <label for="isFavorite">Добавить в избранное</label>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Добавить" :loading="isLoadingButton" type="submit" />
        </div>
      </template>
    </Form>
  </Dialog>
</template>
