import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Skilmálar — Torget',
}

export default function TermsPage() {
  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px' }}>Skilmálar</h1>
        <p style={{ fontSize: '14px', color: '#999', marginBottom: '40px' }}>Síðast uppfært: Júní 2026</p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>1. Um Torget</h2>
          <p style={p}>Torget er íslenskt kaup- og sölumarkaðstorg þar sem einstaklingar geta auglýst notaðar vörur til sölu. Torget er ekki aðili að viðskiptum milli kaupanda og seljanda og ber ekki ábyrgð á gæðum, ástandi eða afhendingu vara.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>2. Skráning</h2>
          <p style={p}>Til að nota Torget þarf notandi að vera að minnsta kosti 18 ára. Með skráningu staðfestir notandi að upplýsingar sem gefnar eru upp séu réttar og nákvæmar.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>3. Auglýsingar</h2>
          <p style={p}>Seljendur bera fulla ábyrgð á nákvæmni lýsinga og mynda. Auglýsingar mega ekki innihalda ólöglegar vörur, hættuleg efni, fölsuð vörumerki eða efni sem brýtur gegn réttindum þriðja aðila. Torget áskilur sér rétt til að fjarlægja auglýsingar án fyrirvara.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>4. Viðskipti</h2>
          <p style={p}>Kaupandi og seljandi semja um verð, greiðslumáta og afhendingu sín á milli. Torget tekur ekki þátt í greiðslum eða afhendingu vara á þessum tíma. Notendur eru hvattir til að hittast á opinberum stöðum við afhendingu og ganga úr skugga um ástand vöru áður en greitt er.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>5. Hegðun notenda</h2>
          <p style={p}>Notendum er óheimilt að nota Torget í sviksamlegum tilgangi, til þvagáreitis eða til að dreifa óviðeigandi efni. Brot geta leitt til lokunar á aðgangi.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>6. Persónuvernd</h2>
          <p style={p}>Torget safnar lágmarksupplýsingum sem nauðsynlegar eru til að reka þjónustuna — netfang og notendaprófíll. Upplýsingar eru ekki seldar þriðja aðila. Með því að nota Torget samþykkir notandi þessa persónuverndarstefnu.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>7. Ábyrgðartakmörkun</h2>
          <p style={p}>Torget er veitt eins og það er án nokkurrar ábyrgðar. Torget ber ekki ábyrgð á tjóni sem hlýst af viðskiptum milli notenda, villum í auglýsingum eða truflun á þjónustu.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>8. Breytingar á skilmálum</h2>
          <p style={p}>Torget áskilur sér rétt til að breyta skilmálum hvenær sem er. Notendur verða tilkynntir um verulegar breytingar með tölvupósti eða tilkynningu á vefnum.</p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={h2}>9. Samband</h2>
          <p style={p}>Spurningar eða athugasemdir sendist á <a href="mailto:hallo@torget.is" style={{ color: '#111' }}>hallo@torget.is</a></p>
        </section>
      </div>
    </div>
  )
}

const h2 = { fontSize: '16px', fontWeight: '600', marginBottom: '10px', color: '#111' }
const p = { fontSize: '15px', lineHeight: '1.8', color: '#444', margin: 0 }