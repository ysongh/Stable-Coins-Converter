import React, { useState } from 'react';
import { Container, Input, Button } from 'semantic-ui-react'
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import SwapExamples from './artifacts/contracts/SwapExamples.sol/SwapExamples.json';
import Navbar from './components/layout/Navbar';
import { SWAPEXAMPLESADDRESS } from './config';

const SwapExamplesAddress = SWAPEXAMPLESADDRESS;

function App() {
  const [address, setAddress] = useState('');
  const [swapContract, setSwapContract] = useState(null);
  const [ethValue, setEthValue] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

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
    setSwapContract(contract);
  }

  const convertAndSend = async () => {
    let value = ethers.utils.parseUnits(ethValue, 'ether');
    console.log(ethValue.toString());

    let transaction = await swapContract.convertExactEthToDai(recipientAddress, {
      value: value
    });
    let tx = await transaction.wait();

    console.log(tx);
  }

  return (
    <div>
      <Navbar
        walletAddress={address}
        connectWallet={connectWallet} />
        <br />
        <Container>
          <h2>Convert to DAI and send</h2>
          <Input
            value={recipientAddress}
            placeholder="address"
            onChange={(e) => setRecipientAddress(e.target.value)} /> 
          <Input
            value={ethValue}
            placeholder="ETH"
            onChange={(e) => setEthValue(e.target.value)} /> 
          <Button
            onClick={convertAndSend}
          >
            Send
          </Button>
      </Container>
    </div>
  );
}

export default App;
