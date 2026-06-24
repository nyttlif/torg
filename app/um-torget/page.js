'use client'

import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function UmTorget() {
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Um Torget</h1>
        <p style={{ fontSize: '15px', color: '#888', marginBottom: '48px' }}>Allt sem þú þarft að vita til að kaupa og selja á Torget.</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Hvað er Torget?</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#444' }}>
            Torget er íslenskt markaðstorg þar sem þú getur keypt og selt notaðar vörur. Hér getur þú fundið allt frá fatnaði og skóm til húsgagna, raftækja og listverka.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Hvernig sel ég?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { n: '1', title: 'Stofnaðu aðgang', text: 'Smelltu á „+ Selja" og skráðu þig inn eða stofnaðu aðgang.' },
              { n: '2', title: 'Settu upp auglýsingu', text: 'Bættu við myndum, lýsingu, verði og flokki. Því nákvæmari sem þú ert, því meiri líkur eru á að vara þín selst fljótt.' },
              { n: '3', title: 'Bíddu eftir kaupanda', text: 'Þegar kaupandi hefur samband færðu skilaboð. Þið getið samið um verð og afhendingu.' },
              { n: '4', title: 'Ljúktu sölunni', text: 'Komist þið saman, merktu vöruna sem selda og hittist til afhendingar.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Hvernig kaupi ég?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { n: '1', title: 'Finndu vöruna þína', text: 'Notaðu leitina eða flettu í gegnum flokka til að finna það sem þig vantar.' },
              { n: '2', title: 'Hafðu samband við seljanda', text: 'Smelltu á „Hafa samband" á vörusíðunni til að hefja samtal.' },
              { n: '3', title: 'Komðu sér saman', text: 'Samið um verð og afhendingu beint í skilaboðunum.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Öryggi og traust</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#444' }}>
            Við mælum með að hittast á opinberum stað við afhendingu og greiða með reiðufé eða millifærslu eftir að þú hefur séð vöruna. Ef eitthvað líður ekki vel, getur þú tilkynnt vöru eða notanda.
          </p>
        </section>

        <section style={{ background: '#f5f5f5', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Ertu tilbúinn?</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>Byrjaðu að selja eða kaupa í dag.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/listings/new" style={{ background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>+ Selja vöru</Link>
            <Link href="/" style={{ background: '#fff', color: '#111', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', border: '1px solid #e5e5e5' }}>Skoða vörur</Link>
          </div>
        </section>
      </div>
    </div>
  )
}