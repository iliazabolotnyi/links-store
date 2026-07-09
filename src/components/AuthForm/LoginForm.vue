<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useUserStore } from '@/stores/useStore.js'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import { useAuth } from '@/composables/useAuth'
import { useToastNofitications } from '@/composables/useToastNotifications'
import { useRouter } from 'vue-router'

const { showToast } = useToastNofitications()
const { signIn, signInWithGithub, loading, errorMessage } = useAuth()

const formData = ref({
  email: '',
  password: '',
})
const emits = defineEmits(['resetPassword'])
const rules = z.object({
  email: z.string().email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})
const authStore = useUserStore()

const resolver = ref(zodResolver(rules))

const router = useRouter()

const submitForm = async ({ valid }) => {
  if (!valid) return

  try {
    await signIn({
      email: formData.value.email,
      password: formData.value.password,
    })
    debugger
    await authStore.getUser()
    await router.push('/')
  } catch {
    showToast('error', 'Ошибка входа', errorMessage.value)
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitForm"
  >
    <div class="mb-3">
      <InputText
        name="email"
        placeholder="Введите email"
        type="text"
        v-model="formData.email"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple" size="small">
        {{ $form.email.error.message }}
      </Message>
    </div>
    <div class="mb-3">
      <InputText
        name="password"
        placeholder="Введите пароль"
        type="password"
        v-model="formData.password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" variant="simple" size="small">
        {{ $form.password.error.message }}
      </Message>
    </div>
    <span class="cursor-pointer mb-3 block" @click="emits('resetPassword')">Забыли пароль?</span>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Вход" :loading="loading" />
      <Button
        icon="pi pi-github"
        class="w-full"
        label="GitHub"
        severity="contrast"
        @click="signInWithGithub"
      />
    </div>
  </Form>
</template>
