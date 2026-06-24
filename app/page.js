'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, LOCATIONS, getSizes } from '@/lib/categories'

const SORT_OPTIONS = ['Nýjast', 'Lægsta verð', 'Hæsta verð']
const SORT_MAP = { 'Nýjast': 'newest', 'Lægsta verð': 'price_asc', 'Hæsta verð': 'price_desc' }

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (active ? '#111' : '#e5e5e5'), background: active ? '#111' : '#fff', color: active ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', fontWeight: active ? '500' : '400', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.1s', lineHeight: 1.4 }}>
      {children}
    </button>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState([])
  const [mainCat, setMainCat] = useState('')
  const [subCat, setSubCat] = useState('')
  const [groupCat, setGroupCat] = useState('')
  const [size, setSize] = useState('')
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState('Nýjast')
  const [sortOpen, setSortOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const sortRef = useRef(null)
  const locationRef = useRef(null)
  const search = searchParams.get('search') || ''

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
      if (locationRef.current && !locationRef.current.contains(e.target)) setLocationOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('listings').select('*, profiles(name, avatar_url)').eq('status', 'active')
    if (mainCat) query = query.eq('category', mainCat)
    if (subCat) query = query.eq('subcategory', subCat)
    if (size) query = query.eq('size', size)
    if (location) query = query.eq('location', location)
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))
    if (search) query = query.ilike('title', '%' + search + '%')
    const s = SORT_MAP[sort]
    if (s === 'newest') query = query.order('created_at', { ascending: false })
    else if (s === 'price_asc') query = query.order('price', { ascending: true })
    else if (s === 'price_desc') query = query.order('price', { ascending: false })
    const { data } = await query.limit(80)
    setListings(data || [])
    setLoading(false)
  }, [mainCat, subCat, size, location, sort, minPrice, maxPrice, search])

  useEffect(() => { fetchListings() }, [fetchListings])

  const clearAll = () => { setMainCat(''); setSubCat(''); setGroupCat(''); setSize(''); setLocation(''); setMinPrice(''); setMaxPrice('') }
  const hasFilters = mainCat || subCat || size || location || minPrice || maxPrice

  const catData = mainCat ? CATEGORIES[mainCat] : null
  const subKeys = catData ? Object.keys(catData.subcategories) : []
  const subValue = (subCat && catData) ? catData.subcategories[subCat] : null
  const groupKeys = (subValue && !Array.isArray(subValue) && typeof subValue === 'object') ? Object.keys(subValue) : []
  const sizes = getSizes(mainCat, subCat, groupCat)
  const isFirstVisit = !loading && listings.length === 0 && !hasFilters && !search

  const filterCount = [mainCat, subCat, size, location, minPrice, maxPrice].filter(Boolean).length

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 20px' }}>

      {/* Desktop filter bar */}
      <div className="desktop-filters" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {/* Row 1: first half of categories + sort + location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
            <Pill active={!mainCat} onClick={() => { setMainCat(''); setSubCat(''); setGroupCat(''); setSize('') }}>Allt</Pill>
            {Object.entries(CATEGORIES).slice(0, 7).map(([name, data]) => (
              <Pill key={name} active={mainCat === name} onClick={() => { setMainCat(mainCat === name ? '' : name); setSubCat(''); setGroupCat(''); setSize('') }}>
                {data.icon} {name}
              </Pill>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
            <div ref={sortRef} style={{ position: 'relative' }}>
              <button onClick={() => { setSortOpen(o => !o); setLocationOpen(false) }}
                style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '8px', background: sort !== 'Nýjast' ? '#111' : '#fff', color: sort !== 'Nýjast' ? '#fff' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                {sort} <span style={{ opacity: 0.5, fontSize: '11px' }}>↕</span>
              </button>
              {sortOpen && (
                <div style={{ position: 'absolute', top: '36px', right: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 50, overflow: 'hidden', minWidth: '140px' }}>
                  {SORT_OPTIONS.map(o => <button key={o} onClick={() => { setSort(o); setSortOpen(false) }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: sort === o ? '#f5f5f5' : '#fff', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', fontWeight: sort === o ? '600' : '400' }}>{o}</button>)}
                </div>
              )}
            </div>
            <div ref={locationRef} style={{ position: 'relative' }}>
              <button onClick={() => { setLocationOpen(o => !o); setSortOpen(false) }}
                style={{ padding: '6px 12px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '8px', background: location ? '#111' : '#fff', color: location ? '#fff' : '#555', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                📍 {location || 'Staðsetning'}
              </button>
              {locationOpen && (
                <div style={{ position: 'absolute', top: '36px', right: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 50, overflow: 'hidden', minWidth: '160px' }}>
                  <button onClick={() => { setLocation(''); setLocationOpen(false) }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: !location ? '#f5f5f5' : '#fff', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}>Allar staðsetningar</button>
                  {LOCATIONS.map(l => <button key={l} onClick={() => { setLocation(l); setLocationOpen(false) }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: location === l ? '#f5f5f5' : '#fff', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', fontWeight: location === l ? '600' : '400' }}>{l}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: remaining categories + price inputs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'nowrap' }}>
            {Object.entries(CATEGORIES).slice(7).map(([name, data]) => (
              <Pill key={name} active={mainCat === name} onClick={() => { setMainCat(mainCat === name ? '' : name); setSubCat(''); setGroupCat(''); setSize('') }}>
                {data.icon} {name}
              </Pill>
            ))}
            {hasFilters && <Pill active={false} onClick={clearAll}>✕ Hreinsa síu</Pill>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '12px' }}>
            <input type="number" placeholder="Lágm." value={minPrice} onChange={e => setMinPrice(e.target.value)}
              style={{ width: '76px', padding: '6px 10px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: minPrice ? '#111' : '#fff', color: minPrice ? '#fff' : '#555' }} />
            <span style={{ fontSize: '13px', color: '#aaa' }}>–</span>
            <input type="number" placeholder="Hám." value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              style={{ width: '76px', padding: '6px 10px', fontSize: '13px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: maxPrice ? '#111' : '#fff', color: maxPrice ? '#fff' : '#555' }} />
          </div>
        </div>
        {subKeys.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#bbb', marginRight: '2px' }}>↳</span>
            {subKeys.map(k => <Pill key={k} active={subCat === k} onClick={() => { setSubCat(subCat === k ? '' : k); setGroupCat(''); setSize('') }}>{k}</Pill>)}
          </div>
        )}
        {groupKeys.length > 0 && subCat && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#bbb', marginRight: '2px' }}>↳</span>
            {groupKeys.map(k => <Pill key={k} active={groupCat === k} onClick={() => { setGroupCat(groupCat === k ? '' : k); setSize('') }}>{k}</Pill>)}
          </div>
        )}
        {sizes && sizes.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#bbb', marginRight: '2px' }}>Stærð:</span>
            {sizes.map(s => <Pill key={s} active={size === s} onClick={() => setSize(size === s ? '' : s)}>{s}</Pill>)}
          </div>
        )}
      </div>

      {/* Mobile filter button */}
      <div className="mobile-filters" style={{ display: 'none', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setFilterDrawerOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', border: '1px solid #e5e5e5', background: hasFilters ? '#111' : '#fff', color: hasFilters ? '#fff' : '#111', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
          Sía {filterCount > 0 && <span style={{ background: hasFilters ? '#fff' : '#111', color: hasFilters ? '#111' : '#fff', borderRadius: '10px', padding: '0 6px', fontSize: '11px', fontWeight: '700' }}>{filterCount}</span>}
        </button>
        {sort !== 'Nýjast' && <span style={{ padding: '8px 12px', borderRadius: '20px', background: '#111', color: '#fff', fontSize: '13px' }}>{sort}</span>}
        {mainCat && <span style={{ padding: '8px 12px', borderRadius: '20px', background: '#111', color: '#fff', fontSize: '13px' }}>{CATEGORIES[mainCat]?.icon} {mainCat}</span>}
      </div>

      {/* Mobile filter drawer */}
      {filterDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setFilterDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 20px 40px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '600' }}>Síur</h2>
              <button onClick={() => setFilterDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}>✕</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Röðun</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SORT_OPTIONS.map(o => <Pill key={o} active={sort === o} onClick={() => setSort(o)}>{o}</Pill>)}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flokkur</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Pill active={!mainCat} onClick={() => { setMainCat(''); setSubCat(''); setGroupCat(''); setSize('') }}>Allt</Pill>
                {Object.entries(CATEGORIES).map(([name, data]) => (
                  <Pill key={name} active={mainCat === name} onClick={() => { setMainCat(mainCat === name ? '' : name); setSubCat(''); setGroupCat(''); setSize('') }}>
                    {data.icon} {name}
                  </Pill>
                ))}
              </div>
            </div>
            {subKeys.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Undirflokkur</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {subKeys.map(k => <Pill key={k} active={subCat === k} onClick={() => { setSubCat(subCat === k ? '' : k); setGroupCat(''); setSize('') }}>{k}</Pill>)}
                </div>
              </div>
            )}
            {groupKeys.length > 0 && subCat && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tegund</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {groupKeys.map(k => <Pill key={k} active={groupCat === k} onClick={() => { setGroupCat(groupCat === k ? '' : k); setSize('') }}>{k}</Pill>)}
                </div>
              </div>
            )}
            {sizes && sizes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stærð</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sizes.map(s => <Pill key={s} active={size === s} onClick={() => setSize(size === s ? '' : s)}>{s}</Pill>)}
                </div>
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staðsetning</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Pill active={!location} onClick={() => setLocation('')}>Allar</Pill>
                {LOCATIONS.map(l => <Pill key={l} active={location === l} onClick={() => setLocation(l)}>{l}</Pill>)}
              </div>
            </div>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verð</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="number" placeholder="Lágmark kr." value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ flex: 1, padding: '10px 14px', fontSize: '14px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none' }} />
                <span style={{ color: '#aaa' }}>–</span>
                <input type="number" placeholder="Hámark kr." value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ flex: 1, padding: '10px 14px', fontSize: '14px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {hasFilters && (
                <button onClick={() => { clearAll(); }} style={{ flex: 1, padding: '13px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', color: '#666' }}>Hreinsa síu</button>
              )}
              <button onClick={() => setFilterDrawerOpen(false)} style={{ flex: 2, padding: '13px', background: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Sýna niðurstöður {listings.length > 0 && '(' + listings.length + ')'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && search && (
        <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          {listings.length === 80 ? '80+' : listings.length} {listings.length === 1 ? 'vara' : 'vörur'} fundust fyrir &ldquo;{search}&rdquo;
        </p>
      )}

      {loading ? (
        <div className="listing-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
              <div style={{ width: '100%', aspectRatio: '3 / 4', background: '#eee', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ height: '14px', background: '#eee', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: '16px', background: '#eee', borderRadius: '4px', width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
      ) : isFirstVisit ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px' }}>Velkomin á Torget</h2>
          <p style={{ color: '#666', fontSize: '15px', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>Kauptu og seldu notaðar vörur á Íslandi. Vertu fyrstur til að birta auglýsingu!</p>
          <Link href={user ? '/listings/new' : '/auth'} style={{ background: '#111', color: '#fff', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
            {user ? '+ Birta fyrstu auglýsinguna' : 'Byrja að selja'}
          </Link>
        </div>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
          <div style={{ marginBottom: '12px' }}>Engar vörur fundust</div>
          {hasFilters && <button onClick={clearAll} style={{ fontSize: '13px', color: '#111', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Hreinsa síur</button>}
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map(listing => (
            <Link key={listing.id} href={'/listings/' + listing.id} className="listing-card">
              <div className="listing-img">
                {listing.images
                  ? <img src={listing.images.split(',')[0]} alt={listing.title} />
                  : <span style={{ fontSize: '32px' }}>📦</span>
                }
              </div>
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ fontWeight: '500', fontSize: '13px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '3px' }}>{listing.price.toLocaleString('is-IS')} kr.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '600', color: '#555', flexShrink: 0 }}>
                    {listing.profiles?.avatar_url
                      ? <img src={listing.profiles.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : listing.profiles?.name?.[0]?.toUpperCase()
                    }
                  </div>
                  <div style={{ fontSize: '11px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.profiles?.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .listing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 900px) { .listing-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .desktop-filters { display: none !important; }
          .mobile-filters { display: flex !important; }
          .listing-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px; }
        }
        .listing-card {
          text-decoration: none;
          color: inherit;
          display: block;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e5e5e5;
        }
        .listing-img {
          width: 100%;
          aspect-ratio: 3 / 4;
          background: #f0f0f0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .listing-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div>}>
      <HomeContent />
    </Suspense>
  )
}