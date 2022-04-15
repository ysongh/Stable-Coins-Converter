import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Container, Form, Card, Input, List, Divider, Message, Button, Icon } from 'semantic-ui-react';

import Spinner from '../components/common/Spinner';

function SendForm({ walletAddress, swapContract }) {
  const [daiAmount, setDaiAmount] = useState('');
  const [ethValue, setEthValue] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [transactionHash, setTransactionHash] = useState('');
  const [showMessage, setShowMessage] = useState(true);
  const [loading, setLoading] = useState(false);

  const addAddressToList = () => {
    setAddressList([...addressList, recipientAddress]);
    setRecipientAddress('');
  }

  const findETHAmountNeeded = async value => {
    try{
      setDaiAmount(value);
    
      if(!walletAddress) return;
      if(!value) {
        setEthValue(0);
        return;
      }
  
      const requiredEth = await swapContract.callStatic.getEstimatedETHforDAI(ethers.utils.parseUnits(value, 'ether'));
      const sendEth = +(requiredEth.toString()) * 1.1;
      console.log(sendEth)
      setEthValue(ethers.utils.formatUnits(sendEth.toString(), 'ether'));
    } catch(err) {
      console.error(err);
    }
    
  }

  const convertAndSend = async () => {
    try{
      setLoading(true);
      
      const ethToWei = ethers.utils.parseUnits(ethValue, 'ether');
      const daiToWei = ethers.utils.parseUnits(daiAmount, 'ether');

      const transaction = await swapContract.convertEthToExactDai(addressList, addressList.length, daiToWei, {
        value: ethToWei
      });
      const tx = await transaction.wait();

      console.log(tx);
      setLoading(false);
      setTransactionHash(tx.transactionHash);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  }

  const handleDismiss = () => {
    setShowMessage(false);
  }

  return (
    <Container style={{ minHeight: '68.5vh' }}>
      {showMessage && <Message
        color='teal'
        onDismiss={handleDismiss}
        header='Contract is deployed on Kovan Test Network'
      />}
      <Card centered className="form-card">
        <Message
          attached
          color="pink"
          header='Convert ETH to DAI and send to other'
        />
        <Card.Content>
          <Form>
            <Form.Field>
              <label>Addresses to send converted DAI to *</label>
              <Input
                value={recipientAddress}
                placeholder="address"
                onChange={(e) => setRecipientAddress(e.target.value)}>
                   <input />
                  <Button
                    icon
                    onClick={addAddressToList}
                    color='violet'
                    disabled={!recipientAddress.length}>
                      <Icon name='add' />
                  </Button>
              </Input> 
            </Form.Field>

            <List>
              {addressList.map(address => (
                <List.Item>
                  <List.Icon name='user' />
                  <List.Content>{address}</List.Content>
                </List.Item>
              ))}
            </List>

            <Form.Field>
              <label>Amount of DAI to receive *</label>
              <Input>
                <input value={daiAmount} onChange={(e) => findETHAmountNeeded(e.target.value)} />
              </Input>
            </Form.Field>

            <Divider />

            {walletAddress
              ? 
                <div className="btnandprice">
                  <Button
                    type='submit'
                    size='large'
                    color='pink'
                    onClick={convertAndSend}
                  >
                    Swap and Send
                  </Button>
                  <div className="btnandprice__labels">
                    <p>{(+ethValue).toFixed(5)} ETH required</p>
                    <p>{(daiAmount / addressList.length) || 0} DAI each addresses</p>
                  </div>
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
