'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'
import { CONDITIONS } from '@/lib/categories'

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

function Lightbox({ imgs, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(c + 1, imgs.length - 1))
      if (e.key === 'ArrowLeft') setCurrent(c => Math.max(c - 1, 0))
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [imgs.length, onClose])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
    if (Math.abs(dx) > 50 && dy < 80) {
      if (dx < 0) setCurrent(c => Math.min(c + 1, imgs.length - 1))
      else setCurrent(c => Math.max(c - 1, 0))
    }
    touchStartX.current = null
  }
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault()
      if (e.deltaX > 30) setCurrent(c => Math.min(c + 1, imgs.length - 1))
      else if (e.deltaX < -30) setCurrent(c => Math.max(c - 1, 0))
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', zIndex: 10, lineHeight: 1 }}>✕</button>
      <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', color: '#fff', fontSize: '14px', opacity: 0.7 }}>{current + 1} / {imgs.length}</div>
      {current > 0 && (
        <button onClick={e => { e.stopPropagation(); setCurrent(c => c - 1) }} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '24px', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>‹</button>
      )}
      <div onClick={e => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onWheel={onWheel} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={imgs[current]} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', userSelect: 'none' }} draggable={false} />
      </div>
      {current < imgs.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setCurrent(c => c + 1) }} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '24px', width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>›</button>
      )}
      <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
        {imgs.map((_, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i) }} style={{ width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
        ))}
      </div>
    </div>
  )
}

export default function ListingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [user, setUser] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxStart, setLightboxStart] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sellerListings, setSellerListings] = useState([])
  const [similarListings, setSimilarListings] = useState([])
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reported, setReported] = useState(false)
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) checkBookmark(session.user.id)
    })
  }, [])

  useEffect(() => { if (id) fetchListing() }, [id])

  const fetchListing = async () => {
    setLoading(true)
    const { data } = await supabase.from('listings').select('*, profiles(id, name, avatar_url, rating, rating_count)').eq('id', id).single()
    setListing(data)
    setLoading(false)
    if (data) { fetchSellerListings(data.user_id, data.id); fetchSimilarListings(data.category, data.id) }
  }

  const fetchSellerListings = async (sid, cid) => {
    const { data } = await supabase.from('listings').select('id,title,price,images').eq('user_id', sid).eq('status', 'active').neq('id', cid).limit(6)
    setSellerListings(data || [])
  }

  const fetchSimilarListings = async (cat, cid) => {
    const { data } = await supabase.from('listings').select('id,title,price,images,profiles(name)').eq('category', cat).eq('status', 'active').neq('id', cid).limit(8)
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
    if (navigator.share) navigator.share({ title: listing.title, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const openLightbox = (index) => { setLightboxStart(index); setLightboxOpen(true) }

  const getOrCreateConv = async () => {
    const { data: ex } = await supabase.from('conversations').select('id').eq('listing_id', listing.id).eq('buyer_id', user.id).single()
    if (ex) return ex.id
    const { data: conv } = await supabase.from('conversations').insert({ listing_id: listing.id, buyer_id: user.id, seller_id: listing.user_id }).select().single()
    return conv.id
  }

  const contactSeller = async () => {
    if (!user) { router.push('/auth'); return }
    setContacting(true)
    const convId = await getOrCreateConv()
    router.push('/messages/' + convId)
  }

  const markStatus = async (status) => {
    await supabase.from('listings').update({ status }).eq('id', id)
    fetchListing()
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>
  if (!listing) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Vara fannst ekki</div></>

  const imgs = listing.images ? listing.images.split(',').filter(Boolean) : []
  const isOwner = user?.id === listing.user_id
  const conditionLabel = CONDITIONS.find(c => c.value === listing.condition)?.label || listing.condition
  const specs = [
    listing.condition && { label: 'Ástand', value: conditionLabel },
    listing.brand && { label: 'Vörumerki', value: listing.brand },
    listing.size && { label: 'Stærð', value: listing.size },
    listing.color && { label: 'Litur', value: listing.color },
    listing.location && { label: 'Staðsetning', value: listing.location },
  ].filter(Boolean)

  // Thumbnails fill the same height as main image (3:4 ratio)
  // Main image width = 340px, so height = 340 * 4/3 = ~453px
  // 4 thumbs with 3 gaps of 6px: thumb height = (453 - 18) / 4 = ~108.75px
  // Thumb width at 3:4 = 108.75 * 3/4 = ~81px
  const THUMB_COUNT = 4

  return (
    <div>
      <Navbar />
      {lightboxOpen && <Lightbox imgs={imgs} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)} />}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>

        {listing.category_path && (
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>{listing.category_path}</div>
        )}

        <div className="listing-layout">

          {/* Images */}
          <div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {/* Main image */}
              <div
                onClick={() => openLightbox(activeImg)}
                className="main-img"
                style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative', cursor: 'zoom-in' }}
              >
                {imgs[activeImg] ? (
                  <img src={imgs[activeImg]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>📦</div>
                )}
                {listing.status !== 'active' && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: listing.status === 'sold' ? '#111' : '#f59e0b', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                    {listing.status === 'sold' ? 'Seld' : 'Frátekið'}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {imgs.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '72px', flexShrink: 0 }}>
                  {imgs.slice(1, THUMB_COUNT + 1).map((url, i) => {
                    const realIndex = i + 1
                    const isLast = realIndex === THUMB_COUNT && imgs.length > THUMB_COUNT + 1
                    return (
                      <div
                        key={realIndex}
                        onClick={() => openLightbox(realIndex)}
                        style={{ aspectRatio: '3/4', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '2px solid transparent' }}
                      >
                        <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.8 }} />
                        {isLast && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: '700' }}>
                            +{imgs.length - THUMB_COUNT - 1}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="listing-info">
            <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '6px', lineHeight: '1.3' }}>{listing.title}</h1>
            <div style={{ fontSize: '26px', fontWeight: '700', marginBottom: '16px' }}>{listing.price.toLocaleString('is-IS')} kr.</div>

            {listing.description && <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#444', marginBottom: '14px' }}>{listing.description}</p>}

            {specs.length > 0 && (
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '10px', padding: '4px 16px', marginBottom: '14px' }}>
                {specs.map(({ label, value }, i) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>Birt</span>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{timeAgo(listing.created_at)}</span>
                </div>
              </div>
            )}

            <Link href={'/profile/' + listing.profiles?.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#f9f9f9', borderRadius: '10px', textDecoration: 'none', color: 'inherit', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '14px', flexShrink: 0, overflow: 'hidden' }}>
                {listing.profiles?.avatar_url ? <img src={listing.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : listing.profiles?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>{listing.profiles?.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{listing.profiles?.rating_count > 0 ? '★ ' + listing.profiles.rating.toFixed(1) : 'Engar umsagnir'}</div>
              </div>
              <span style={{ fontSize: '12px', color: '#aaa' }}>→</span>
            </Link>

            {isOwner ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={'/listings/' + id + '/edit'} style={{ flex: 1, padding: '11px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textAlign: 'center', textDecoration: 'none' }}>Breyta</Link>
                  {listing.status === 'active' && <button onClick={() => markStatus('reserved')} style={{ flex: 1, padding: '11px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Frátekið</button>}
                  {(listing.status === 'active' || listing.status === 'reserved') && <button onClick={() => markStatus('sold')} style={{ flex: 1, padding: '11px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Selt</button>}
                </div>
                {listing.status === 'reserved' && <button onClick={() => markStatus('active')} style={{ padding: '9px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', color: '#666', cursor: 'pointer' }}>Taka af frátekingu</button>}
              </div>
            ) : listing.status === 'active' ? (
              <button onClick={contactSeller} disabled={contacting} style={{ width: '100%', background: '#111', color: '#fff', padding: '13px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                {contacting ? 'Augnablik...' : 'Hafa samband'}
              </button>
            ) : (
              <div style={{ background: '#f5f5f5', padding: '14px', borderRadius: '8px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
                {listing.status === 'reserved' ? 'Þessi vara er frátekið' : 'Þessi vara hefur verið seld'}
              </div>
            )}

            {/* Bottom actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
              <button
                onClick={toggleBookmark}
                style={{ flex: 1, padding: '9px', background: bookmarked ? '#111' : '#fff', color: bookmarked ? '#fff' : '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {bookmarked ? 'Vistað' : 'Vista'}
              </button>
              <button onClick={share} style={{ flex: 1, padding: '9px', background: '#fff', color: '#111', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                {copied ? '✓ Afritað' : '↗ Deila'}
              </button>
              {!isOwner && (
                <button onClick={() => setReported(true)} style={{ padding: '9px 12px', background: '#fff', color: reported ? '#aaa' : '#ef4444', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '13px', cursor: reported ? 'default' : 'pointer' }}>
                  {reported ? 'Tilkynnt' : 'Tilkynna'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related listings — full width below both columns */}
        {sellerListings.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600' }}>Fleiri vörur frá {listing.profiles?.name}</h2>
              <Link href={'/profile/' + listing.profiles?.id} style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Sjá allt →</Link>
            </div>
            <div className="mini-grid">{sellerListings.map(l => <MiniCard key={l.id} listing={l} />)}</div>
          </div>
        )}
        {similarListings.length > 0 && (
          <div style={{ marginTop: '24px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Aðrar svipaðar vörur</h2>
            <div className="mini-grid">{similarListings.map(l => <MiniCard key={l.id} listing={l} />)}</div>
          </div>
        )}
      </div>

      <style>{`
        .listing-layout {
          display: grid;
          grid-template-columns: minmax(0, 500px) 320px;
          gap: 24px;
          align-items: start;
          justify-content: center;
        }
        .main-img { width: 380px; flex-shrink: 0; aspect-ratio: 3/4; max-height: 520px; }
        .listing-info { position: static; }
        .related-desktop { }
        .mini-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }
        .mini-card { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; }
        .mini-card-img {
          width: 100%;
          padding-bottom: 133.33%;
          position: relative;
          background: #f0f0f0;
          overflow: hidden;
          display: block;
        }
        .mini-card-img img {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .related-mobile { display: none; }
        @media (max-width: 768px) {
          .listing-layout { grid-template-columns: 1fr; gap: 16px; justify-content: stretch; }
          .main-img { width: 100%; flex-shrink: 1; aspect-ratio: 3/4; max-height: none; }
          .mini-grid { grid-template-columns: repeat(3, 1fr); }
          .related-desktop { display: none !important; }
          .related-mobile { display: block; }
        }
      `}</style>
    </div>
  )
}

function MiniCard({ listing }) {
  const img = listing.images ? listing.images.split(',')[0] : null
  return (
    <Link href={'/listings/' + listing.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', alignSelf: 'start' }}>
      <div className="mini-card">
        <div className="mini-card-img">
          {img
            ? <img src={img} alt={listing.title} />
            : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📦</div>
          }
        </div>
        <div style={{ padding: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</div>
          <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>{listing.price.toLocaleString('is-IS')} kr.</div>
        </div>
      </div>
    </Link>
  )
}