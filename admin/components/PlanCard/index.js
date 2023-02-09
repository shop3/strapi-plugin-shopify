import React from 'react';
import { Box, Button, Typography, Flex } from '@strapi/design-system';
import Info from '@strapi/icons/Information';
import CheckCircle from '@strapi/icons/CheckCircle';
import plansApi from '../../api/plans';

const PlanCard = ( {data, setIsOpen, setItem} ) => {

  const handleEdit = () => {
    setIsOpen(true)
    setItem(data)
  }
  const handleDelete = async () => {
    await plansApi.deletePlans( data.id ).then((res) => {
      setItem(res.data.plan)
    });
  }

  return (
    <Box paddingTop="40px" paddingLeft="15px" paddingBottom="20px" paddingRight="15px" hasRadius={true} background="secondary100" width="32%">
      <Flex direction="column" alignItems="normal">
        <Typography textTransform="uppercase" textAlign="center" variant="alpha" textColor="alternative600">{data.name}</Typography>
        <Box height="300px" width="100%" marginTop={4} background="neutral0" hasRadius={true} padding={7}>
          <Flex direction="column" justifyContent="flex-end">
            <Typography textColor="buttonPrimary600" textAlign="center" variant="alpha" style={{ fontSize: "43px"}}>{data.recurringPrice+data.currencyCode}</Typography>
            <Box marginTop={6} marginBottom={5} >
              <Flex justifyContent="center" gap={2}>
                <Typography style={{ fontSize: "13px"}}>{data.recurringInterval}</Typography>
                <Info style={{ color: "#b6b4ff" }} />
              </Flex>
            </Box>
            <Button  fullWidth size="L"  style={{ backgroundColor: "#8c4bff" }}>Buy now</Button>
            <Typography variant="epsilon" textColor="alternative600" style={{ margin: "13px"}}>Free Enterprise Edition trial: {data.trialDays}</Typography>
          </Flex>
        </Box>
        <Box textAlign="left" marginTop="32px" paddingLeft="14px">
          <Typography variant="delta" textTransform="uppercase" textColor="alternative600">usageCappedAmount: {data.usageCappedAmount}</Typography>
          <Box marginTop="17px" marginBottom="17px">
            <Flex alignItems="center">
              <CheckCircle />
              <Typography variant="omega" fontWeight="semiBold" style={{ marginLeft: "16px" }}>{data.usageTerms}</Typography>
            </Flex>
          </Box>
        </Box>
        <Box marginTop="32px" paddingLeft="14px">
          <Flex flexWrap="wrap" gap="10px" justifyContent="flex-end">
            <Button onClick={() => handleEdit()}>Edit</Button>
            <Button onClick={() => handleDelete()}>Delete</Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default PlanCard;