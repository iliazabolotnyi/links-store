<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { useToastNotifications } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'
const rules = z.object({
  firstname: z.string().min(1, { message: 'Имя обязательно для заполнения' }),
  email: z.string().email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})

const resolver = ref(zodResolver(rules))
const { showToast } = useToastNotifications()
const { signUp, signInWithGithub, loading, errorMessage } = useAuth()
const submitForm = async ({ valid }) => {
  if (!valid) return

  try {
    await signUp({
      email: formData.value.email,
      password: formData.value.password,
      firstname: formData.value.firstname,
    })
  } catch {
    showToast('error', 'Ошибка регистрации', errorMessage.value)
  }
}

const formData = ref({
  email: '',
  password: '',
  firstname: '',
})
</script>

<template>
  <Toast />
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
    <div class="mb-3">
      <InputText
        name="firstname"
        placeholder="Введите свое имя"
        type="text"
        v-model="formData.firstname"
        class="w-full"
      />
      <Message v-if="$form.firstname?.invalid" severity="error" variant="simple" size="small">
        {{ $form.firstname.error.message }}
      </Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" :loading="loading" />
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
