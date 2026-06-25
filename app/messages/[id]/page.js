'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

function MessageThread() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [conv, setConv] = useState(null)
  const [listing, setListing] = useState(null)
  const [messages, setMessages] = useState([])
  const [offers, setOffers] = useState([])
  const [order, setOrder] = useState(null)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [counterAmount, setCounterAmount] = useState('')
  const [counteringId, setCounteringId] = useState(null)
  const [generatingLabel, setGeneratingLabel] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerSending, setOfferSending] = useState(false)
  const [convId, setConvId] = useState(id !== 'new' ? id : null)
  const bottomRef = useRef(null)

  const isNew = id === 'new'
  const listingIdFromUrl = searchParams?.get('listing')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      if (isNew && listingIdFromUrl) {
        fetchListingOnly(listingIdFromUrl)
      } else {
        fetchConv(session.user.id)
        fetchMessages(session.user.id)
        fetchOffers()
        fetchOrder()
      }
    })
  }, [id])

  useEffect(() => {
    if (!convId || isNew) return
    const channel = supabase.channel('messages-' + convId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'conversation_id=eq.' + convId }, payload => {
        setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'offers', filter: 'conversation_id=eq.' + convId }, payload => {
        setOffers(prev => [...prev, payload.new])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'offers', filter: 'conversation_id=eq.' + convId }, payload => {
        setOffers(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [convId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, offers])

  const fetchListingOnly = async (lid) => {
    const { data } = await supabase.from('listings').select('*, profiles!listings_user_id_fkey(id, name, avatar_url)').eq('id', lid).single()
    setListing(data)
  }

  const fetchConv = async (uid) => {
    const { data } = await supabase
      .from('conversations')
      .select('*, listings(id, title, images, price, status, weight_class), buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url), seller:profiles!conversations_seller_id_fkey(id, name, avatar_url)')
      .eq('id', id)
      .single()
    if (!data || (data.buyer_id !== uid && data.seller_id !== uid)) { router.push('/messages'); return }
    setConv(data)
    setListing(data.listings)
  }

  const fetchMessages = async (uid) => {
    const { data } = await supabase.from('messages').select('*, profiles(name)').eq('conversation_id', id).order('created_at', { ascending: true })
    setMessages(data || [])
    if (uid) {
      await supabase.from('messages').update({ read: true }).eq('conversation_id', parseInt(id)).neq('sender_id', uid).eq('read', false)
      window.dispatchEvent(new Event('messages-read'))
    }
  }

  const fetchOffers = async () => {
    const { data } = await supabase.from('offers').select('*').eq('conversation_id', id).order('created_at', { ascending: true })
    setOffers(data || [])
  }

  const fetchOrder = async () => {
    const { data } = await supabase.from('orders').select('*').eq('conversation_id', id).single()
    if (data) setOrder(data)
  }

  // Create conversation lazily on first message send
  const ensureConv = async () => {
    if (convId && !isNew) return convId
    const listingId = listingIdFromUrl || listing?.id
    const sellerId = listing?.user_id || listing?.profiles?.id
    const { data: ex } = await supabase.from('conversations').select('id').eq('listing_id', listingId).eq('buyer_id', user.id).single()
    if (ex) { setConvId(ex.id); return ex.id }
    const { data: newConv } = await supabase.from('conversations').insert({ listing_id: listingId, buyer_id: user.id, seller_id: sellerId }).select().single()
    setConvId(newConv.id)
    router.replace('/messages/' + newConv.id)
    return newConv.id
  }

  const send = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const content = text.trim()
    setText('')
    const cid = await ensureConv()
    const { data } = await supabase.from('messages').insert({ conversation_id: parseInt(cid), sender_id: user.id, content }).select('*, profiles(name)').single()
    if (data) setMessages(prev => [...prev, data])
    setSending(false)
  }

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const respondToOffer = async (offerId, status) => {
    await supabase.from('offers').update({ status }).eq('id', offerId)
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status } : o))
  }

  const sendCounter = async (offerId) => {
    if (!counterAmount) return
    await supabase.from('offers').update({ status: 'declined' }).eq('id', offerId)
    const cid = await ensureConv()
    const { data: newOffer } = await supabase.from('offers').insert({
      conversation_id: parseInt(cid),
      listing_id: listing?.id,
      buyer_id: conv?.buyer_id || user.id,
      seller_id: conv?.seller_id,
      amount: parseInt(counterAmount),
      status: 'pending'
    }).select().single()
    if (newOffer) setOffers(prev => [...prev.map(o => o.id === offerId ? { ...o, status: 'declined' } : o), newOffer])
    setCounteringId(null)
    setCounterAmount('')
  }

  const sendOfferFromChat = async () => {
    if (!offerAmount || parseInt(offerAmount) <= 0) return
    setOfferSending(true)
    const cid = await ensureConv()
    const { data: newOffer } = await supabase.from('offers').insert({
      conversation_id: parseInt(cid),
      listing_id: listing?.id || conv?.listings?.id,
      buyer_id: user.id,
      seller_id: conv?.seller_id || listing?.user_id,
      amount: parseInt(offerAmount),
      status: 'pending'
    }).select().single()
    if (newOffer) setOffers(prev => [...prev, newOffer])
    setOfferOpen(false)
    setOfferAmount('')
    setOfferSending(false)
  }

  const generateLabel = async () => {
    if (!order) return
    setGeneratingLabel(true)
    try {
      const res = await fetch('/api/dropp/label', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id }) })
      const { pdfUrl } = await res.json()
      if (pdfUrl) window.open(pdfUrl, '_blank')
    } catch (e) { console.error(e) }
    setGeneratingLabel(false)
  }

  const isBuyer = conv ? user?.id === conv.buyer_id : true
  const isSeller = conv ? user?.id === conv.seller_id : false
  const other = conv ? (isBuyer ? conv.seller : conv.buyer) : listing?.profiles
  const otherId = conv ? (isBuyer ? conv.seller_id : conv.buyer_id) : listing?.user_id
  const headerListing = conv?.listings || listing
  const img = headerListing?.images?.split(',')[0]
  const avatarInitial = other?.name?.[0]?.toUpperCase() || '?'

  const timeline = [
    ...messages.map(m => ({ ...m, _type: 'message' })),
    ...offers.map(o => ({ ...o, _type: 'offer' }))
  ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', maxWidth: '100vw' }}>
      <Navbar />

      {/* Offer modal */}
      {offerOpen && (
        <div onClick={() => setOfferOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '400px', position: 'relative' }}>
            <button onClick={() => setOfferOpen(false)} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '20px', color: '#999', cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Senda tilboð</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Listaverð: {headerListing?.price?.toLocaleString('is-IS')} kr.</p>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)} placeholder="Tilboðsverð"
                style={{ width: '100%', padding: '12px 44px 12px 14px', fontSize: '16px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none' }} />
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '14px' }}>kr.</span>
            </div>
            <button onClick={sendOfferFromChat} disabled={offerSending || !offerAmount}
              style={{ width: '100%', background: offerAmount ? '#111' : '#e5e5e5', color: offerAmount ? '#fff' : '#999', padding: '13px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: offerAmount ? 'pointer' : 'default' }}>
              {offerSending ? 'Augnablik...' : 'Senda tilboð'}
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '700px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1, padding: '0 16px', minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px 0', borderBottom: '1px solid #e5e5e5', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => router.back()} style={{ color: '#111', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', flexShrink: 0 }}>←</button>
          {img && <Link href={'/listings/' + headerListing?.id} style={{ flexShrink: 0 }}><img src={img} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', display: 'block' }} /></Link>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link href={'/profile/' + otherId} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '600', color: '#555', flexShrink: 0 }}>
                  {other?.avatar_url ? <img src={other.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : avatarInitial}
                </div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{other?.name}</div>
              </div>
            </Link>
            <Link href={'/listings/' + headerListing?.id} style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>
              {headerListing?.title} · {headerListing?.price?.toLocaleString('is-IS')} kr.
            </Link>
          </div>
          {/* Offer button for buyer — top right */}
          {isBuyer && headerListing?.status === 'active' && (
            <button onClick={() => setOfferOpen(true)}
              style={{ padding: '7px 12px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
              Senda tilboð
            </button>
          )}
        </div>

        {/* Messages + offers timeline */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Order banner */}
          {order && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '16px', marginBottom: '8px' }}>
              {isSeller ? (
                <>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#166534' }}>🎉 Pöntun móttekin!</div>
                  <div style={{ fontSize: '13px', color: '#166534', marginBottom: '12px' }}>Kaupandi hefur sent pöntun. Búðu vöruna til sendingar og prentaðu Dropp miðann.</div>
                  <button onClick={generateLabel} disabled={generatingLabel}
                    style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    {generatingLabel ? 'Augnablik...' : '🖨 Prenta sendingarmiða'}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#166534' }}>✅ Pöntun staðfest</div>
                  <div style={{ fontSize: '13px', color: '#166534', marginBottom: order.dropp_barcode ? '12px' : '0' }}>Seljandi er að undirbúa sendinguna. Þú færð tilkynningu þegar varan er send.</div>
                  {order.dropp_barcode && (
                    <a href={'https://dropp.is/tracking/' + order.dropp_barcode} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-block', background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                      📦 Fylgjast með sendingu
                    </a>
                  )}
                </>
              )}
            </div>
          )}

          {timeline.map(item => {
            if (item._type === 'message') {
              const mine = item.sender_id === user?.id
              return (
                <div key={'msg-' + item.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: mine ? '#111' : '#f0f0f0', color: mine ? '#fff' : '#111', fontSize: '14px', lineHeight: '1.5' }}>
                    {item.content}
                  </div>
                </div>
              )
            }

            if (item._type === 'offer') {
              const isMyOffer = item.buyer_id === user?.id
              const amISeller = item.seller_id === user?.id
              const isPending = item.status === 'pending'

              return (
                <div key={'offer-' + item.id} style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                  <div style={{ width: '100%', maxWidth: '380px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '12px', color: '#888' }}>{isMyOffer ? 'Tilboð þitt' : 'Tilboð frá ' + other?.name}</div>
                      <div style={{ fontSize: '11px', color: item.status === 'accepted' ? '#16a34a' : item.status === 'declined' ? '#dc2626' : '#888', fontWeight: '600', textTransform: 'uppercase' }}>
                        {item.status === 'pending' ? 'Í bið' : item.status === 'accepted' ? 'Samþykkt' : 'Hafnað'}
                      </div>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: isPending && amISeller ? '12px' : '0' }}>
                      {item.amount.toLocaleString('is-IS')} kr.
                      <span style={{ fontSize: '13px', fontWeight: '400', color: '#aaa', marginLeft: '8px', textDecoration: 'line-through' }}>{headerListing?.price?.toLocaleString('is-IS')} kr.</span>
                    </div>

                    {isPending && amISeller && (
                      counteringId === item.id ? (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <div style={{ position: 'relative', flex: 1 }}>
                            <input type="number" value={counterAmount} onChange={e => setCounterAmount(e.target.value)} placeholder="Gagnboð"
                              style={{ width: '100%', padding: '9px 36px 9px 12px', fontSize: '14px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none' }} />
                            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#999' }}>kr.</span>
                          </div>
                          <button onClick={() => sendCounter(item.id)} style={{ padding: '9px 14px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Senda</button>
                          <button onClick={() => setCounteringId(null)} style={{ padding: '9px 12px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button onClick={() => respondToOffer(item.id, 'accepted')} style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Samþykkja</button>
                          <button onClick={() => respondToOffer(item.id, 'declined')} style={{ flex: 1, padding: '10px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Hafna</button>
                          <button onClick={() => setCounteringId(item.id)} style={{ flex: 1, padding: '10px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Gagnboð</button>
                        </div>
                      )
                    )}
                    {isPending && isMyOffer && <div style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>Bíður svars frá seljanda...</div>}
                  </div>
                </div>
              )
            }
            return null
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 0 20px', borderTop: '1px solid #e5e5e5', display: 'flex', gap: '8px' }}>
          <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={onKey} placeholder="Skrifaðu skilaboð..." rows={1}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '24px', fontSize: '14px', outline: 'none', resize: 'none', lineHeight: '1.5' }} />
          <button onClick={send} disabled={sending || !text.trim()}
            style={{ padding: '10px 18px', background: text.trim() ? '#111' : '#e5e5e5', color: text.trim() ? '#fff' : '#999', border: 'none', borderRadius: '24px', fontSize: '14px', fontWeight: '500', cursor: text.trim() ? 'pointer' : 'default' }}>
            Senda
          </button>
        </div>
      </div>
    </div>
  )
}



import { Suspense } from 'react'

export default function MessageThreadPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div>}>
      <MessageThread />
    </Suspense>
  )
}