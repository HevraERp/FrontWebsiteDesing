'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()


  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  

    const { data: user } = await supabase
    .from('clients')
    .select('email')
    .eq('email', email)
    .single();

  if (!user) {
    return { error: "You don't have an account" };
  }



  const { error } = await supabase.auth.signInWithPassword({ email, password });

  
  if (error) {
    return { error:'please check your password and email' }
  }

  return { success: true }
}