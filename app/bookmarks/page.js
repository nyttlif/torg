'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { supabase } from '@/lib/supabase'

export default function BookmarksPage() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      fetchBookmarks(session.user.id)
    })
  }, [])

  const fetchBookmarks = async (uid) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*, listings(*, profiles(name))')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setListings(data?.map(b => b.listings).filter(Boolean) || [])
    setLoading(false)
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Vistaðar vörur</h1>
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔖</div>
            <div style={{ marginBottom: '12px' }}>Engar vistaðar vörur</div>
            <Link href="/" style={{ fontSize: '14px', color: '#111', textDecoration: 'underline' }}>Skoða vörur</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {listings.map(l => (
              <Link key={l.id} href={'/listings/' + l.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                  <div style={{ aspectRatio: '3/4', background: '#f0f0f0' }}>
                    {l.images ? <img src={l.images.split(',')[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📦</div>}
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                    <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{l.price.toLocaleString('is-IS')} kr.</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{l.profiles?.name}{l.location && ' · ' + l.location}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}