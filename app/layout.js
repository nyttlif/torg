import './globals.css'
import Footer from './components/Footer'

export const metadata = {
  title: 'Torg',
  description: 'Kauptu og seldu á Torg',
}

export default function RootLayout({ children }) {
  return (
    <html lang="is">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}