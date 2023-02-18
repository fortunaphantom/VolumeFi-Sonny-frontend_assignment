import { truncateAddress } from 'helpers/truncateAddress';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useAccount
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

export default function WalletConnectButton() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { address: wagmiAccount, isConnecting, isDisconnected } = useAccount();
  const [account, setAccount] = useState<string | undefined>();

  useEffect(() => setAccount(wagmiAccount), [wagmiAccount]);

  const connectWallet = async () => {
    try {
      const connector = new MetaMaskConnector({
        options: {
          shimDisconnect: true
        }
      });
      await connect({ connector });
    } catch (ex) {
      console.log(ex);
    }
  };

  const disconnectWallet = () => {
    try {
      disconnect();
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    if (chain?.id !== 5) {
      switchNetwork?.(5);
    }
  }, [chain]); //eslint-disable-line

  return (
    <button
      className={
        'wallet-connect-button ' + (account ? 'connected' : 'disconnected')
      }
      onClick={account ? disconnectWallet : connectWallet}
    >
      {account ? (
        <>
          <Image src="/assets/ETH.svg" alt="eth" height={24} width={24} />
          <label className="chain">Ethereum</label>
          <Image
            src="/assets/Connected.svg"
            alt="connected"
            height={16}
            width={16}
          />
          <label className="address">{truncateAddress(account)}</label>
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}
