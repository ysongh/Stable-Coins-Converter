import React from 'react';
import { Segment, Container, Menu, Button } from 'semantic-ui-react';

function Navbar({ walletAddress, connectWallet }) {
  return (
    <Segment inverted>
      <Container>
        <Menu inverted secondary>
          <Menu.Item
            to='/'
            name='Stable Coins Converter'
          />
          {walletAddress ? (
              <Menu.Menu position='right'>
                <Menu.Item>
                  <p>{walletAddress.substring(0,8)}...{walletAddress.substring(34,42)}</p>
                </Menu.Item>
              </Menu.Menu>
            ) : (
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Button color='green' onClick={connectWallet}>Open Wallet</Button>
                </Menu.Item>
              </Menu.Menu>
            )}
        </Menu>
      </Container>
    </Segment>

  );
}

export default Navbar;