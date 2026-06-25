import { redirect } from 'next/navigation'

export async function POST(request) {
  return redirect('/payment/cancel')
}