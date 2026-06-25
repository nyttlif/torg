import { redirect } from 'next/navigation'

export async function POST(request) {
  const formData = await request.formData()
  const desc = formData.get('errordescription') || 'Unknown error'
  const code = formData.get('errorcode') || ''
  return redirect(`/payment/error?errordescription=${encodeURIComponent(desc)}&errorcode=${encodeURIComponent(code)}`)
}