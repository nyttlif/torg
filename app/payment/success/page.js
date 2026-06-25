'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [convId, setConvId] = useState(null)
  const orderId = searchParams.get('orderid')

  useEffect(() => {
    if (!orderId) return
    const numericId = orderId.replace('TRG', '')
    supabase.from('orders').select('conversation_id').eq('id', numericId).single()
      .then(({ data }) => { if (data?.conversation_id) setConvId(data.conversation_id) })
  }, [orderId])

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Greiðsla tókst!</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Pöntun þín hefur verið staðfest. Seljandi mun sjá um sendinguna fljótlega.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {convId && (
            <button onClick={() => router.push('/messages/' + convId)}
              style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
              Opna samtal
            </button>
          )}
          <button onClick={() => router.push('/')}
            style={{ background: '#fff', color: '#111', padding: '12px 24px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
            Til baka á forsíðu
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div>}>
      <SuccessContent />
    </Suspense>
  )
}