'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return 'Rétt í þessu'
  if (diff < 3600) return Math.floor(diff / 60) + ' mín síðan'
  if (diff < 86400) return Math.floor(diff / 3600) + ' klst síðan'
  if (diff < 86400 * 7) return Math.floor(diff / 86400) + ' dögum síðan'
  if (diff < 86400 * 30) return Math.floor(diff / 86400 / 7) + ' vikum síðan'
  if (diff < 86400 * 365) return Math.floor(diff / 86400 / 30) + ' mánuðum síðan'
  return Math.floor(diff / 86400 / 365) + ' árum síðan'
}

export default function ProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [tab, setTab] = useState('active')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    fetchProfile()
    fetchListings()
  }, [id])

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    setProfile(data)
    setLoading(false)
  }

  const fetchListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
    setListings(data || [])
  }

  const isOwn = user?.id === id
  const activeListings = listings.filter(l => l.status === 'active')
  const reservedListings = listings.filter(l => l.status === 'reserved')
  const soldListings = listings.filter(l => l.status === 'sold')
  const shown = tab === 'active' ? activeListings : tab === 'reserved' ? reservedListings : soldListings

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>
  if (!profile) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Notandi fannst ekki</div></>

  const hasRating = profile.rating_count > 0

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e0e0e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '30px', flexShrink: 0 }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : profile.name?.[0]?.toUpperCase()
            }
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '6px' }}>{profile.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {hasRating ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f5f5', borderRadius: '20px', padding: '3px 10px' }}>
                    <span style={{ fontSize: '13px' }}>★</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{profile.rating.toFixed(1)}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#888' }}>{profile.rating_count} umsagnir</span>
                  <span style={{ fontSize: '13px', color: '#ccc' }}>·</span>
                </>
              ) : (
                <span style={{ fontSize: '13px', color: '#aaa' }}>Engar umsagnir ·</span>
              )}
              <span style={{ fontSize: '13px', color: '#888' }}>{activeListings.length} virkar auglýsingar</span>
            </div>

            {profile.bio && <p style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>{profile.bio}</p>}
          </div>
          {isOwn && (
            <Link href="/profile/edit" style={{ padding: '8px 16px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', color: '#111', flexShrink: 0 }}>
              Breyta prófíl
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid #e5e5e5' }}>
          {[
            { key: 'active', label: 'Til sölu', count: activeListings.length },
            ...(isOwn && reservedListings.length > 0 ? [{ key: 'reserved', label: 'Frátekið', count: reservedListings.length }] : []),
            { key: 'sold', label: 'Selt', count: soldListings.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: tab === t.key ? '2px solid #111' : '2px solid transparent', fontSize: '14px', fontWeight: tab === t.key ? '600' : '400', cursor: 'pointer', color: tab === t.key ? '#111' : '#888', marginBottom: '-1px', display: 'flex', gap: '6px', alignItems: 'center' }}>
              {t.label}
              <span style={{ background: tab === t.key ? '#111' : '#f0f0f0', color: tab === t.key ? '#fff' : '#888', borderRadius: '10px', padding: '1px 7px', fontSize: '11px' }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            {isOwn && tab === 'active' ? (
              <>
                <p style={{ marginBottom: '16px' }}>Þú hefur ekki birt neinar auglýsingar ennþá</p>
                <Link href="/listings/new" style={{ background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>+ Selja vöru</Link>
              </>
            ) : tab === 'active' ? 'Engar virkar auglýsingar' : 'Engar seldar vörur'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
            {shown.map(l => (
              <Link key={l.id} href={'/listings/' + l.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                  <div style={{ aspectRatio: '3/4', background: '#f0f0f0' }}>
                    {l.images
                      ? <img src={l.images.split(',')[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>📦</div>
                    }
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontWeight: '500', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                    <div style={{ fontWeight: '700', fontSize: '15px', marginTop: '2px' }}>{l.price.toLocaleString('is-IS')} kr.</div>
                    <div style={{ fontSize: '11px', color: '#bbb', marginTop: '3px' }}>{timeAgo(l.created_at)}</div>
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