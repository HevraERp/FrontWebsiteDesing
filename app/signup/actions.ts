'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  
   const  name = formData.get('username') as string;
   const  email=  formData.get('email') as string;
  const password=  formData.get('password') as string;
  

  const { error:SingUP } = await supabase.auth.signUp({ email, password })

  const { error } = await supabase
    .from('clients')
    .insert([
      { username: name, email: email, password:password }
    ])

   
    if (error) {
      return { error:'This email already exists, please log in' }
    }
  
    return { success: true }
  }