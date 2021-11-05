import React, { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal'

import SwapExamples from './artifacts/contracts/SwapExamples.sol/SwapExamples.json'
import { SWAPEXAMPLESADDRESS } from './config';

const SwapExamplesAddress = SWAPEXAMPLESADDRESS;

function App() {
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);  
    console.log(provider);

    const { chainId } = await provider.getNetwork();
    console.log(chainId);

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();
    setAddress(walletAddress);

    let contract = new ethers.Contract(SwapExamplesAddress, SwapExamples.abi, signer);
    const num = await contract.test();
    console.log(num);

    let ethValue = ethers.utils.parseUnits("0.001", 'ether');
    console.log(ethValue.toString());

    let transaction = await contract.convertExactEthToDai({
      value: ethValue
    });
    let tx = await transaction.wait();

    console.log(tx);
  }

  return (
    <div>
      <h1>Stable Coins Converter</h1>
        <button
          type="primary"
          onClick={connectWallet}
        >
          {address ? address : "Connect to Wallet"}
        </button>
    </div>
  );
}

export default App;
