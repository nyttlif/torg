'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setError('')
    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false) }
      else { onSuccess?.(); onClose() }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (data.user) await supabase.from('profiles').insert({ id: data.user.id, name })
      onSuccess?.(); onClose()
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: '15px',
    border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fafafa',
    boxSizing: 'border-box'
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      {/* Modal */}
      <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', margin: '0 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>✕</button>

        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
          {mode === 'login' ? 'Skrá inn' : 'Stofna aðgang'}
        </h2>

        {mode === 'signup' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Nafn</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Netfang</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Lykilorð</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} onKeyDown={e => e.key === 'Enter' && handle()} />
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>
            {error.toLowerCase().includes('email') || error.toLowerCase().includes('phone') ? 'Netfang vantar' : error}
          </div>
        )}

        <button onClick={handle} disabled={loading}
          style={{ width: '100%', background: '#111', color: '#fff', padding: '13px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          {loading ? 'Augnablik...' : mode === 'login' ? 'Skrá inn' : 'Búa til aðgang'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {mode === 'login' ? 'Áttu ekki aðgang?' : 'Ertu þegar með aðgang?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            style={{ color: '#111', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {mode === 'login' ? 'Stofna aðgang' : 'Skrá inn'}
          </button>
        </p>
      </div>
    </div>
  )
}

// Keep the page route working too for direct navigation
export default function AuthPage() {
  const router = useRouter()
  return (
    <AuthModal onClose={() => router.back()} onSuccess={() => router.push('/')} />
  )
}