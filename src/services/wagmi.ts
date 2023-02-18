// Wagmi wallet connect modules
import { createClient, configureChains, goerli } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

// Wagmi wallet connect options
const { provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()]
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider
});
