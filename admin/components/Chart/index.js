import React from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';
import ArrowDown from '@strapi/icons/ArrowDown';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const Chart = ( {data, title, type} ) => {
  
  return (
    <Box background="neutral0" width="100%" padding={4} borderRadius="20px" overflow="auto">
      <Flex direction="column" alignItems="left">
        <Box>
          <Flex>
            <Typography variant="beta" fontWeight="bold" textColor="neutral600">{title}</Typography>
          </Flex>
        </Box>
        <Box width="100%">
          <Flex direction="row" justifyContent="space-between">
            <Box>
              <Flex direction="row" alignItems="baseline" gap={2}>
                <Typography variant="alpha">272</Typography>
                <Typography variant="beta" textColor="neutral400">from 325</Typography>
              </Flex>
            </Box>
            <Box>
              <Flex direction="row" alignItems="baseline" gap={2}>
                <Typography fontWeight="bold" as="button" type="button" textColor="danger500">
                  <ArrowDown />
                </Typography>
                <Typography variant="beta" textColor="danger500">3.9%</Typography>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Box width="100%" height="100%" padding={0}>
          <LineChart
            width={460}
            height={200}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={type} stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </Box>
      </Flex>
    </Box>
  );
};

export default Chart;