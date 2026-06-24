'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [visible, setVisible] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('torget_seen_about')
    if (!seen) {
      setShowAbout(true)
      localStorage.setItem('torget_seen_about', '1')
    }
  }, [])

  const linkStyle = {
    fontSize: '13px',
    color: '#999',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  return (
    <>
      {/* Trigger zone — invisible strip at bottom of screen */}
      <div
        onMouseEnter={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '16px',
          zIndex: 99,
        }}
      />

      {/* Footer */}
      <footer
        onMouseLeave={() => setVisible(false)}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e5e5e5',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.2s ease',
        }}
      >
        <span style={{ fontSize: '13px', color: '#999' }}>© 2026 Torget</span>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setShowAbout(true)} style={linkStyle}>
            Um Torget
          </button>
          <Link href="/skilmalar" style={linkStyle}>Skilmálar</Link>
          <a href="mailto:hallo@torget.is" style={linkStyle}>hallo@torget.is</a>
        </div>
      </footer>

      {/* Um Torget popup */}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '40px 32px',
              width: '90%',
              maxWidth: '440px',
              position: 'relative',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <button
              onClick={() => setShowAbout(false)}
              aria-label="Loka"
              style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: '#999',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '22px', fontWeight: 700, textAlign: 'center', margin: '0 0 20px', color: '#000' }}>
              Um Torget
            </h2>

            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', lineHeight: 1.6, margin: '0 0 12px' }}>
              Torget er vefsíða þar sem þú getur keypt og selt notaðar vörur á Íslandi.
            </p>
            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', lineHeight: 1.6, margin: '0 0 12px' }}>
              Seldu föt og skó, húsgögn, bækur, raftæki og margt fleira. Vertu í beinu samband við kaupendur og seljendur um land allt.
            </p>
            <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              Gefðu hlutunum þínum nýtt líf.
            </p>
          </div>
        </div>
      )}
    </>
  )
}