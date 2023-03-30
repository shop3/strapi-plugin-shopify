import React, {useState} from 'react';
import { Box, Divider } from '@strapi/design-system';
import { MainNav, NavSections, NavBrand, NavLink } from '@strapi/design-system/v2';
import { NavLink as RouterNavLink } from 'react-router-dom';

const Header = () => {
const [condensed, setCondensed] = useState(false);
  return (
    <Box background="neutral100" height="100vh">
      <MainNav condensed={condensed}>
        <NavBrand workplace="Workplace" title="Shopify Dashboard" as={RouterNavLink} exact to="/plugins/shopify" />
        <Divider />
        <NavSections>
          <NavLink as={RouterNavLink} activeClassName="active" exact to="/plugins/shopify/Plan">
            Plan
          </NavLink>
        </NavSections>
      </MainNav>
    </Box>
  );
};
export default Header;