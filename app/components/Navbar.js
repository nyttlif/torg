'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [search, setSearch] = useState('')
  const [unread, setUnread] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchUnread(session.user.id)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        fetchUnread(session.user.id)
      } else {
        setProfile(null)
        setUnread(0)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    const channel = supabase.channel('unread-' + user.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchUnread(user.id)
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('name, avatar_url').eq('id', uid).single()
    setProfile(data)
  }

  const fetchUnread = async (uid) => {
    const { data: convs } = await supabase.from('conversations').select('id').or('buyer_id.eq.' + uid + ',seller_id.eq.' + uid)
    if (!convs?.length) return
    const convIds = convs.map(c => c.id)
    const { count } = await supabase.from('messages').select('id', { count: 'exact', head: true }).in('conversation_id', convIds).eq('read', false).neq('sender_id', uid)
    setUnread(count || 0)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push('/?search=' + encodeURIComponent(search.trim()))
    else router.push('/')
  }

  const avatarInitial = profile?.name?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 100 }}>

        {/* Logo */}
        <Link href="/" style={{ fontWeight: '700', fontSize: '20px', color: '#111', textDecoration: 'none', letterSpacing: '-0.5px', flexShrink: 0 }}>
          Torg
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '540px', display: 'flex', gap: '0' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Leita að vöru..."
            style={{
              flex: 1,
              padding: '8px 16px',
              fontSize: '14px',
              border: '1px solid #e5e5e5',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              background: '#f5f5f5',
              outline: 'none',
              color: '#111',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0 14px',
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* Right */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto', flexShrink: 0 }} className="desktop-nav">
          {user ? (
            <>
              <Link href="/listings/new"
                style={{ background: '#111', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Selja
              </Link>

              <Link href="/bookmarks" title="Vistaðar vörur"
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #e5e5e5', textDecoration: 'none', fontSize: '16px', color: '#111' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </Link>

              <Link href="/messages" title="Skilaboð" style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #e5e5e5', textDecoration: 'none', fontSize: '16px', color: '#111' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unread > 0 && (
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 5px', fontSize: '10px', fontWeight: '700', minWidth: '16px', textAlign: 'center', lineHeight: '14px' }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>

              <Link href={'/profile/' + user.id} title="Mín síða"
                style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e5e5', textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0' }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>{avatarInitial}</span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth"
                style={{ fontSize: '14px', color: '#111', textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e5e5', fontWeight: '500' }}>
                Innskrá
              </Link>
              <Link href="/auth"
                style={{ background: '#111', color: '#fff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Selja
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
          style={{ display: 'none', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', padding: '4px', marginLeft: 'auto', flexShrink: 0 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" style={{ display: 'none', position: 'fixed', top: '56px', left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 99, padding: '20px', flexDirection: 'column', gap: '10px', borderTop: '1px solid #e5e5e5', overflowY: 'auto' }}>
          {user ? (
            <>
              <Link href={'/profile/' + user?.id} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e5e5e5', borderRadius: '10px', textDecoration: 'none', color: '#111', marginBottom: '4px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e0e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '16px', flexShrink: 0 }}>
                  {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatarInitial}
                </div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{profile?.name || 'Mín síða'}</div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Skoða prófíl</div>
                </div>
              </Link>
              <Link href="/listings/new" onClick={() => setMenuOpen(false)} style={{ display: 'block', background: '#111', color: '#fff', padding: '14px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', textAlign: 'center' }}>+ Selja vöru</Link>
              <Link href="/messages" onClick={() => setMenuOpen(false)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', textDecoration: 'none', color: '#111', fontSize: '15px' }}>
                Skilaboð
                {unread > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 8px', fontSize: '12px', fontWeight: '700' }}>{unread}</span>}
              </Link>
              <Link href="/bookmarks" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', textDecoration: 'none', color: '#111', fontSize: '15px' }}>♡ Vistaðar vörur</Link>
              <button onClick={signOut} style={{ padding: '14px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff', color: '#666', fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>Útskrá</button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setMenuOpen(false)} style={{ display: 'block', background: '#111', color: '#fff', padding: '14px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', textAlign: 'center' }}>Innskrá / Nýskrá</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </>
  )
}