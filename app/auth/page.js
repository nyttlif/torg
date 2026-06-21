'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handle = async () => {
    setError('')
    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, name })
      }
      router.push('/')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    fontSize: '15px',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    outline: 'none',
    background: '#fafafa'
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '400px', margin: '60px auto', padding: '0 16px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
            {mode === 'login' ? 'Innskrá' : 'Nýskrá'}
          </h1>

          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Nafn</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jón Jónsson" style={inputStyle} />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Netfang</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jon@example.is" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Lykilorð</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <button
            onClick={handle}
            disabled={loading}
            style={{ width: '100%', background: '#111', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
          >
            {loading ? 'Augnablik...' : mode === 'login' ? 'Innskrá' : 'Búa til aðgang'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
            {mode === 'login' ? 'Ekki með aðgang?' : 'Ertu þegar með aðgang?'}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ color: '#111', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              {mode === 'login' ? 'Nýskrá' : 'Innskrá'}
            </button>
          </p>
        </div>
      </main>
    </>
  )
}
