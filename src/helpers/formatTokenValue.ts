import { BigNumber, ethers } from 'ethers';

export const formatTokenValue = (
  amount: BigNumber | undefined,
  symbol: string
) => {
  if (amount) {
    const amountNumber = ethers.utils.formatEther(amount);
    const rounded = Math.round(Number(amountNumber) * 1000000) / 1000000;
    return `${rounded} ${symbol}`;
  } else {
    return `0 ${symbol}`;
  }
};
