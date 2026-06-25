import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const formData = await request.formData()
    const status = formData.get('status')
    const orderId = formData.get('orderid')
    const orderhash = formData.get('orderhash')
    const amount = formData.get('amount')
    const authorizationcode = formData.get('authorizationcode')
    const step = formData.get('step')

    // Only process on Payment step (server-to-server notification)
    if (step !== 'Payment') {
      return new NextResponse('<PaymentNotification>Accepted</PaymentNotification>', {
        headers: { 'Content-Type': 'application/xml' }
      })
    }

    if (status !== 'Ok') {
      return new NextResponse('<PaymentNotification>Accepted</PaymentNotification>', {
        headers: { 'Content-Type': 'application/xml' }
      })
    }

    // Verify orderhash: HMAC_SHA256(OrderId|Amount|Currency, SecretKey)
    const secretKey = process.env.BORGUN_SECRET_KEY
    const expectedHash = createHmac('sha256', secretKey)
      .update(`${orderId}|${amount}|ISK`)
      .digest('hex')

    if (expectedHash.toLowerCase() !== orderhash?.toLowerCase()) {
      console.error('Borgun orderhash mismatch')
      return new NextResponse('<PaymentNotification>Accepted</PaymentNotification>', {
        headers: { 'Content-Type': 'application/xml' }
      })
    }

    // Find order by borgun order id (TRG + our id)
    const numericId = orderId.replace('TRG', '')
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_authorization: authorizationcode,
        paid_at: new Date().toISOString()
      })
      .eq('id', numericId)

    return new NextResponse('<PaymentNotification>Accepted</PaymentNotification>', {
      headers: { 'Content-Type': 'application/xml' }
    })
  } catch (err) {
    console.error('Borgun confirm error:', err)
    return new NextResponse('<PaymentNotification>Accepted</PaymentNotification>', {
      headers: { 'Content-Type': 'application/xml' }
    })
  }
}