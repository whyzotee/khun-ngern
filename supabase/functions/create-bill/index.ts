import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface BillItem {
  name: string
  amount: number
}

interface CreateBillRequest {
  title: string
  total_amount: number
  creator_id: string
  split_type?: 'equal' | 'each'
  members?: Array<{
    line_user_id: string
    display_name: string
  }>
  items: BillItem[]
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Manual Token Check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { title, total_amount, creator_id, members = [], items }: CreateBillRequest = await req.json()

    await supabaseClient
      .from('users')
      .upsert(
        {
          line_user_id: creator_id,
          display_name: 'Bill creator',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'line_user_id', ignoreDuplicates: true }
      )
      .throwOnError()

    // 1. Insert into bills table
    const { data: bill, error: billError } = await supabaseClient
      .from('bills')
      .insert({
        title,
        total_amount,
        creator_id,
        status: 'pending'
      })
      .select()
      .single()

    if (billError) throw billError

    // 2. Insert items
    const itemsToInsert = items.map(item => ({
      bill_id: bill.id,
      name: item.name,
      amount: item.amount
    }))

    const { error: itemsError } = await supabaseClient
      .from('bill_items')
      .insert(itemsToInsert)

    if (itemsError) throw itemsError

    if (members.length > 0) {
      const amountOwed = Math.ceil(total_amount / members.length)
      const participantsToInsert = members.map(member => ({
        bill_id: bill.id,
        user_id: null,
        display_name: member.display_name,
        amount_owed: amountOwed,
      }))

      const { error: participantsError } = await supabaseClient
        .from('bill_participants')
        .insert(participantsToInsert)

      if (participantsError) throw participantsError
    }

    return new Response(
      JSON.stringify({ message: 'Bill created successfully', bill_id: bill.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
