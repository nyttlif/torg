'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, CONDITIONS, COLORS, LOCATIONS, getCategoryPath, getSizes } from '@/lib/categories'

export default function NewListing() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState('')
  const [location, setLocation] = useState(LOCATIONS[0])
  const [mainCat, setMainCat] = useState('')
  const [subCat, setSubCat] = useState('')
  const [groupCat, setGroupCat] = useState('')
  const [leafCat, setLeafCat] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const dragItem = useRef(null)
  const dragTarget = useRef(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/auth')
      else setUser(session.user)
    })
  }, [])

  const processFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    const newImages = valid.map(f => ({ id: Math.random().toString(36).slice(2), preview: URL.createObjectURL(f), url: null, uploading: true }))
    setImages(prev => [...prev, ...newImages])
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i]; const id = newImages[i].id
      const ext = file.name.split('.').pop()
      const path = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext
      const { error } = await supabase.storage.from('listings').upload(path, file, { contentType: file.type })
      if (!error) {
        const { data } = supabase.storage.from('listings').getPublicUrl(path)
        setImages(prev => prev.map(img => img.id === id ? { ...img, url: data.publicUrl, uploading: false } : img))
      } else {
        setImages(prev => prev.filter(img => img.id !== id))
      }
    }
  }

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files) }
  const removeImage = (id) => setImages(prev => prev.filter(img => img.id !== id))
  const onDragStartImg = (i) => { dragItem.current = i }
  const onDragEnterImg = (i) => { dragTarget.current = i }
  const onDragEndImg = () => {
    const from = dragItem.current; const to = dragTarget.current
    if (from !== null && to !== null && from !== to) {
      setImages(prev => { const next = [...prev]; const moved = next.splice(from, 1)[0]; next.splice(to, 0, moved); return next })
    }
    dragItem.current = null; dragTarget.current = null
  }

  const catData = mainCat ? CATEGORIES[mainCat] : null
  const subKeys = catData ? Object.keys(catData.subcategories) : []
  const groupKeys = (subCat && catData) ? Object.keys(catData.subcategories[subCat] || {}) : []
  const leafKeys = (groupCat && subCat && catData) ? (catData.subcategories[subCat][groupCat] || []) : []
  const sizes = getSizes(mainCat, subCat, groupCat)

  const submit = async () => {
    setError('')
    if (!title.trim()) { setError('Titill vantar'); return }
    if (!price) { setError('Verð vantar'); return }
    if (!mainCat) { setError('Veldu flokk'); return }
    if (!condition) { setError('Veldu ástand'); return }
    if (images.length === 0) { setError('Að minnsta kosti ein mynd þarf að fylgja'); return }
    if (images.some(i => i.uploading)) { setError('Bíddu eftir að myndir hlaðist upp'); return }
    setLoading(true)
    const { data, error } = await supabase.from('listings').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      price: parseInt(price),
      category: mainCat,
      subcategory: subCat,
      category_path: getCategoryPath(mainCat, subCat, groupCat, leafCat),
      condition, location,
      brand: brand.trim(),
      color, size,
      images: images.map(i => i.url).join(','),
      status: 'active'
    }).select().single()
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/listings/' + data.id)
  }

  const anyUploading = images.some(i => i.uploading)

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={h1}>Selja vöru</h1>

        {/* Images */}
        <div style={{ marginBottom: '28px' }}>
          <label style={label}>Myndir</label>
          <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}
            style={{ border: '2px dashed ' + (dragOver ? '#111' : '#e0e0e0'), borderRadius: '12px', padding: '20px', background: dragOver ? '#f5f5f5' : '#fafafa', minHeight: '80px' }}>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {images.map((img, i) => (
                  <div key={img.id} draggable onDragStart={() => onDragStartImg(i)} onDragEnter={() => onDragEnterImg(i)} onDragEnd={onDragEndImg} onDragOver={e => e.preventDefault()}
                    style={{ position: 'relative', width: '96px', height: '128px', cursor: 'grab', flexShrink: 0 }}>
                    <img src={img.preview} alt="" style={{ width: '96px', height: '128px', objectFit: 'cover', borderRadius: '8px', border: i === 0 ? '2px solid #111' : '1px solid #e5e5e5', opacity: img.uploading ? 0.5 : 1, display: 'block' }} />
                    {i === 0 && <div style={{ position: 'absolute', bottom: '5px', left: '5px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', padding: '2px 5px', borderRadius: '3px' }}>Forsíða</div>}
                    {img.uploading && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.4)' }}><div style={{ width: '18px', height: '18px', border: '2px solid #ddd', borderTop: '2px solid #111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>}
                    <button onClick={() => removeImage(img.id)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#111', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: images.length > 0 ? '4px 0 0' : '16px 0' }}>
              <div style={{ fontSize: '24px' }}>+</div>
              <div style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Smelltu til að velja eða dragðu myndir hingað</div>
              <input type="file" accept="image/*" multiple onChange={e => processFiles(e.target.files)} style={{ display: 'none' }} />
            </label>
          </div>
          {images.length > 1 && <p style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>Dragðu til að breyta röð · Fyrsta mynd verður forsíða</p>}
        </div>

        {/* Category cascade */}
        <div style={{ marginBottom: '24px' }}>
          <label style={label}>Flokkur</label>

          {/* Main category grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', marginBottom: subKeys.length ? '10px' : '0' }}>
            {Object.entries(CATEGORIES).map(([name, data]) => (
              <button key={name} onClick={() => { setMainCat(name); setSubCat(''); setGroupCat(''); setLeafCat(''); setSize('') }}
                style={{ padding: '10px 8px', borderRadius: '8px', border: '1px solid ' + (mainCat === name ? '#111' : '#e5e5e5'), background: mainCat === name ? '#111' : '#fff', color: mainCat === name ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {data.icon} {name}
              </button>
            ))}
          </div>

          {/* Subcategory */}
          {subKeys.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>Undirflokkur</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {subKeys.map(k => (
                  <button key={k} onClick={() => { setSubCat(k); setGroupCat(''); setLeafCat(''); setSize('') }}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (subCat === k ? '#111' : '#e5e5e5'), background: subCat === k ? '#111' : '#fff', color: subCat === k ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer' }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group */}
          {groupKeys.length > 0 && subCat && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>Tegund</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {groupKeys.map(k => (
                  <button key={k} onClick={() => { setGroupCat(k); setLeafCat(''); setSize('') }}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (groupCat === k ? '#111' : '#e5e5e5'), background: groupCat === k ? '#111' : '#fff', color: groupCat === k ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer' }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leaf */}
          {leafKeys.length > 0 && groupCat && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>Nákvæmur flokkur</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {leafKeys.map(k => (
                  <button key={k} onClick={() => setLeafCat(k)}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (leafCat === k ? '#111' : '#e5e5e5'), background: leafCat === k ? '#111' : '#fff', color: leafCat === k ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer' }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Path breadcrumb */}
          {mainCat && (
            <div style={{ fontSize: '12px', color: '#888', padding: '6px 10px', background: '#f5f5f5', borderRadius: '6px', marginTop: '6px' }}>
              {getCategoryPath(mainCat, subCat, groupCat, leafCat)}
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Titill</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="t.d. Nike Air Max 90, iPhone 13..." maxLength={80} style={input} />
          <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'right', marginTop: '3px' }}>{title.length}/80</div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Lýsing <span style={{ color: '#999', fontWeight: '400' }}>(valfrjálst)</span></label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Lýstu vörunni nánar..." rows={4} style={{ ...input, resize: 'vertical', lineHeight: '1.6' }} />
        </div>

        {/* Condition */}
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Ástand</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {CONDITIONS.map(c => (
              <button key={c.value} onClick={() => setCondition(c.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid ' + (condition === c.value ? '#111' : '#e5e5e5'), background: condition === c.value ? '#111' : '#fff', color: condition === c.value ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Vörumerki <span style={{ color: '#999', fontWeight: '400' }}>(valfrjálst)</span></label>
          <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="t.d. Nike, Apple, IKEA..." style={input} />
        </div>

        {/* Size — only for clothes and shoes */}
        {sizes && (
          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Stærð</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {sizes.map(s => (
                <button key={s} onClick={() => setSize(size === s ? '' : s)}
                  style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (size === s ? '#111' : '#e5e5e5'), background: size === s ? '#111' : '#fff', color: size === s ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', minWidth: '44px', textAlign: 'center' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color */}
        <div style={{ marginBottom: '16px' }}>
          <label style={label}>Litur <span style={{ color: '#999', fontWeight: '400' }}>(valfrjálst)</span></label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(color === c ? '' : c)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid ' + (color === c ? '#111' : '#e5e5e5'), background: color === c ? '#111' : '#fff', color: color === c ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Price + Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div>
            <label style={label}>Verð</label>
            <div style={{ position: 'relative' }}>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" min="0" style={{ ...input, paddingRight: '44px' }} />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '13px', pointerEvents: 'none' }}>kr.</span>
            </div>
          </div>
          <div>
            <label style={label}>Staðsetning</label>
            <select value={location} onChange={e => setLocation(e.target.value)} style={input}>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>{error}</div>}

        <button onClick={submit} disabled={loading || anyUploading}
          style={{ width: '100%', background: loading || anyUploading ? '#999' : '#111', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: loading || anyUploading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Augnablik...' : anyUploading ? 'Hleð upp myndum...' : 'Birta auglýsingu'}
        </button>
      </div>
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
    </div>
  )
}

const h1 = { fontSize: '22px', fontWeight: '600', marginBottom: '32px' }
const label = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#111' }
const input = { width: '100%', padding: '11px 14px', fontSize: '15px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111' }