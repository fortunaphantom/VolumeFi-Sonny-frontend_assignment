import { FACTORY_ADDRESS, ROUTER_ADDRESS, RPC_URL, WETH_ADDRESS } from 'config';
import { Contract, ethers, Signer } from 'ethers';
import { tTokenInput } from 'typed/tTokenInput';

const ROUTER = require('abi/IUniswapV2Router02.json');
const ERC20 = require('abi/ERC20.json');
const FACTORY = require('abi/IUniswapV2Factory.json');
const PAIR = require('abi/IUniswapV2Pair.json');

export const swapTokens = async (
  srcToken: tTokenInput,
  destToken: tTokenInput,
  amount: string,
  signer: Signer,
  account: string
) => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const routerContract = new Contract(ROUTER_ADDRESS, ROUTER.abi, signer);

  const tokens = [srcToken.address, destToken.address];
  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

  const srcContract = new Contract(srcToken.address, ERC20.abi, signer);
  const srcDecimals = await srcContract.decimals();

  const amountIn = ethers.utils.parseUnits(amount, srcDecimals);
  const amountOut = await routerContract.callStatic.getAmountsOut(
    amountIn,
    tokens
  );
  const wethAddress = await routerContract.WETH();

  if (srcToken.address.toLowerCase() === wethAddress.toLowerCase()) {
    // ETH -> Token
    const tx = await routerContract.swapExactETHForTokens(
      amountOut[1],
      tokens,
      account,
      deadline,
      { value: amountIn }
    );
    return tx;
  } else if (destToken.address.toLowerCase() === wethAddress.toLowerCase()) {
    // Token -> ETH
    const approveTx = await srcContract.approve(
      routerContract.address,
      amountIn
    );
    await approveTx.wait();
    const tx = await routerContract.swapExactTokensForETH(
      amountIn,
      amountOut[1],
      tokens,
      account,
      deadline
    );
    return tx;
  }
};

export const getAmountOut = async (
  address1: string,
  address2: string,
  amountIn: string
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const routerContract = new Contract(ROUTER_ADDRESS, ROUTER.abi, provider);

    const token1 = new Contract(address1, ERC20.abi, provider);
    const token1Decimals = await token1.decimals();

    const token2 = new Contract(address2, ERC20.abi, provider);
    const token2Decimals = await token2.decimals();


    const amountWei = ethers.utils.parseUnits(String(amountIn), token1Decimals);
    const values_out = await routerContract.getAmountsOut(amountWei, [
      address1,
      address2
    ]);

    console.log({values_out});
    const amount_out = values_out[1] * 10 ** -token2Decimals;
    return Math.round(amount_out * 1000000) / 1000000;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};
