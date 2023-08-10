import '../styling/main.scss'
import '../styling/res.scss'
import { Inter } from 'next/font/google'
import { Open_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { Providers } from '@/store/provider'
import 'react-toastify/dist/ReactToastify.css';
import Favicon from '../../public/images/lensys-favicon.png'


const inter = Inter({ subsets: ['latin'] })
const open  = Open_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Lensys',
  description: 'Generated by create next app',
  icons: [{ rel: 'icon', url: Favicon.src }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={open.className} data-body="dc">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
