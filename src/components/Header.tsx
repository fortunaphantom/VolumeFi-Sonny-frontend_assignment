import Image from 'next/image';
import WalletConnectButton from 'components/WalletConnectButton';

export default function Header() {
  return (
    <header>
      <nav>
        <Image
          src="/assets/logo.png"
          alt="Volume Fi"
          width={110}
          height={50}
          className="logo"
        />
        <h1>Volume Fi</h1>
        <div className="wallet-connect">
          <WalletConnectButton />
        </div>
      </nav>
    </header>
  );
}
