import '@/styles/globals.css'
import '@/styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
