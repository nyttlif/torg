'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [search, setSearch] = useState('')
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const notifRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) { fetchProfile(session.user.id); fetchUnreadMessages(session.user.id); fetchNotifications(session.user.id) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) { fetchProfile(session.user.id); fetchUnreadMessages(session.user.id); fetchNotifications(session.user.id) }
      else { setProfile(null); setUnreadMessages(0); setNotifications([]); setUnreadNotifs(0) }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!user) return
    const ch = supabase.channel('msgs-' + user.id).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchUnreadMessages(user.id)).subscribe()
    const ch2 = supabase.channel('notifs-' + user.id).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'user_id=eq.' + user.id }, payload => { setNotifications(prev => [payload.new, ...prev]); setUnreadNotifs(prev => prev + 1) }).subscribe()
    return () => { supabase.removeChannel(ch); supabase.removeChannel(ch2) }
  }, [user])

  const fetchProfile = async (uid) => { const { data } = await supabase.from('profiles').select('name, avatar_url').eq('id', uid).single(); setProfile(data) }

  const fetchUnreadMessages = async (uid) => {
    const { data: convs } = await supabase.from('conversations').select('id').or('buyer_id.eq.' + uid + ',seller_id.eq.' + uid)
    if (!convs?.length) return
    const { count } = await supabase.from('messages').select('id', { count: 'exact', head: true }).in('conversation_id', convs.map(c => c.id)).eq('read', false).neq('sender_id', uid)
    setUnreadMessages(count || 0)
  }

  const fetchNotifications = async (uid) => {
    const { data } = await supabase.from('notifications').select('*, from_profile:profiles!notifications_from_user_id_fkey(name, avatar_url), listings(title)').eq('user_id', uid).order('created_at', { ascending: false }).limit(20)
    setNotifications(data || [])
    setUnreadNotifs((data || []).filter(n => !n.read).length)
  }

  const markNotifsRead = async () => {
    if (!user || unreadNotifs === 0) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadNotifs(0)
  }

  const toggleNotif = () => { setNotifOpen(prev => !prev); if (!notifOpen) markNotifsRead() }

  const signOut = async () => { await supabase.auth.signOut(); router.push('/'); setMenuOpen(false) }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push('/?search=' + encodeURIComponent(search.trim()))
    else router.push('/')
  }

  const notifLabel = (n) => {
    const name = n.from_profile?.name || 'Einhver'
    const title = n.listings?.title
    if (n.type === 'message') return name + ' sendi þér skilaboð' + (title ? ' um ' + title : '')
    if (n.type === 'offer') return name + ' sendi tilboð' + (title ? ' á ' + title : '')
    if (n.type === 'like') return name + ' vistaði' + (title ? ' ' + title : ' vöru þína')
    return name + ' gerði eitthvað'
  }

  const notifLink = (n) => {
    if (n.type === 'message' || n.type === 'offer') return '/messages'
    if (n.type === 'like' && n.listing_id) return '/listings/' + n.listing_id
    return '/'
  }

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
    if (diff < 60) return 'Rétt í þessu'
    if (diff < 3600) return Math.floor(diff / 60) + ' mín'
    if (diff < 86400) return Math.floor(diff / 3600) + ' klst'
    return Math.floor(diff / 86400) + ' d'
  }

  const avatarInitial = profile?.name?.[0]?.toUpperCase() || '?'

  const iconBtn = { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', color: '#111', textDecoration: 'none', flexShrink: 0, position: 'relative' }

  const HeartIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  const MailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  const BellIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>

  const Badge = ({ count }) => count > 0 ? <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 5px', fontSize: '10px', fontWeight: '700', minWidth: '16px', textAlign: 'center', lineHeight: '14px' }}>{count > 9 ? '9+' : count}</span> : null

  return (
    <>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', gap: '10px', position: 'sticky', top: 0, zIndex: 100 }}>

        <Link href="/" style={{ fontWeight: '700', fontSize: '20px', color: '#111', textDecoration: 'none', letterSpacing: '-0.5px', flexShrink: 0 }}>
          Torget
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Leita að vöru..."
            style={{ flex: 1, padding: '8px 14px', fontSize: '14px', border: '1px solid #e5e5e5', borderRight: 'none', borderRadius: '8px 0 0 8px', background: '#f5f5f5', outline: 'none', color: '#111', minWidth: 0 }} />
          <button type="submit" style={{ padding: '0 12px', background: '#111', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </button>
        </form>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }} className="desktop-nav">
          {user ? (
            <>
              <Link href="/listings/new" style={{ background: '#111', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Selja
              </Link>
              <Link href="/bookmarks" style={iconBtn}><HeartIcon /></Link>
              <Link href="/messages" style={iconBtn}><MailIcon /><Badge count={unreadMessages} /></Link>
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={toggleNotif} style={{ ...iconBtn, border: '1px solid #e5e5e5' }}>
                  <BellIcon /><Badge count={unreadNotifs} />
                </button>
                {notifOpen && (
                  <div style={{ position: 'absolute', top: '44px', right: 0, width: '320px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '14px' }}>Tilkynningar</div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '32px 16px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>Engar tilkynningar</div>
                    ) : (
                      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        {notifications.map(n => (
                          <Link key={n.id} href={notifLink(n)} onClick={() => setNotifOpen(false)}
                            style={{ display: 'flex', gap: '10px', padding: '12px 16px', textDecoration: 'none', color: 'inherit', background: n.read ? '#fff' : '#fafafa', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', flexShrink: 0, overflow: 'hidden' }}>
                              {n.from_profile?.avatar_url ? <img src={n.from_profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : n.from_profile?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{notifLabel(n)}</div>
                              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{timeAgo(n.created_at)}</div>
                            </div>
                            {!n.read && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: '5px' }} />}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link href={'/profile/' + user.id} style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e5e5', textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0' }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>{avatarInitial}</span>}
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth" style={{ fontSize: '14px', color: '#111', textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e5e5', fontWeight: '500' }}>Innskrá</Link>
              <Link href="/auth" style={{ background: '#111', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>+ Selja</Link>
            </>
          )}
        </div>

        {/* Mobile icon row */}
        <div style={{ display: 'none', gap: '6px', alignItems: 'center', flexShrink: 0 }} className="mobile-icons">
          {user ? (
            <>
              <Link href="/bookmarks" style={iconBtn}><HeartIcon /></Link>
              <Link href="/messages" style={iconBtn}><MailIcon /><Badge count={unreadMessages} /></Link>
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button onClick={toggleNotif} style={{ ...iconBtn, border: '1px solid #e5e5e5' }}>
                  <BellIcon /><Badge count={unreadNotifs} />
                </button>
                {notifOpen && (
                  <div style={{ position: 'fixed', top: '56px', left: '8px', right: '8px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 200, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: '600', fontSize: '14px' }}>Tilkynningar</div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>Engar tilkynningar</div>
                    ) : (
                      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {notifications.map(n => (
                          <Link key={n.id} href={notifLink(n)} onClick={() => setNotifOpen(false)}
                            style={{ display: 'flex', gap: '10px', padding: '12px 16px', textDecoration: 'none', color: 'inherit', background: n.read ? '#fff' : '#fafafa', borderBottom: '1px solid #f5f5f5', alignItems: 'flex-start' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '12px', flexShrink: 0 }}>
                              {n.from_profile?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', lineHeight: '1.5' }}>{notifLabel(n)}</div>
                              <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{timeAgo(n.created_at)}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link href={'/profile/' + user.id} style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e5e5', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0e0e0', flexShrink: 0 }}>
                {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>{avatarInitial}</span>}
              </Link>
            </>
          ) : (
            <Link href="/auth" style={{ background: '#111', color: '#fff', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>Innskrá</Link>
          )}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-icons { display: flex !important; }
        }
      `}</style>
    </>
  )
}