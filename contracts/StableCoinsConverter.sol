// SPDX-License-Identifier: GPL-2.0-or-later

/**
    ## Disclaimer
    These contracts are not audited.  Please review this code on your own before
    using any of the following code for production.  I will not be responsible or
    liable for all loss or damage caused from this project.
*/

pragma solidity 0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";

interface IUniswapRouter is ISwapRouter {
  function refundETH() external payable;
}

contract StableCoinsConverter {
  IUniswapRouter public uniswapRouter;
  IQuoter public quoter;
  address private multiDaiKovan;
  address private WETH9;
  IERC20 token;

  constructor(address _uniswapRouter, address _quoter, address _multiDaiKovan, address _WETH9) {
    uniswapRouter = IUniswapRouter(_uniswapRouter);
    quoter = IQuoter(_quoter);
    multiDaiKovan = _multiDaiKovan;
    WETH9 = _WETH9;
    token = IERC20(multiDaiKovan);
  }

  function convertEthToExactDai(address[] memory _recipients, uint _arrLength, uint256 daiAmount) external payable {
    require(daiAmount > 0, "Must pass non 0 DAI amount");
    require(msg.value > 0, "Must pass non 0 ETH amount");

    uint256 deadline = block.timestamp + 15;
    address tokenIn = WETH9;
    address tokenOut = multiDaiKovan;
    uint24 fee = 3000;
    address recipient = address(this);
    uint256 amountOut = daiAmount;
    uint256 amountInMaximum = msg.value;
    uint160 sqrtPriceLimitX96 = 0;
    
    ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams(
      tokenIn,
      tokenOut,
      fee,
      recipient,
      deadline,
      amountOut,
      amountInMaximum,
      sqrtPriceLimitX96
    );
    
    uniswapRouter.exactOutputSingle{ value: msg.value }(params);
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

  function getEstimatedETHforDAI(uint daiAmount) external payable returns (uint256) {
    address tokenIn = WETH9;
    address tokenOut = multiDaiKovan;
    uint24 fee = 500;
    uint160 sqrtPriceLimitX96 = 0;

    return quoter.quoteExactOutputSingle(
        tokenIn,
        tokenOut,
        fee,
        daiAmount,
        sqrtPriceLimitX96
    );
 }
  
  // important to receive ETH
  receive() payable external {}
}