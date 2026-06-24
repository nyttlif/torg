import './globals.css'
import Footer from './components/Footer'

export const metadata = {
  title: 'Torg',
  description: 'Kauptu og seldu á Torg',
  icons: { icon: '/favicon.svg' },
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