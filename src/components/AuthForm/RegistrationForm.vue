<script setup>
  import { ref } from 'vue'
  import Button from 'primevue/button'
  import InputText from 'primevue/inputtext'
  import { z } from 'zod'
  import { zodResolver } from '@primevue/forms/resolvers/zod'
  import { Form } from '@primevue/forms'
  import Message from 'primevue/message'
  import { useToastNotifications } from '@/composables/useToastNotifications.js'
  import { useAuth } from '@/composables/useAuth.js'
  import { useUserStore } from '@/stores/useStore.js'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const rules = z.object({
    firstname: z.string().min(1, { message: 'Имя обязательно для заполнения' }),
    email: z.string().email({ message: 'Некорректный email' }),
    password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
  })

  const resolver = ref(zodResolver(rules))
  const { showToast } = useToastNotifications()
  const { signUp, signInWithGithub, loading, errorMessage } = useAuth()
  const authStore = useUserStore()
  const submitForm = async ({ valid }) => {
    if (!valid) return

    try {
      await signUp({
        email: formData.value.email,
        password: formData.value.password,
        firstname: formData.value.firstname,
      })
      await authStore.getUser()
      await router.push('/')
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
      />
    </div>
  </Form>
</template>
