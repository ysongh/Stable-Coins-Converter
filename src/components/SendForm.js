import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Container, Form, Card, Input, Button } from 'semantic-ui-react';

import Spinner from '../components/common/Spinner';

function SendForm({ walletAddress, swapContract }) {
  const [daiAmount, setDaiAmount] = useState('');
  const [ethValue, setEthValue] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);

  const addAddressToList = () => {
    setAddressList([...addressList, recipientAddress]);
    setRecipientAddress('');
  }

  const findETHAmountNeeded = async value => {
    setDaiAmount(value);
    
    if(!walletAddress) return;
    if(!value) {
      setEthValue(0);
      return;
    }

    const requiredEth = await swapContract.callStatic.getEstimatedETHforDAI(ethers.utils.parseUnits(value, 'ether'));
    setEthValue(ethers.utils.formatUnits(requiredEth.toString(), 'ether'));
  }

  const convertAndSend = async () => {
    try{
      setLoading(true);

      let value = ethers.utils.parseUnits(ethValue, 'ether');
      console.log(ethValue.toString());

      let transaction = await swapContract.convertExactEthToDai(addressList, addressList.length , {
        value: value
      });
      let tx = await transaction.wait();

      console.log(tx);
      setLoading(false);
      setTransactionHash(tx.transactionHash);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <Container>
      <Card centered style={{ width: '600px'}}>
        <Card.Content>
          <h2>Convert to DAI and send</h2>
          <Form>
            <Form.Field>
              <label>Amount to get (In DAI) *</label>
              <Input>
                <input text="number" value={daiAmount} onChange={(e) => findETHAmountNeeded(e.target.value)} />
              </Input>
            </Form.Field>

            <Form.Field>
              <label>Address *</label>
              <Input
                value={recipientAddress}
                placeholder="address"
                onChange={(e) => setRecipientAddress(e.target.value)}>
                   <input />
                  <Button onClick={addAddressToList}>Add</Button>
              </Input> 
            </Form.Field>

            {addressList.map(address => <p>{address}</p>)}

            {walletAddress
              ? 
                <div className="btnandprice">
                  <Button
                    type='submit'
                    onClick={convertAndSend}
                  >
                    Send
                  </Button>
                  <p>{(+ethValue).toFixed(5)} ETH required</p>
                </div>
              : <p>Connect to your wallet</p>
            }
          </Form>

          {transactionHash &&
            <p className="transactionHash">
              Success, see transaction {" "}
              <a href={`https://kovan.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                {transactionHash.substring(0, 10) + '...' + transactionHash.substring(56, 66)}
              </a>
            </p>
          }

        {loading && <Spinner text="Converting and Sending..." />}
        </Card.Content>
      </Card>
    </Container>
  )
}

export default SendForm;
