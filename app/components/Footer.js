'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [visible, setVisible] = useState(false)

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
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/skilmalar" style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}>Skilmálar</Link>
          <a href="mailto:hallo@torget.is" style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}>hallo@torget.is</a>
        </div>
      </footer>
    </>
  )
}