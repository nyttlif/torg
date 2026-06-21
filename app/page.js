'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from './components/Navbar'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, LOCATIONS } from '@/lib/categories'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Nýjast' },
  { value: 'price_asc', label: 'Verð: Lægst' },
  { value: 'price_desc', label: 'Verð: Hæst' },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const search = searchParams.get('search') || ''

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
  }, [])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('listings').select('*, profiles(name)').eq('status', 'active')
    if (category) query = query.eq('category', category)
    if (location) query = query.eq('location', location)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (search) query = query.ilike('title', '%' + search + '%')
    if (sort === 'newest') query = query.order('created_at', { ascending: false })
    else if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    const { data } = await query.limit(80)
    setListings(data || [])
    setLoading(false)
  }, [category, location, sort, minPrice, maxPrice, search])

  useEffect(() => { fetchListings() }, [fetchListings])

  const clearFilters = () => { setCategory(''); setLocation(''); setMinPrice(''); setMaxPrice('') }
  const hasFilters = category || location || minPrice || maxPrice || search
  const isFirstVisit = !loading && listings.length === 0 && !hasFilters

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px' }}>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '20px', background: '#fff', outline: 'none', cursor: 'pointer' }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div style={{ width: '1px', height: '24px', background: '#e5e5e5' }} />

        <button onClick={() => setCategory('')}
          style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #e5e5e5', background: !category ? '#111' : '#fff', color: !category ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Allt
        </button>
        {Object.entries(CATEGORIES).map(([name, data]) => (
          <button key={name} onClick={() => setCategory(category === name ? '' : name)}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #e5e5e5', background: category === name ? '#111' : '#fff', color: category === name ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {data.icon} {name}
          </button>
        ))}

        <div style={{ width: '1px', height: '24px', background: '#e5e5e5' }} />

        <select value={location} onChange={e => setLocation(e.target.value)}
          style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid ' + (location ? '#111' : '#e5e5e5'), borderRadius: '20px', background: location ? '#111' : '#fff', color: location ? '#fff' : '#111', outline: 'none', cursor: 'pointer' }}>
          <option value="">Allar staðsetningar</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <input type="number" placeholder="Lágm. kr." value={minPrice} onChange={e => setMinPrice(e.target.value)}
          style={{ width: '96px', padding: '6px 10px', fontSize: '13px', border: '1px solid ' + (minPrice ? '#111' : '#e5e5e5'), borderRadius: '20px', outline: 'none', background: '#fff' }} />
        <span style={{ fontSize: '13px', color: '#aaa' }}>–</span>
        <input type="number" placeholder="Hám. kr." value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
          style={{ width: '96px', padding: '6px 10px', fontSize: '13px', border: '1px solid ' + (maxPrice ? '#111' : '#e5e5e5'), borderRadius: '20px', outline: 'none', background: '#fff' }} />

        {hasFilters && (
          <button onClick={clearFilters}
            style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #e5e5e5', background: '#fff', color: '#666', fontSize: '13px', cursor: 'pointer' }}>
            ✕ Hreinsa
          </button>
        )}
      </div>

      {/* Results count */}
      {!loading && !isFirstVisit && (
        <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          {listings.length === 80 ? '80+' : listings.length} {listings.length === 1 ? 'vara' : 'vörur'} fundust
          {search && ' fyrir "' + search + '"'}
          {category && ' · ' + category}
          {location && ' · ' + location}
        </p>
      )}

      {/* States */}
      {loading ? (
        <div className="listing-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ background: '#eee', borderRadius: '10px', aspectRatio: '3/4', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : isFirstVisit ? (
        /* Empty state for new platform */
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Velkomin á Torg</h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
            Kauptu og seldu notaðar vörur á Íslandi. Vertu fyrstur til að birta auglýsingu!
          </p>
          <Link href={user ? '/listings/new' : '/auth'}
            style={{ background: '#111', color: '#fff', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
            {user ? '+ Birta fyrstu auglýsinguna' : 'Byrja að selja'}
          </Link>
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
          <div style={{ marginBottom: '12px' }}>Engar vörur fundust</div>
          {hasFilters && <button onClick={clearFilters} style={{ fontSize: '13px', color: '#111', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Hreinsa síur</button>}
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map(listing => (
            <Link key={listing.id} href={'/listings/' + listing.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                <div style={{ aspectRatio: '3/4', background: '#f0f0f0', overflow: 'hidden' }}>
                  {listing.images ? (
                    <img src={listing.images.split(',')[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📦</div>
                  )}
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</div>
                  <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{listing.price.toLocaleString('is-IS')} kr.</div>
                  <div style={{ fontSize: '12px', color: '#999', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{listing.profiles?.name}</span>
                    {listing.location && <span>📍 {listing.location}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .listing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 900px) { .listing-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .listing-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </main>
  )
}

export default function Home() {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div>}>
        <HomeContent />
      </Suspense>
    </div>
  )
}