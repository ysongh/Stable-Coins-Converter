import React, { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import StableCoinsConverter from './artifacts/contracts/StableCoinsConverter.sol/StableCoinsConverter.json';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SendForm from './components/SendForm';
import { STABLECOINSCONVERTERADDRESS } from './config';
import './App.css';

const StableCoinsConverterAddress = STABLECOINSCONVERTERADDRESS;

function App() {
  const [address, setAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [swapContract, setSwapContract] = useState(null);

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

    const balance = await signer.getBalance();
    setEthBalance(balance.toString());

    let contract = new ethers.Contract(StableCoinsConverterAddress, StableCoinsConverter.abi, signer);
    setSwapContract(contract);
  }

  return (
    <>
      <Navbar
        walletAddress={address}
        ethBalance={ethBalance}
        connectWallet={connectWallet} />

      <SendForm
        walletAddress={address}
        swapContract={swapContract}/>
      
      <Footer />
    </>
  );
}

export default App;
