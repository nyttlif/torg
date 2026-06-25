'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Navbar from '../../components/Navbar'

function ErrorContent() {
  const router = useRouter()
  const params = useSearchParams()
  const desc = params.get('errordescription')
  const code = params.get('errorcode')

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Villa við greiðslu</h1>
        {desc && <p style={{ color: '#666', marginBottom: '8px' }}>{desc}</p>}
        {code && <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '24px' }}>Villukóði: {code}</p>}
        <button onClick={() => router.back()}
          style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          Reyna aftur
        </button>
      </div>
    </div>
  )
}

export default function PaymentError() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  )
}