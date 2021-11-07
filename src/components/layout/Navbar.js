import React from 'react';
import { Segment, Container, Menu, Button } from 'semantic-ui-react';

function Navbar({ walletAddress, connectWallet }) {
  return (
    <Segment inverted color="pink">
      <Container>
        <Menu inverted secondary>
          <Menu.Item
            to='/'
            name='Stable Coins Converter'
          />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Button color='violet' onClick={connectWallet}>
                {walletAddress ? (walletAddress.substring(0,8) + "..." + walletAddress.substring(34,42)) : "Open Wallet"}
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Container>
    </Segment>

  );
}

export default Navbar;