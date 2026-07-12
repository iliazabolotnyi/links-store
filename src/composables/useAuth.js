import { supabase } from '@/supabase.js'
import { useRequest } from '@/composables/useRequest.js'

export function useAuth() {
  const { loading, errorMessage, handleRequest } = useRequest()
  const signUp = async ({ email, password, firstname }) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, firstname, email }]).select();

      if (insertError) {
        throw insertError
      }

      return data
    })
  }

  const signIn = async ({ email, password }) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    })
  }

  const signInWithGithub = async () => {
    await handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      })
      if (error) throw error
      return data
    })
  }

  const resetPassword = async (email) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://refkeeper.netlify.app/reset-password',
      })
      if (error) throw error
      return data
    })
  }

  const updatePassword = async (password) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      return data
    })
  }

  const signOut = async () => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signOut()
      if (error) throw error
      return data
    })
  }


  return { signUp, signIn, signInWithGithub, resetPassword, updatePassword, signOut, loading, errorMessage }
}
