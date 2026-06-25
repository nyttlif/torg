import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(request) {
  try {
    const { orderId, amount, buyerName, buyerEmail } = await request.json()

    const merchantId = process.env.BORGUN_MERCHANT_ID
    const gatewayId = process.env.BORGUN_GATEWAY_ID
    const secretKey = process.env.BORGUN_SECRET_KEY

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://torget.is').replace(/\/$/, '')
    const returnUrlSuccess = `${baseUrl}/api/payment/success`
    const returnUrlSuccessServer = `${baseUrl}/api/borgun/confirm`
    const returnUrlCancel = `${baseUrl}/api/payment/cancel`
    const returnUrlError = `${baseUrl}/api/payment/error`

    // Borgun orderid: max 12 alphanumeric chars, no special chars
    // Use a short prefix + padded id
    const borgunOrderId = ('T' + String(orderId).padStart(11, '0')).slice(0, 12)

    // Amount as integer string (ISK has no decimals)
    const amountStr = String(Math.round(amount))

    // CheckHash: MerchantId|ReturnUrlSuccess|ReturnUrlSuccessServer|OrderId|Amount|Currency
    const message = `${merchantId}|${returnUrlSuccess}|${returnUrlSuccessServer}|${borgunOrderId}|${amountStr}|ISK`
    const checkhash = createHmac('sha256', secretKey).update(message, 'utf8').digest('hex')

    console.log('BORGUN_MESSAGE:', message)
    console.log('BORGUN_HASH:', checkhash)
    console.log('BORGUN_MERCHANT_ID:', merchantId)

    return NextResponse.json({
      merchantid: merchantId,
      paymentgatewayid: gatewayId,
      orderid: borgunOrderId,
      checkhash,
      amount: amountStr,
      currency: 'ISK',
      language: 'IS',
      buyername: buyerName || '',
      buyeremail: buyerEmail || '',
      returnurlsuccess: returnUrlSuccess,
      returnurlsuccessserver: returnUrlSuccessServer,
      returnurlcancel: returnUrlCancel,
      returnurlerror: returnUrlError,
      skipreceiptpage: '1',
    })
  } catch (err) {
    console.error('Borgun pay error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}