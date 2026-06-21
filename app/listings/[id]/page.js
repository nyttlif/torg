'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

export default function ListingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [user, setUser] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sellerListings, setSellerListings] = useState([])
  const [similarListings, setSimilarListings] = useState([])
  const [bookmarked, setBookmarked] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [offer, setOffer] = useState('')
  const [offerSent, setOfferSent] = useState(false)
  const [reported, setReported] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkBookmark(session.user.id)
    })
  }, [])

  useEffect(() => { if (id) fetchListing() }, [id])

  const fetchListing = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(id, name, avatar_url, rating, rating_count, created_at)')
      .eq('id', id)
      .single()
    setListing(data)
    setLoading(false)
    if (data) {
      fetchSellerListings(data.user_id, data.id)
      fetchSimilarListings(data.category, data.id)
    }
  }

  const fetchSellerListings = async (sellerId, currentId) => {
    const { data } = await supabase.from('listings').select('id, title, price, images').eq('user_id', sellerId).eq('status', 'active').neq('id', currentId).limit(6)
    setSellerListings(data || [])
  }

  const fetchSimilarListings = async (category, currentId) => {
    const { data } = await supabase.from('listings').select('id, title, price, images, profiles(name)').eq('category', category).eq('status', 'active').neq('id', currentId).limit(6)
    setSimilarListings(data || [])
  }

  const checkBookmark = async (uid) => {
    const { data } = await supabase.from('bookmarks').select('id').eq('user_id', uid).eq('listing_id', id).single()
    setBookmarked(!!data)
  }

  const toggleBookmark = async () => {
    if (!user) { router.push('/auth'); return }
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('listing_id', id)
      setBookmarked(false)
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, listing_id: parseInt(id) })
      setBookmarked(true)
    }
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: listing.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const report = async () => {
    if (!user) { router.push('/auth'); return }
    setReported(true)
  }

  const getOrCreateConv = async () => {
    const { data: existing } = await supabase.from('conversations').select('id').eq('listing_id', listing.id).eq('buyer_id', user.id).single()
    if (existing) return existing.id
    const { data: conv } = await supabase.from('conversations').insert({ listing_id: listing.id, buyer_id: user.id, seller_id: listing.user_id }).select().single()
    return conv.id
  }

  const sendMessage = async () => {
    if (!user) { router.push('/auth'); return }
    if (!message.trim()) return
    setSending(true)
    const convId = await getOrCreateConv()
    await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, content: message.trim() })
    setSending(false)
    setSent(true)
    setMessage('')
  }

  const sendOffer = async () => {
    if (!user) { router.push('/auth'); return }
    if (!offer || parseInt(offer) <= 0) return
    const convId = await getOrCreateConv()
    await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, content: 'Tilboð: ' + parseInt(offer).toLocaleString('is-IS') + ' kr.' })
    setOfferSent(true)
    setOfferOpen(false)
  }

  const markStatus = async (status) => {
    await supabase.from('listings').update({ status }).eq('id', id)
    fetchListing()
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>
  if (!listing) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Vara fannst ekki</div></>

  const imgs = listing.images ? listing.images.split(',').filter(Boolean) : []
  const isOwner = user?.id === listing.user_id

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', marginBottom: '60px' }}>

          {/* Images */}
          <div>
            <div style={{ aspectRatio: '4/3', background: '#f0f0f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
              {imgs[activeImg] ? (
                <img src={imgs[activeImg]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>📦</div>
              )}
              {/* Status badge */}
              {listing.status !== 'active' && (
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: listing.status === 'sold' ? '#111' : '#f59e0b', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                  {listing.status === 'sold' ? 'Seld' : 'Frátekið'}
                </div>
              )}
            </div>
            {imgs.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {imgs.map((url, i) => (
                  <img key={i} src={url} onClick={() => setActiveImg(i)}
                    style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === activeImg ? '2px solid #111' : '2px solid transparent', opacity: i === activeImg ? 1 : 0.65 }} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {listing.category_path && <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>{listing.category_path}</div>}
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', lineHeight: '1.3' }}>{listing.title}</h1>
            <div style={{ fontSize: '30px', fontWeight: '700', marginBottom: '16px' }}>{listing.price.toLocaleString('is-IS')} kr.</div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {listing.condition && <span style={tag}>{listing.condition}</span>}
              {listing.brand && <span style={tag}>{listing.brand}</span>}
              {listing.color && <span style={tag}>{listing.color}</span>}
              {listing.size && <span style={tag}>Stærð: {listing.size}</span>}
              {listing.location && <span style={tag}>📍 {listing.location}</span>}
            </div>

            {listing.description && <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#444', marginBottom: '24px' }}>{listing.description}</p>}

            {/* Seller */}
            <Link href={'/profile/' + listing.profiles?.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: '#f9f9f9', borderRadius: '10px', textDecoration: 'none', color: 'inherit', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '16px', flexShrink: 0, overflow: 'hidden' }}>
                {listing.profiles?.avatar_url ? <img src={listing.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : listing.profiles?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '500', fontSize: '15px' }}>{listing.profiles?.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {listing.profiles?.rating_count > 0 ? '★ ' + listing.profiles.rating.toFixed(1) + ' (' + listing.profiles.rating_count + ' umsagnir)' : 'Engar umsagnir ennþá'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#aaa' }}>→</div>
            </Link>

            {/* Owner actions */}
            {isOwner ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={'/listings/' + id + '/edit'} style={{ flex: 1, padding: '12px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
                    Breyta
                  </Link>
                  {listing.status === 'active' && (
                    <button onClick={() => markStatus('reserved')} style={{ flex: 1, padding: '12px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                      Frátekið
                    </button>
                  )}
                  {(listing.status === 'active' || listing.status === 'reserved') && (
                    <button onClick={() => markStatus('sold')} style={{ flex: 1, padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                      Selt
                    </button>
                  )}
                </div>
                {listing.status === 'reserved' && (
                  <button onClick={() => markStatus('active')} style={{ padding: '10px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                    Taka af frátekingu
                  </button>
                )}
              </div>
            ) : listing.status === 'active' ? (
              <div>
                {/* Message */}
                {sent ? (
                  <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>Skilaboð send!</div>
                ) : (
                  <div style={{ marginBottom: '10px' }}>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Hæ, er þetta enn til sölu?" rows={2}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', marginBottom: '8px', resize: 'none', outline: 'none' }} />
                    <button onClick={sendMessage} disabled={sending}
                      style={{ width: '100%', background: '#fff', color: '#111', padding: '11px', borderRadius: '8px', border: '1px solid #e5e5e5', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                      {sending ? 'Augnablik...' : 'Hafa samband'}
                    </button>
                  </div>
                )}

                {/* Offer */}
                {offerSent ? (
                  <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '8px', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>Tilboð sent!</div>
                ) : offerOpen ? (
                  <div style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>Upphaflegt verð: {listing.price.toLocaleString('is-IS')} kr.</div>
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                      <input type="number" value={offer} onChange={e => setOffer(e.target.value)} placeholder="Tilboðsverð..." autoFocus
                        style={{ width: '100%', padding: '10px 44px 10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                      <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '13px' }}>kr.</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setOfferOpen(false)} style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#666' }}>Hætta við</button>
                      <button onClick={sendOffer} style={{ flex: 1, padding: '10px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Senda tilboð</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setOfferOpen(true)}
                    style={{ width: '100%', padding: '11px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '10px' }}>
                    Senda tilboð
                  </button>
                )}

                {/* Buy */}
                <button onClick={() => router.push('/checkout/' + id)}
                  style={{ width: '100%', background: '#111', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>
                  Kaupa núna — {listing.price.toLocaleString('is-IS')} kr.
                </button>
              </div>
            ) : (
              <div style={{ background: '#f5f5f5', padding: '14px', borderRadius: '8px', fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>
                {listing.status === 'reserved' ? 'Þessi vara er frátekið' : 'Þessi vara hefur verið seld'}
              </div>
            )}

            {/* Bottom actions */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
              <button onClick={toggleBookmark}
                style={{ flex: 1, padding: '9px', background: bookmarked ? '#111' : '#fff', color: bookmarked ? '#fff' : '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                {bookmarked ? '🔖 Vistað' : '🔖 Vista'}
              </button>
              <button onClick={share}
                style={{ flex: 1, padding: '9px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                {copied ? '✓ Afritað' : '↗ Deila'}
              </button>
              {!isOwner && (
                <button onClick={report}
                  style={{ padding: '9px 12px', background: '#fff', color: reported ? '#aaa' : '#ef4444', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: reported ? 'default' : 'pointer' }}>
                  {reported ? 'Tilkynnt' : 'Tilkynna'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* More from seller */}
        {sellerListings.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Fleiri vörur frá {listing.profiles?.name}</h2>
              <Link href={'/profile/' + listing.profiles?.id} style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>Sjá allt →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
              {sellerListings.map(l => <MiniCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}

        {/* Similar */}
        {similarListings.length > 0 && (
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Líkar vörur</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
              {similarListings.map(l => <MiniCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MiniCard({ listing }) {
  const img = listing.images ? listing.images.split(',')[0] : null
  return (
    <Link href={'/listings/' + listing.id} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
        <div style={{ aspectRatio: '3/4', background: '#f0f0f0' }}>
          {img ? <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📦</div>}
        </div>
        <div style={{ padding: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</div>
          <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>{listing.price.toLocaleString('is-IS')} kr.</div>
        </div>
      </div>
    </Link>
  )
}

const tag = { background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#555' }