import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(request) {
  try {
    const { orderId, amount, buyerName, buyerEmail } = await request.json()

    const merchantId = process.env.BORGUN_MERCHANT_ID
    const gatewayId = process.env.BORGUN_GATEWAY_ID
    const secretKey = process.env.BORGUN_SECRET_KEY

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://torget.is'
    const returnUrlSuccess = `${baseUrl}/api/payment/success`
    const returnUrlSuccessServer = `${baseUrl}/api/borgun/confirm`
    const returnUrlCancel = `${baseUrl}/api/payment/cancel`
    const returnUrlError = `${baseUrl}/api/payment/error`

    // Borgun orderid max 12 alphanumeric chars
    const borgunOrderId = ('TRG' + orderId).slice(0, 12).replace(/[^a-zA-Z0-9]/g, '')

    // Amount must be formatted as integer (ISK has no cents)
    const amountStr = String(Math.round(amount))

    // CheckHash: MerchantId|ReturnUrlSuccess|ReturnUrlSuccessServer|OrderId|Amount|Currency
    const message = `${merchantId}|${returnUrlSuccess}|${returnUrlSuccessServer}|${borgunOrderId}|${amountStr}|ISK`
    const checkhash = createHmac('sha256', secretKey).update(message).digest('hex')

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
      merchantlogo: `${baseUrl}/favicon.svg`,
    })
  } catch (err) {
    console.error('Borgun pay error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}