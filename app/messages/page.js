'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { supabase } from '@/lib/supabase'

export default function InboxPage() {
  const [user, setUser] = useState(null)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      fetchConversations(session.user.id)
    })
  }, [])

  const fetchConversations = async (uid) => {
    const { data: convs, error } = await supabase
      .from('conversations')
      .select('*, listings(id, title, images, price)')
      .or('buyer_id.eq.' + uid + ',seller_id.eq.' + uid)
      .order('created_at', { ascending: false })

    if (error || !convs) { setLoading(false); return }

    // Collect all unique profile IDs needed
    const profileIds = [...new Set(convs.flatMap(c => [c.buyer_id, c.seller_id]).filter(Boolean))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', profileIds)

    const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))

    const enriched = convs.map(c => ({
      ...c,
      buyer: profileMap[c.buyer_id] || null,
      seller: profileMap[c.seller_id] || null,
    }))

    setConversations(enriched)
    setLoading(false)
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>Skilaboð</h1>
        {conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Engin skilaboð ennþá</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {conversations.map(conv => {
              const isbuyer = user?.id === conv.buyer_id
              const other = isbuyer ? conv.seller : conv.buyer
              const img = conv.listings?.images?.split(',')[0]
              const avatarInitial = other?.name?.[0]?.toUpperCase() || '?'

              return (
                <Link key={conv.id} href={'/messages/' + conv.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', gap: '14px', padding: '16px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', alignItems: 'center' }}>

                    {img
                      ? <img src={img} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      : <div style={{ width: '56px', height: '56px', background: '#f0f0f0', borderRadius: '6px', flexShrink: 0 }} />
                    }

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.listings?.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', color: '#555', flexShrink: 0 }}>
                          {other?.avatar_url
                            ? <img src={other.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : avatarInitial
                          }
                        </div>
                        <span style={{ fontSize: '12px', color: '#888' }}>{other?.name} · {conv.listings?.price?.toLocaleString('is-IS')} kr.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>→</div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}