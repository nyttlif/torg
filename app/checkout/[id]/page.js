'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Script from 'next/script'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

// Dropp pricing (incl. VAT) based on weight class and delivery type
const SHIPPING_PRICES = {
  dropp: { small: 870, large: 1820 },
  shipping: { small: 1410, large: 2370 },
}

export default function CheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [city, setCity] = useState('')
  const [delivery, setDelivery] = useState('dropp')
  const [droppLocation, setDroppLocation] = useState(null)
  const [error, setError] = useState('')

  const storeId = process.env.NEXT_PUBLIC_DROPP_STORE_ID

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      if (session.user.email) setEmail(session.user.email)
    })
    fetchListing()
  }, [id])

  const fetchListing = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(id, name)')
      .eq('id', id)
      .single()
    setListing(data)
    setLoading(false)
  }

  const weightClass = listing?.weight_class || 'small'
  const shippingFee = SHIPPING_PRICES[delivery]?.[weightClass] ?? SHIPPING_PRICES[delivery].small
  const platformFee = listing ? Math.round(listing.price * 0.08) : 0
  const total = listing ? listing.price + platformFee + shippingFee : 0

  const openDroppMap = () => {
    if (typeof window === 'undefined' || !window.chooseDroppLocation) {
      setError('Dropp kort er ekki tilbúið, reyndu aftur')
      return
    }
    window.chooseDroppLocation()
      .then(location => { if (location) setDroppLocation(location) })
      .catch(() => setError('Ekki tókst að opna Dropp kort'))
  }

  const placeOrder = async () => {
    setError('')
    if (!name.trim()) { setError('Nafn vantar'); return }
    if (!phone.trim()) { setError('Símanúmer vantar'); return }
    if (delivery === 'dropp' && !droppLocation) { setError('Veldu Dropp afhendingarstað'); return }
    if (delivery === 'shipping' && !address.trim()) { setError('Heimilisfang vantar'); return }
    if (delivery === 'shipping' && !zipcode.trim()) { setError('Póstnúmer vantar'); return }
    if (delivery === 'shipping' && !city.trim()) { setError('Borg vantar'); return }

    setPlacing(true)

    const shippingData = delivery === 'dropp'
      ? { type: 'dropp', locationId: droppLocation.id, locationName: droppLocation.name, name, phone, email }
      : { type: 'shipping', name, phone, email, address, zipcode, city }

    const { error: orderError } = await supabase.from('orders').insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.user_id,
      amount: listing.price,
      platform_fee: platformFee,
      shipping_fee: shippingFee,
      seller_payout: listing.price - platformFee,
      status: 'pending_payment',
      shipping_address: shippingData,
      dropp_location_id: delivery === 'dropp' ? droppLocation.id : null,
    })

    if (orderError) { setError(orderError.message); setPlacing(false); return }

    await supabase.from('listings').update({ status: 'sold' }).eq('id', id)
    setDone(true)
    setPlacing(false)
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  if (done) return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Pöntun móttekin!</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>Seljandi hefur fengið tilkynningu og mun hafa samband vegna greiðslu og afhendingar.</p>
        <button onClick={() => router.push('/')} style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          Til baka á forsíðu
        </button>
      </div>
    </div>
  )

  if (!listing || listing.status !== 'active') return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Þessi vara er ekki til sölu</div>
    </div>
  )

  return (
    <div>
      <Script
        src="//app.dropp.is/dropp-locations.min.js"
        data-store-id={storeId}
        data-env="production"
        strategy="afterInteractive"
      />

      <Navbar />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '32px' }}>Kaupa vöru</h1>

        {/* Listing summary */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '10px', marginBottom: '28px', alignItems: 'center' }}>
          {listing.images && (
            <img src={listing.images.split(',')[0]} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: '500', fontSize: '15px', marginBottom: '4px' }}>{listing.title}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>Seljandi: {listing.profiles?.name}</div>
          </div>
        </div>

        {/* Delivery method */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Afhendingarmáti</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { value: 'dropp', label: '📦 Dropp', desc: 'Sótt í næsta Dropp hirðilás' },
              { value: 'shipping', label: '🚚 Póstur', desc: 'Sent heim til þín' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setDelivery(opt.value)}
                style={{ flex: 1, padding: '12px 8px', borderRadius: '8px', border: '1px solid ' + (delivery === opt.value ? '#111' : '#e5e5e5'), background: delivery === opt.value ? '#111' : '#fff', color: delivery === opt.value ? '#fff' : '#111', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>{opt.label}</div>
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dropp location picker */}
        {delivery === 'dropp' && (
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Dropp afhendingarstaður</label>
            {droppLocation ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>{droppLocation.name || 'Staður valinn'}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{droppLocation.address || ''}</div>
                </div>
                <button onClick={openDroppMap} style={{ fontSize: '12px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Breyta</button>
              </div>
            ) : (
              <button onClick={openDroppMap}
                style={{ width: '100%', padding: '14px', border: '2px dashed #e5e5e5', borderRadius: '8px', background: '#fafafa', cursor: 'pointer', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                🗺 Velja Dropp afhendingarstað
              </button>
            )}
          </div>
        )}

        {/* Customer info */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Nafn</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Jón Jónsson" style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Símanúmer</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="777 7777" style={inputStyle} />
        </div>
        <div style={{ marginBottom: delivery === 'shipping' ? '16px' : '24px' }}>
          <label style={labelStyle}>Netfang <span style={{ color: '#999', fontWeight: '400' }}>(valfrjálst)</span></label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="jon@example.is" style={inputStyle} />
        </div>

        {/* Shipping address */}
        {delivery === 'shipping' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Heimilisfang</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Laugavegur 1" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Póstnúmer</label>
                <input value={zipcode} onChange={e => setZipcode(e.target.value)} placeholder="101" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Borg</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Reykjavík" style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {/* Price breakdown */}
        <div style={{ background: '#f9f9f9', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
            <span>Verð vöru</span>
            <span>{listing.price.toLocaleString('is-IS')} kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: '#888' }}>
            <span>Þjónustugjald (8%)</span>
            <span>{platformFee.toLocaleString('is-IS')} kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: '#888' }}>
            <span>Sending {weightClass === 'large' ? '(10–30 kg)' : '(0–10 kg)'}</span>
            <span>{shippingFee.toLocaleString('is-IS')} kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', borderTop: '1px solid #e5e5e5', paddingTop: '10px', marginTop: '4px' }}>
            <span>Samtals</span>
            <span>{total.toLocaleString('is-IS')} kr.</span>
          </div>
        </div>

        {/* Payment placeholder */}
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#92400e' }}>💳 Greiðsla</div>
          <div style={{ fontSize: '13px', color: '#92400e' }}>Greiðslulausn er í vinnslu. Þú munt fá leiðbeiningar um greiðslu eftir pöntun.</div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>{error}</div>}

        <button onClick={placeOrder} disabled={placing}
          style={{ width: '100%', background: placing ? '#999' : '#111', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: placing ? 'not-allowed' : 'pointer' }}>
          {placing ? 'Augnablik...' : 'Staðfesta pöntun — ' + total.toLocaleString('is-IS') + ' kr.'}
        </button>
        <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '12px' }}>
          Með því að panta samþykkir þú skilmála Torgs
        </p>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#111' }
const inputStyle = { width: '100%', padding: '11px 14px', fontSize: '15px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111' }