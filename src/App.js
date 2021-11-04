import React, { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal'

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
