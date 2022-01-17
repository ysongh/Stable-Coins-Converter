import React from 'react';
import { Segment } from 'semantic-ui-react';

function Footer() {
  return (
    <Segment inverted color='violet'>
      <p style={{ textAlign: 'center', padding: '1.5rem 0'}}>Copyright &copy; 2021 Stable Coins Converter</p>
    </Segment>
  )
}

export default Footer;