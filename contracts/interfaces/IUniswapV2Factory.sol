// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IUniswapV2Factory {
    
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}