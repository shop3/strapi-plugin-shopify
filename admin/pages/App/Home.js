import React, {useState, useEffect, PureComponent} from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';
import Chart from '../../components/Chart'
const Home = () => {

  const data = [
    {
      date: 'Mar 1',
      installedShop: 5,
      uninstalledShop: 2,
      increasedRevenue: 2400,
      decreasedRevenue: 300
    },
    {
      date: 'Mar 2',
      installedShop: 7,
      uninstalledShop: 3,
      increasedRevenue: 3500,
      decreasedRevenue: 400,
    },
    {
      date: 'Mar 3',
      installedShop: 9,
      uninstalledShop: 2,
      increasedRevenue: 5000,
      decreasedRevenue: 200,
    },
    {
      date: 'Mar 4',
      installedShop: 7,
      uninstalledShop: 1,
      increasedRevenue: 4000,
      decreasedRevenue: 300,
    },
    {
      date: 'Mar 5',
      installedShop: 9,
      uninstalledShop: 1,
      increasedRevenue: 5000,
      decreasedRevenue: 500,
    },
    {
      date: 'Mar 6',
      installedShop: 10,
      uninstalledShop: 2,
      increasedRevenue: 5000,
      decreasedRevenue: 300,
    },
    {
      date: 'Mar 7',
      installedShop: 9,
      uninstalledShop: 3,
      increasedRevenue: 4500,
      decreasedRevenue: 200,
    },
  ];
  
  return (
    <Box width="100%" height="100vh" padding={4} overflow="auto">
      <Flex direction="column" gap={4} alignItems="left">
        <Typography variant="alpha">Welcome</Typography>
        <Box>
          <Flex direction="row" gap={5}>
            <Box width="50%">
              <Chart data={data} title="Monthly increased shop" type="installedShop" />
            </Box>
            <Box width="50%">
              <Chart data={data} title="Monthly decreased shop" type="uninstalledShop" />
            </Box>
          </Flex>
        </Box>
        <Box>
          <Flex direction="row" gap={5}>
            <Box width="50%">
              <Chart data={data} title="Monthly increased revenue" type="increasedRevenue" />
            </Box>
            <Box width="50%">
              <Chart data={data} title="Monthly decreased revenue" type="decreasedRevenue" />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;