# VolumeFi-Sonny-frontend_assignment

## Project description
Token swap program that interacts with UniSwap in Goerli

## How to install
- `yarn install`
- `yarn dev`

## Solutions
- I used wagmi (https://wagmi.sh/) for wallet integration. Wagmi supports many useful hooks. I used `useBalance`, and `useContractRead` hooks to watch the balances of ETH, and Token in the connected wallet.  
Otherwise, we have to set timer and get the balances regularly. This is not good for code practise.
- One of the problems in Next.js is hydration issues. It happens often when the rendering depends on the hook varibles. I used many wagmi hooks, and met these hydration issues. I wrapped these variables with `useState`.
- I didn't use `window.ethereum` because it only works in the browser extension wallets. In the production version, we have to support mobile walets and wallet-connect, and `window.ethereum` will not work in thoese cases.

