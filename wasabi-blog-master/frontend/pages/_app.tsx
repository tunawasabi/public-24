import Head from 'next/head';
import type { AppProps } from 'next/app'
import '../styles/globals.css';
import Footer from '../components/Footer';
import { SessionProvider } from 'next-auth/react';
import { strongFont, textFont, codeFont } from '../src/lib/fonts'
import Link from 'next/link';

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const fontVariables = `${strongFont.variable} ${textFont.variable} ${codeFont.variable}`;

  // ページヘッダ
  const Header = () => {
    return <header className="flex h-12 text-neutral-900 dark:text-white">
      <div className="bg-gradient-to-r from-blue-600 to-violet-700 transition hover:opacity-80 text-xl text-white">
        <Link href="/" className="flex items-center justify-center h-full w-full px-8 gap-2 font-sans font-black">
          とれいと魔術書
        </Link>
      </div>
      <Link href="/tag" className="ml-auto flex items-center justify-center px-4 gap-2 transition hover:opacity-50">
        タグ一覧
      </Link>
    </header>
  }

  return (
    <SessionProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="コンピュータとネットの話が詰まった魔術の書" />
        <meta property="og:site_name" content="とれいと魔術書" />
      </Head>
      <div className={`${fontVariables} font-honbun`}>
        <Header />
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </SessionProvider>
  )
}

export default MyApp
