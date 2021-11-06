import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Container, Form, Card, Input, Button } from 'semantic-ui-react';

function SendForm({ walletAddress, swapContract }) {
  const [ethValue, setEthValue] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

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
    <Container>
      <Card centered style={{ width: '600px'}}>
        <Card.Content>
          <h2>Convert to DAI and send</h2>
          <Form>
            <Form.Field>
              <label>Address *</label>
              <Input
                value={recipientAddress}
                placeholder="address"
                onChange={(e) => setRecipientAddress(e.target.value)} /> 
            </Form.Field>

            <Form.Field>
              <label>Amount *</label>
              <Input
                value={ethValue}
                placeholder="ETH"
                onChange={(e) => setEthValue(e.target.value)} /> 
            </Form.Field>
            
            {walletAddress
              ? <Button
                  type='submit'
                  onClick={convertAndSend}
                >
                  Send
                </Button>
              : <p>Connect to your wallet</p>
            }
          </Form>
        </Card.Content>
      </Card>
    </Container>
  )
}

export default SendForm;
