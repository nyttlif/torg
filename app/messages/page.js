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
    const { data } = await supabase
      .from('conversations')
      .select('*, listings(id, title, images, price), buyer:profiles!conversations_buyer_id_fkey(id, name), seller:profiles!conversations_seller_id_fkey(id, name)')
      .or('buyer_id.eq.' + uid + ',seller_id.eq.' + uid)
      .order('created_at', { ascending: false })
    setConversations(data || [])
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
              return (
                <Link key={conv.id} href={'/messages/' + conv.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', gap: '14px', padding: '16px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', alignItems: 'center' }}>
                    {img ? <img src={img} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} /> : <div style={{ width: '56px', height: '56px', background: '#f0f0f0', borderRadius: '6px', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.listings?.title}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{other?.name} · {conv.listings?.price?.toLocaleString('is-IS')} kr.</div>
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