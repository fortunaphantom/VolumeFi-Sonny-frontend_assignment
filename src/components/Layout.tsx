import { ReactNode } from 'react';
import Header from 'components/Header';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import { WagmiConfig } from 'wagmi';
import { wagmiClient } from 'services/wagmi';

interface ILayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <Head>
        <title>VolumeFi Swap</title>
        <meta name="description" content="VolumeFi Swap" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>{children}</main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </WagmiConfig>
  );
}
