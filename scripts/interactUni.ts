import { ethers } from 'hardhat';

async function main() {
  const uniRouter = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const unifactRouter = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  const usdc = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const dai = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const deadline = currentTimestampInSeconds + 86400;

  const tokenHolder = '0x20bB82F2Db6FF52b42c60cE79cDE4C7094Ce133F';

  const uniSwapContract = await ethers.getContractAt('IUniswap', uniRouter);
  const unifactRouterContract = await ethers.getContractAt(
    'IUniswapV2Factory',
    unifactRouter
  );
  const usdcContract = await ethers.getContractAt('IERC20', usdc);
  const daiContract = await ethers.getContractAt('IERC20', dai);
  const amountToapprove = ethers.parseEther('3');
  const amountADesired = ethers.parseEther('2');
  const amountBDesired = ethers.parseEther('2');
  const amountAMin = ethers.parseEther('0');
  const amountBMin = ethers.parseEther('0');

  const tokenHolderSigner = await ethers.getImpersonatedSigner(tokenHolder);
  const to = tokenHolderSigner;

  //approving the uniswap contract
  await usdcContract
    .connect(tokenHolderSigner)
    .approve(uniSwapContract, amountToapprove);
  await daiContract
    .connect(tokenHolderSigner)
    .approve(uniSwapContract, amountToapprove);

  //adding liquidity
  await uniSwapContract
    .connect(tokenHolderSigner)
    .addLiquidity(
      usdc,
      dai,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline
    );

  const getpair = await unifactRouterContract
    .connect(tokenHolderSigner)
    .getPair(usdc, dai);
  console.log(getpair);

  const pair = await ethers.getContractAt('IERC20', getpair);
  const pairBalance = await pair.balanceOf(tokenHolderSigner);
  console.log(pairBalance);

  // approve

  await pair.connect(tokenHolderSigner).approve(uniSwapContract, pairBalance);

  // remove lquidity
  const removeLiquid = await uniSwapContract
    .connect(tokenHolderSigner)
    .removeLiquidity(
      usdc,
      dai,
      pairBalance,
      amountAMin,
      amountBMin,
      to,
      deadline
    );

  console.log(removeLiquid);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
