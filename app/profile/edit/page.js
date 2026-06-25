'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { supabase } from '@/lib/supabase'
import { LOCATIONS } from '@/lib/categories'

export default function EditProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      fetchProfile(session.user.id)
    })
  }, [])

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (data) {
      setName(data.name || '')
      setBio(data.bio || '')
      setLocation(data.location || '')
      setAvatarUrl(data.avatar_url || '')
    }
    setLoading(false)
  }

  const uploadAvatar = async (file) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = 'avatars/' + user.id + '.' + ext
    const { error } = await supabase.storage.from('listings').upload(path, file, { upsert: true, contentType: file.type })
    if (!error) {
      const { data } = supabase.storage.from('listings').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
      setAvatar(URL.createObjectURL(file))
    }
    setUploading(false)
  }

  const save = async () => {
    setError('')
    if (!name.trim()) { setError('Nafn má ekki vera tómt'); return }
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      name: name.trim(),
      bio: bio.trim(),
      location,
      avatar_url: avatarUrl
    }).eq('id', user.id)
    if (error) { setError(error.message); setSaving(false); return }
    router.push('/profile/' + user.id)
  }

  if (loading) return <><Navbar /><div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>Hleður...</div></>

  const displayAvatar = avatar || avatarUrl

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '40px 20px 80px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '32px' }}>Breyta prófíl</h1>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <label style={{ cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: '#e0e0e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '700', color: '#888', border: '3px solid #fff', boxShadow: '0 0 0 2px #e5e5e5' }}>
              {displayAvatar ? (
                <img src={displayAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                name?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#111', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '2px solid #fff' }}>+</div>
            <input type="file" accept="image/*" onChange={e => e.target.files[0] && uploadAvatar(e.target.files[0])} style={{ display: 'none' }} />
          </label>
          {uploading && <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Hleð upp...</p>}
          {!uploading && <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>Smelltu til að breyta mynd</p>}
        </div>

        {/* Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Nafn</label>
          <input value={name} onChange={e => setName(e.target.value)} maxLength={50} style={inputStyle} />
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Um mig <span style={{ color: '#999', fontWeight: '400' }}>(valfrjálst)</span></label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={200} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
          <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'right', marginTop: '3px' }}>{bio.length}/200</div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '32px' }}>
          <label style={labelStyle}>Staðsetning <span style={{ color: '#999', fontWeight: '400' }}>(notað til að reikna sendingargjald)</span></label>
          <div style={{ position: 'relative' }}>
            <select value={location} onChange={e => setLocation(e.target.value)} style={{ ...inputStyle, appearance: 'none', paddingRight: '32px' }}>
              <option value="">Veldu staðsetningu</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '11px', pointerEvents: 'none' }}>▾</span>
          </div>
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', border: '1px solid #fecaca' }}>{error}</div>}

        <button onClick={save} disabled={saving || uploading}
          style={{ width: '100%', background: saving || uploading ? '#999' : '#111', color: '#fff', padding: '15px', borderRadius: '10px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: saving || uploading ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Augnablik...' : 'Vista breytingar'}
        </button>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#111' }
const inputStyle = { width: '100%', padding: '11px 14px', fontSize: '15px', border: '1px solid #e5e5e5', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111' }