import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { orderId } = await request.json()

    // Fetch order with shipping info
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, listings(title, weight_class)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const shipping = order.shipping_address
    const apiKey = process.env.DROPP_API_KEY
    const storeId = process.env.DROPP_STORE_ID

    // Get a barcode if we don't have one yet
    let barcode = order.dropp_barcode
    if (!barcode) {
      const bcRes = await fetch('https://api.dropp.is/dropp/api/v1/orders/barcode/', {
        headers: { 'Authorization': 'Basic ' + apiKey }
      })
      const bcData = await bcRes.json()
      barcode = bcData.barcode

      // Save barcode to order
      await supabase.from('orders').update({ dropp_barcode: barcode }).eq('id', orderId)
    }

    // Create order in Dropp if not already created
    if (!order.dropp_order_id) {
      const body = {
        locationId: shipping.locationId || '9ec1f30c-2564-4b73-8954-25b7b3186ed3', // home delivery fallback
        barcode,
        value: order.amount,
        products: [{ name: order.listings?.title || 'Vara', barcode }],
        customer: {
          name: shipping.name,
          phoneNumber: shipping.phone,
          emailAddress: shipping.email || '',
          address: shipping.address || '',
          zipcode: parseInt(shipping.zipcode) || 101,
          town: shipping.city || 'Reykjavík'
        }
      }

      if (shipping.type === 'dropp') {
        body.locationId = shipping.locationId
      }

      const orderRes = await fetch('https://api.dropp.is/dropp/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + apiKey,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(body)
      })

      const orderData = await orderRes.json()
      if (orderData.id) {
        await supabase.from('orders').update({ dropp_order_id: orderData.id }).eq('id', orderId)
        order.dropp_order_id = orderData.id
      }
    }

    // Get PDF label
    const pdfRes = await fetch(`https://api.dropp.is/dropp/api/v1/orders/pdf/${order.dropp_order_id}`, {
      headers: { 'Authorization': 'Basic ' + apiKey }
    })

    if (!pdfRes.ok) {
      return NextResponse.json({ error: 'Failed to get PDF' }, { status: 500 })
    }

    const pdfBuffer = await pdfRes.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    const pdfUrl = `data:application/pdf;base64,${pdfBase64}`

    return NextResponse.json({ pdfUrl, barcode })
  } catch (err) {
    console.error('Dropp label error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}