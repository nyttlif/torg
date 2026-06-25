import { redirect } from 'next/navigation'

export async function POST(request) {
  const formData = await request.formData()
  const orderid = formData.get('orderid') || ''
  return redirect(`/payment/success?orderid=${encodeURIComponent(orderid)}`)
}