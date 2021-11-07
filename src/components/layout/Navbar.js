import React from 'react';
import { Segment, Container, Menu, Label, Icon, Button } from 'semantic-ui-react';

function Navbar({ walletAddress, ethBalance, connectWallet }) {
  return (
    <Segment inverted color="pink">
      <Container>
        <Menu inverted secondary>
          <Menu.Item>
            <img src='/logo.png' style={{ width: '10rem'}} alt="Logo" />
          </Menu.Item>
          <Menu.Menu position='right'>
            {walletAddress
              && <Menu.Item>
                    <Label circular size="large" basic color='blue'>
                      <Icon name='ethereum' /> {(ethBalance / 10 ** 18).toFixed(4)} ETH
                    </Label>
                  </Menu.Item>
            }
            <Menu.Item>
              <Button color='violet' onClick={connectWallet}>
                {walletAddress ? (walletAddress.substring(0,7) + "..." + walletAddress.substring(35,42)) : "Open Wallet"}
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Container>
    </Segment>

  );
}

export default Navbar;