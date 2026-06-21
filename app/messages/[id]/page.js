'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

export default function MessageThread() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [conv, setConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      fetchConv(session.user.id)
      fetchMessages()
    })
  }, [id])

  useEffect(() => {
    const channel = supabase.channel('messages-' + id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'conversation_id=eq.' + id }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConv = async (uid) => {
    const { data } = await supabase
      .from('conversations')
      .select('*, listings(id, title, images, price, status), buyer:profiles!conversations_buyer_id_fkey(id, name), seller:profiles!conversations_seller_id_fkey(id, name)')
      .eq('id', id)
      .single()
    if (!data || (data.buyer_id !== uid && data.seller_id !== uid)) { router.push('/messages'); return }
    setConv(data)
  }

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, profiles(name)')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    await supabase.from('messages').insert({ conversation_id: parseInt(id), sender_id: user.id, content: text.trim() })
    setText('')
    setSending(false)
  }

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  if (!conv) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  const other = user?.id === conv.buyer_id ? conv.seller : conv.buyer
  const img = conv.listings?.images?.split(',')[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1, padding: '0 20px' }}>

        {/* Header */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid #e5e5e5', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/messages" style={{ color: '#111', textDecoration: 'none', fontSize: '18px' }}>←</Link>
          {img && <img src={img} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />}
          <div>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>{other?.name}</div>
            <Link href={'/listings/' + conv.listings?.id} style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>
              {conv.listings?.title} · {conv.listings?.price?.toLocaleString('is-IS')} kr.
            </Link>
          </div>
          {conv.listings?.status === 'active' && user?.id === conv.buyer_id && (
            <Link href={'/checkout/' + conv.listings?.id} style={{ marginLeft: 'auto', background: '#2563eb', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '500', flexShrink: 0 }}>
              Kaupa
            </Link>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {messages.map(m => {
            const mine = m.sender_id === user?.id
            return (
              <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: mine ? '#111' : '#f0f0f0', color: mine ? '#fff' : '#111', fontSize: '14px', lineHeight: '1.5' }}>
                  {m.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 0 20px', borderTop: '1px solid #e5e5e5', display: 'flex', gap: '8px' }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="Skrifaðu skilaboð... (Enter til að senda)"
            rows={1}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '24px', fontSize: '14px', outline: 'none', resize: 'none', lineHeight: '1.5' }}
          />
          <button onClick={send} disabled={sending || !text.trim()}
            style={{ padding: '10px 18px', background: text.trim() ? '#111' : '#e5e5e5', color: text.trim() ? '#fff' : '#999', border: 'none', borderRadius: '24px', fontSize: '14px', fontWeight: '500', cursor: text.trim() ? 'pointer' : 'default' }}>
            Senda
          </button>
        </div>
      </div>
    </div>
  )
}