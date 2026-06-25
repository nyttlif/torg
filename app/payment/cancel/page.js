'use client'

import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function PaymentCancel() {
  const router = useRouter()
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Greiðslu hætt við</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Greiðslan var afturkölluð. Ekkert var tekið af kortinu þínu.</p>
        <button onClick={() => router.back()}
          style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          Reyna aftur
        </button>
      </div>
    </div>
  )
}