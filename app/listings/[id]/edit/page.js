'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, CONDITIONS, COLORS, LOCATIONS, SIZES_BY_TYPE, getCategoryPath } from '@/lib/categories'

export default function EditListing() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState('')
  const [location, setLocation] = useState('')
  const [mainCat, setMainCat] = useState('')
  const [subCat, setSubCat] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const dragItem = useRef(null)
  const dragTarget = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      fetchListing(session.user.id)
    })
  }, [id])

  const fetchListing = async (uid) => {
    const { data } = await supabase.from('listings').select('*').eq('id', id).single()
    if (!data || data.user_id !== uid) { router.push('/'); return }
    setTitle(data.title || '')
    setDescription(data.description || '')
    setPrice(data.price?.toString() || '')
    setBrand(data.brand || '')
    setColor(data.color || '')
    setSize(data.size || '')
    setCondition(data.condition || '')
    setLocation(data.location || LOCATIONS[0])
    setMainCat(data.category || '')
    setSubCat(data.subcategory || '')
    setImages(data.images ? data.images.split(',').filter(Boolean).map(url => ({ id: Math.random().toString(36).slice(2), url, preview: url, uploading: false })) : [])
    setLoading(false)
  }

  const processFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    setUploading(true)
    const newImages = valid.map(f => ({ id: Math.random().toString(36).slice(2), preview: URL.createObjectURL(f), url: null, uploading: true }))
    setImages(prev => [...prev, ...newImages])
    for (let i = 0; i < valid.length; i++) {
      const file = valid[i]
      const id2 = newImages[i].id
      const ext = file.name.split('.').pop()
      const path = Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext
      const { error } = await supabase.storage.from('listings').upload(path, file, { contentType: file.type })
      if (!error) {
        const { data } = supabase.storage.from('listings').getPublicUrl(path)
        setImages(prev => prev.map(img => img.id === id2 ? { ...img, url: data.publicUrl, uploading: false } : img))
      } else {
        setImages(prev => prev.filter(img => img.id !== id2))
      }
    }
    setUploading(false)
  }

  const removeImage = (imgId) => setImages(prev => prev.filter(img => img.id !== imgId))
  const onDragStartImg = (i) => { dragItem.current = i }
  const onDragEnterImg = (i) => { dragTarget.current = i }
  const onDragEndImg = () => {
    const from = dragItem.current; const to = dragTarget.current
    if (from !== null && to !== null && from !== to) {
      setImages(prev => { const next = [...prev]; const moved = next.splice(from, 1)[0]; next.splice(to, 0, moved); return next })
    }
    dragItem.current = null; dragTarget.current = null
  }

  const save = async () => {
    setError('')
    if (!title.trim()) { setError('Titill vantar'); return }
    if (!price) { setError('Verð vantar'); return }
    if (images.length === 0) { setError('Að minnsta kosti ein mynd þarf að fylgja'); return }
    if (images.some(i => i.uploading)) { setError('Bíddu eftir að myndir hlaðist upp'); return }
    setSaving(true)
    const { error } = await supabase.from('listings').update({
      title: title.trim(), description: description.trim(),
      price: parseInt(price), category: mainCat, subcategory: subCat,
      category_path: getCategoryPath(mainCat, subCat, '', ''),
      condition, location, brand: brand.trim(), color, size,
      images: images.map(i => i.url).join(',')
    }).eq('id', id)
    if (error) { setError(error.message); setSaving(false); return }
    router.push('/listings/' + id)
  }

  const deleteListing = async () => {
    if (!confirm('Ertu viss um að þú viljir eyða þessari auglýsingu?')) return
    await supabase.from('listings').delete().eq('id', id)
    router.push('/')
  }

  const catData = mainCat ? CATEGORIES[mainCat] : null
  const subKeys = catData ? Object.keys(catData.subcategories) : []
  const showSize = mainCat === 'Föt og fatnaður' || mainCat === 'Skór og fylgihlutir'
  const sizes = subCat && SIZES_BY_TYPE[subCat] ? SIZES_BY_TYPE[subCat] : SIZES_BY_TYPE['default']
  const anyUploading = images.some(i => i.uploading)

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '600' }}>Breyta auglýsingu</h1>
          <button onClick={deleteListing} style={{ fontSize: '13px', color: '#dc2626', background: 'none', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>
            Eyða
          </button>
        </div>

        {/* Images */}
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Myndir</label>
          <div style={{ border: '2px dashed #e0e0e0', borderRadius: '12px', padding: '20px', background: '#fafafa', minHeight: '80px' }}>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {images.map((img, i) => (
                  <div key={img.id} draggable onDragStart={() => onDragStartImg(i)} onDragEnter={() => onDragEnterImg(i)} onDragEnd={onDragEndImg} onDragOver={e => e.preventDefault()} style={{ position: 'relative', width: '96px', height: '128px', cursor: 'grab', flexShrink: 0 }}>
                    <img src={img.preview} alt="" style={{ width: '96px', height: '128px', objectFit: 'cover', borderRadius: '8px', border: i === 0 ? '2px solid #111' : '1px solid #e5e5e5', opacity: img.uploading ? 0.5 : 1, display: 'block' }} />
                    {i === 0 && <div style={{ position: 'absolute', bottom: '5px', left: '5px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', padding: '2px 5px', borderRadius: '3px' }}>Forsíða</div>}
                    <button onClick={() => removeImage(img.id)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#111', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: images.length > 0 ? '4px 0 0' : '16px 0' }}>
              <div style={{ fontSize: '24px' }}>+</div>
              <div style={{ fontSize: '13px', color: '#555' }}>Bæta við myndum</div>
              <input type="file" accept="image/*" multiple onChange={e => processFiles(e.target.files)} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Flokkur</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', marginBottom: '10px' }}>
            {Object.entries(CATEGORIES).map(([name, data]) => (
              <button key={name} onClick={() => { setMainCat(name); setSubCat('') }}
                style={{ padding: '10px 8px', borderRadius: '8px', border: '1px solid ' + (mainCat === name ? '#111' : '#e5e5e5'), background: mainCat === name ? '#111' : '#fff', color: mainCat === name ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{data.icon}</span> {name}
              </button>
            ))}
          </div>
          {subKeys.length > 0 && (
            <select value={subCat} onChange={e => setSubCat(e.target.value)} style={inputStyle}>
              <option value="">Velja undirflokk...</option>
              {subKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Titill</label>
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={80} style={inputStyle} />
          <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'right', marginTop: '3px' }}>{title.length}/80</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Lýsing</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Ástand</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {CONDITIONS.map(c => (
              <button key={c.value} onClick={() => setCondition(c.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid ' + (condition === c.value ? '#111' : '#e5e5e5'), background: condition === c.value ? '#111' : '#fff', color: condition === c.value ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Vörumerki</label>
          <input value={brand} onChange={e => setBrand(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showSize ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Litur</label>
            <select value={color} onChange={e => setColor(e.target.value)} style={inputStyle}>
              <option value="">Velja lit...</option>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {showSize && (
            <div>
              <label style={labelStyle}>Stærð</label>
              <select value={size} onChange={e => setSize(e.target.value)} style={inputStyle}>
                <option value="">Velja stærð...</option>
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div>
            <label style={labelStyle}>Verð</label>
            <div style={{ position: 'relative' }}>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" style={{ ...inputStyle, paddingRight: '44px' }} />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '13px', pointerEvents: 'none' }}>kr.</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Staðsetning</label>
            <select value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>{error}</div>}

        <button onClick={save} disabled={saving || anyUploading}
          style={{ width: '100%', background: saving || anyUploading ? '#999' : '#111', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: saving || anyUploading ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Augnablik...' : 'Vista breytingar'}
        </button>
      </div>
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#111' }
const inputStyle = { width: '100%', padding: '11px 14px', fontSize: '15px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111' }