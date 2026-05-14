import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SaveAccountRequest {
  user_id: string
  display_name?: string
  picture_url?: string
  name: string
  account_type: 'bank' | 'promptpay'
  bank_name?: string | null
  account_id: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: SaveAccountRequest = await req.json()

    if (!payload.user_id || !payload.name || !payload.account_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await supabaseClient
      .from('users')
      .upsert(
        {
          line_user_id: payload.user_id,
          display_name: payload.display_name || payload.name,
          picture_url: payload.picture_url || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'line_user_id' }
      )
      .throwOnError()

    const { data, error } = await supabaseClient
      .from('user_accounts')
      .upsert(
        {
          user_id: payload.user_id,
          name: payload.name,
          account_type: payload.account_type,
          bank_name: payload.account_type === 'bank' ? payload.bank_name : null,
          account_id: payload.account_id,
          is_default: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ account: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
