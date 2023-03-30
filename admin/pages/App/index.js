import { Switch, Route } from 'react-router-dom'
import React from 'react';
import Header from './Header'
import Plan from './Plan'
import Home from './Home'
import { Flex } from '@strapi/design-system';

function App() {

  return (
    <Flex direction="row">
      <Header />
      <Switch>
        <Route exact path="/plugins/shopify">
          <Home />
        </Route>
        <Route exact path="/plugins/shopify/Plan">
          <Plan />
        </Route>
      </Switch>
    </Flex>
  )
}

export default App
