'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      router.push('/?search=' + encodeURIComponent(e.target.value.trim()))
    }
  }

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e5e5',
      padding: '0 24px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link href="/" style={{ fontWeight: '700', fontSize: '20px', color: '#111', textDecoration: 'none', letterSpacing: '-0.5px', flexShrink: 0 }}>
        Torg
      </Link>

      <input
        ref={searchRef}
        type="text"
        placeholder="Leita að vöru..."
        onKeyDown={handleSearch}
        style={{ flex: 1, maxWidth: '480px', padding: '8px 14px', fontSize: '14px', border: '1px solid #e5e5e5', borderRadius: '20px', outline: 'none', background: '#fafafa' }}
      />

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: 'auto', flexShrink: 0 }}>
        {user ? (
          <>
            <Link
              href="/listings/new"
              style={{
                background: '#111',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Selja
            </Link>
            <Link
              href={`/profile/${user.id}`}
              style={{
                fontSize: '14px',
                color: '#111',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                fontWeight: '500'
              }}
            >
              Mín síða
            </Link>
            <Link href="/messages" style={{ fontSize: '14px', color: '#111', textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e5e5', fontWeight: '500' }}>
              Skilaboð
            </Link>
            <button
              onClick={signOut}
              style={{
                fontSize: '14px',
                color: '#999',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 4px'
              }}
            >
              Útskrá
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth"
              style={{
                fontSize: '14px',
                color: '#111',
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e5e5',
                fontWeight: '500'
              }}
            >
              Innskrá
            </Link>
            <Link
              href="/auth"
              style={{
                background: '#111',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Selja
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
