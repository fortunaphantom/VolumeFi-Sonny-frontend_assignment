import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import LoadingButton from 'components/LoadingButton';
import { TokenInput } from './TokenInput';
import { getAmountOut, swapTokens } from 'services/router';

import { BLOCK_SCAN_URL, SUPPORT_TOKENS } from 'config';

import {
  useAccount,
  useProvider,
  useSigner,
  useContractRead,
  useBalance,
  erc20ABI
} from 'wagmi';
import { formatTokenValue } from 'helpers/formatTokenValue';
import { BigNumber, ethers } from 'ethers';

export function SwapBox() {
  const { address: account } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { data: ethBalance1 } = useBalance({
    address: account
  });
  const { data: tokenBalance1 } = useContractRead({
    address: SUPPORT_TOKENS[1].address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [account ?? '0x0000000000000000000000000000000000000000']
  });

  const [srcTokenIndex, setSrcTokenIndex] = useState(0);
  const [destTokenIndex, setDestTokenIndex] = useState(1);
  const [srcInput, setSrcInput] = useState('');
  const [destInput, setDestInput] = useState('');
  const [ethBalance, setEthBalance] = useState<BigNumber | undefined>();
  const [tokenBalance, setTokenBalance] = useState<BigNumber | undefined>();

  // Controls the loading button
  const [loading, setLoading] = useState(false);

  const switchSwap = () => {
    const temp = srcTokenIndex;
    setSrcTokenIndex(destTokenIndex);
    setDestTokenIndex(temp);

    const tempInput = srcInput;
    setSrcInput(destInput);
    setDestInput(tempInput);
  };

  const isButtonEnabled = () => {
    try {
      const srcTokenBalance = srcTokenIndex === 0 ? ethBalance : tokenBalance;
      const amountBN = BigNumber.from(ethers.utils.parseUnits(srcInput, 18));
      console.log({amountBN});
      return account && srcTokenBalance && amountBN.gt(BigNumber.from("0")) && amountBN.lte(srcTokenBalance)
        ? true
        : false;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  const swap = () => {
    if (!signer || !account) {
      return;
    }

    setLoading(true);
    swapTokens(SUPPORT_TOKENS[srcTokenIndex], SUPPORT_TOKENS[destTokenIndex], srcInput, signer, account)
      .then((tx) => {
        toast.info(
          <>
            <p>Transaction Sent!</p>
            <div>
              <a
                href={`${BLOCK_SCAN_URL}tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {tx.hash}
              </a>
            </div>
          </>
        );
        return tx.wait();
      })
      .then(() => {
        setLoading(false);
        toast.success('Trasaction successful!');
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
        toast.error('Exception in sending transaction');
      });
  };

  useEffect(() => setEthBalance(ethBalance1?.value), [ethBalance1?.value]);
  useEffect(() => setTokenBalance(tokenBalance1), [tokenBalance1]);

  useEffect(() => {
    if (!srcInput || srcInput != Number(srcInput).toString()) {
      setDestInput('');
      return;
    }

    setLoading(true);
    getAmountOut(SUPPORT_TOKENS[srcTokenIndex].address, SUPPORT_TOKENS[destTokenIndex].address, srcInput)
      .then((amount) => amount !== false && setDestInput(amount.toString()))
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  }, [srcInput, srcTokenIndex]); //eslint-disable-line

  return (
    <div className="token-swap">
      <h3>Swap</h3>
      <div className="input-box">
        <TokenInput
          value={srcInput}
          onChange={(e: any) => setSrcInput(e.target.value)}
          symbol={SUPPORT_TOKENS[srcTokenIndex].symbol ?? ''}
        />
        <button className="exchange-input" onClick={switchSwap}>
          <Image src="/assets/Swap.svg" alt="swap" height={32} width={32} />
        </button>
        <TokenInput
          readonly={true}
          value={destInput}
          symbol={SUPPORT_TOKENS[destTokenIndex].symbol ?? ''}
        />
      </div>
      <div className="estimation-box">
        <h4>Your Balances</h4>
        <div className="balance">
          You have {formatTokenValue(ethBalance, 'ETH')} and{' '}
          {formatTokenValue(tokenBalance, SUPPORT_TOKENS[1].symbol)}
        </div>
      </div>
      <div className="button-box">
        <LoadingButton
          loading={loading}
          valid={isButtonEnabled()}
          success={false}
          fail={false}
          onClick={swap}
        >
          Swap
        </LoadingButton>
      </div>
    </div>
  );
}
