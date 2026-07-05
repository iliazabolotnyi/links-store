import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase.js'

export const useUserStore = defineStore('auth', () => {
  const user = ref(null)

  async function getUser() {
    const { data } = await supabase.auth.getUser()

    user.value = data?.user || null
  }

  return { user, getUser }
})