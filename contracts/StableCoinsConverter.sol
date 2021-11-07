// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

interface IUniswapRouter is ISwapRouter {
  function refundETH() external payable;
}

contract StableCoinsConverter {
  IUniswapRouter public uniswapRouter;
  address private multiDaiKovan;
  address private WETH9;

  constructor(address _uniswapRouter, address _multiDaiKovan, address _WETH9) {
    uniswapRouter = IUniswapRouter(_uniswapRouter);
    multiDaiKovan = _multiDaiKovan;
    WETH9 = _WETH9;
  }

  function convertExactEthToDai(address[] memory _recipients, uint _arrLength) external payable {
    require(msg.value > 0, "Must pass non 0 ETH amount");

    uint256 deadline = block.timestamp + 15;
    address tokenIn = WETH9;
    address tokenOut = multiDaiKovan;
    uint24 fee = 3000;
    address recipient = address(this);
    uint256 amountIn = msg.value;
    uint256 amountOutMinimum = 1;
    uint160 sqrtPriceLimitX96 = 0;
    IERC20 token = IERC20(multiDaiKovan);
    
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
        tokenIn,
        tokenOut,
        fee,
        recipient,
        deadline,
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96
    );
    
    uniswapRouter.exactInputSingle{ value: msg.value }(params);
    uniswapRouter.refundETH();

    // Split DAI amount and send them to each addresses
    uint amountToSend = token.balanceOf(address(this)) / _arrLength;
    for (uint i = 0; i < _arrLength; i++) {
      token.transfer(address(_recipients[i]), amountToSend);
    }
    
    // refund leftover ETH to user
    (bool success,) = msg.sender.call{ value: address(this).balance }("");
    require(success, "refund failed");
  }
  
  // important to receive ETH
  receive() payable external {}
}