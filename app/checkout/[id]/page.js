'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Script from 'next/script'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'

const CAPITAL_LOCATIONS = ['Reykjavík', 'Kópavogur', 'Hafnarfjörður', 'Garðabær', 'Mosfellsbær', 'Seltjarnarnes', 'Álftanes']

const SHIPPING_PRICES = {
  dropp: { small: 870, large: 1820 },
  shipping: { small: 1410, large: 2370 },
  dropp_other: { small: 1075, large: 2380 },
  shipping_other: { small: 1660, large: 3050 },
}

function getShippingFee(deliveryType, weightClass, sellerLocation) {
  const isCapital = CAPITAL_LOCATIONS.includes(sellerLocation)
  if (deliveryType === 'dropp') {
    return isCapital ? SHIPPING_PRICES.dropp[weightClass] : SHIPPING_PRICES.dropp_other[weightClass]
  }
  return isCapital ? SHIPPING_PRICES.shipping[weightClass] : SHIPPING_PRICES.shipping_other[weightClass]
}

export default function CheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const formRef = useRef(null)
  const [user, setUser] = useState(null)
  const [listing, setListing] = useState(null)
  const [sellerLocation, setSellerLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [city, setCity] = useState('')
  const [delivery, setDelivery] = useState('dropp')
  const [droppLocation, setDroppLocation] = useState(null)
  const [error, setError] = useState('')
  const [borgunFields, setBorgunFields] = useState(null)

  const storeId = process.env.NEXT_PUBLIC_DROPP_STORE_ID

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      if (session.user.email) setEmail(session.user.email)
    })
    fetchListing()
  }, [id])

  // Auto-submit Borgun form when fields are ready
  useEffect(() => {
    if (borgunFields && formRef.current) {
      formRef.current.submit()
    }
  }, [borgunFields])

  const fetchListing = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(id, name, location)')
      .eq('id', id)
      .single()
    setListing(data)
    setSellerLocation(data?.profiles?.location || '')
    setLoading(false)
  }

  const weightClass = listing?.weight_class || 'small'
  const shippingFee = listing ? getShippingFee(delivery, weightClass, sellerLocation) : 0
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

    // Get or create conversation
    let conversationId = null
    const { data: existingConv } = await supabase.from('conversations').select('id').eq('listing_id', listing.id).eq('buyer_id', user.id).single()
    if (existingConv) {
      conversationId = existingConv.id
    } else {
      const { data: newConv } = await supabase.from('conversations').insert({
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.user_id
      }).select().single()
      conversationId = newConv?.id
    }

    const shippingData = delivery === 'dropp'
      ? { type: 'dropp', locationId: droppLocation.id, locationName: droppLocation.name, name, phone, email }
      : { type: 'shipping', name, phone, email, address, zipcode, city }

    // Save order to Supabase
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.user_id,
      conversation_id: conversationId,
      amount: listing.price,
      platform_fee: platformFee,
      shipping_fee: shippingFee,
      seller_payout: listing.price - platformFee,
      status: 'pending_payment',
      shipping_address: shippingData,
      dropp_location_id: delivery === 'dropp' ? droppLocation.id : null,
    }).select().single()

    if (orderError) { setError(orderError.message); setPlacing(false); return }

    // Get Borgun payment fields
    const res = await fetch('/api/borgun/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        amount: total,
        buyerName: name,
        buyerEmail: email
      })
    })

    const fields = await res.json()
    if (fields.error) { setError('Villa við greiðslu: ' + fields.error); setPlacing(false); return }

    // Add item lines
    fields.itemdescription_0 = listing.title.slice(0, 80)
    fields.itemcount_0 = '1'
    fields.itemunitamount_0 = String(listing.price)
    fields.itemamount_0 = String(listing.price)

    console.log('BORGUN_FIELDS:', JSON.stringify(fields))
    setBorgunFields(fields)
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  if (!listing || listing.status !== 'active') return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Þessi vara er ekki til sölu</div>
    </div>
  )

  return (
    <div>
      <Script src="//app.dropp.is/dropp-locations.min.js" data-store-id={storeId} data-env="production" strategy="afterInteractive" />
      <Navbar />

      {/* Hidden Borgun form — auto-submits when borgunFields is set */}
      {borgunFields && (
        <form ref={formRef} method="post" action="https://test.borgun.is/SecurePay/default.aspx" style={{ display: 'none' }}>
          {Object.entries(borgunFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '32px' }}>Kaupa vöru</h1>

        {/* Listing summary */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f9f9f9', borderRadius: '10px', marginBottom: '28px', alignItems: 'center' }}>
          {listing.images && <img src={listing.images.split(',')[0]} style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
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
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{droppLocation.name || 'Staður valinn'}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{droppLocation.address || ''}</div>
                </div>
                <button onClick={openDroppMap} style={{ fontSize: '12px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Breyta</button>
              </div>
            ) : (
              <button onClick={openDroppMap} style={{ width: '100%', padding: '14px', border: '2px dashed #e5e5e5', borderRadius: '8px', background: '#fafafa', cursor: 'pointer', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                🗺 Velja Dropp afhendingarstað
              </button>
            )}
          </div>
        )}

        {/* Customer info */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Nafn</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Símanúmer</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: delivery === 'shipping' ? '16px' : '24px' }}>
          <label style={labelStyle}>Netfang <span style={{ color: '#999', fontWeight: '400' }}>(valfrjálst)</span></label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        </div>

        {delivery === 'shipping' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Heimilisfang</label>
              <input value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>Póstnúmer</label>
                <input value={zipcode} onChange={e => setZipcode(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Borg</label>
                <input value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
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
            <span>Sendingargjald {weightClass === 'large' ? '(10–30 kg)' : '(0–10 kg)'}</span>
            <span>{shippingFee.toLocaleString('is-IS')} kr.</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', borderTop: '1px solid #e5e5e5', paddingTop: '10px', marginTop: '4px' }}>
            <span>Samtals</span>
            <span>{total.toLocaleString('is-IS')} kr.</span>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>{error}</div>}

        <button onClick={placeOrder} disabled={placing}
          style={{ width: '100%', background: placing ? '#999' : '#111', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: placing ? 'not-allowed' : 'pointer' }}>
          {placing ? 'Augnablik...' : 'Greiða — ' + total.toLocaleString('is-IS') + ' kr.'}
        </button>
        <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '12px' }}>
          Með því að greiða samþykkir þú skilmála Torgs
        </p>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#111' }
const inputStyle = { width: '100%', padding: '11px 14px', fontSize: '15px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111' }