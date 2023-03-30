import React, { useState } from "react";
import { Typography, Grid, GridItem, Flex, Button, Select, Option, Textarea, TextInput, NumberInput, Box, ToggleInput } from '@strapi/design-system';
import plansApi from '../../api/plans';

const Modal = ({ setIsOpen, setStatus, setItem, item }) => {

  const [name, setName] = useState(item.name);
  const [recurringPrice, setRecurringPrice] = useState(item.recurringPrice);
  const [recurringInterval, setRecurringInterval] = useState(item.recurringInterval);
  const [usageTerms, setUsageTerms] = useState(item.usageTerms);
  const [usageCappedAmount, setUsageCappedAmount] = useState(item.usageCappedAmount);
  const [currencyCode, setCurrencyCode] = useState(item.currencyCode);
  const [trialDays, setTrialDays] = useState(item.trialDays);
  const [test, setTest] = useState(item.test);
  const [oneTimePrice, setOneTimePrice] = useState(item.oneTimePrice);
  const [paymentsMode, setPaymentsMode] = useState(item.paymentsMode);

  const handleSave = async () => {
    const id = item.id
    const data = {
      "name" : name,
      "recurringPrice" : recurringPrice,
      "recurringInterval" : recurringInterval,
      "usageTerms" : usageTerms,
      "usageCappedAmount" : usageCappedAmount,
      "currencyCode" : currencyCode,
      "trialDays" : trialDays,
      "test" : test,
      "oneTimePrice" : oneTimePrice,
      "paymentsMode" : paymentsMode
    }

    if(id==='') {
      await plansApi.createPlans( data ).then((res) => {
        setItem(res.data.plan);
      });
    }
    else {
      await plansApi.editPlans( data, id ).then((res) => {
        setItem(res.data.plan);
      });
    }

    setIsOpen(false)
  }

  return (
    <>
      <Box position="absolute" top="50%" left="50%" width="100vw" height="100vh" style={{transform: "translate(-50%, -50%)", background: "rgba(0, 0, 0, 0.5)"}} onClick={() => setIsOpen(false)} />
      <Box position="fixed" top="50%" left="60%" style={{transform: "translate(-50%, -50%)"}}>
        <Box width="800px" height="700px" background="neutral0" color="neutral0" padding="20px" hasRadius={true}>
          <Box height="50px" background="neutral0" textAlign="center" padding="10px">
            {item.id==='' ? (<Typography variant="beta">Create Plan</Typography>) : (<Typography variant="beta">Edit Plan</Typography>)}
          </Box>
          <Box>
            <Box marginBottom="30px">
              <Grid gap="16px" >
                <GridItem  col={6}>
                  <TextInput label="Name" onChange={e => setName(e.target.value)} value={name} required />
                </GridItem>
                <GridItem  col={6}>
                  <ToggleInput label="PaymentsMode" onLabel="recuring" offLabel="oneTime" checked={paymentsMode} onChange={e => setPaymentsMode(e.target.checked)} />
                </GridItem>
              </Grid>
            </Box>
            <Box marginBottom="30px">
              <Grid gap="16px" >
                <GridItem  col={6}>
                  <NumberInput label="recurringPrice" hint="min. 0 characters" step={0.01} onValueChange={value => setRecurringPrice(value)} value={recurringPrice} disabled={!paymentsMode} required />
                </GridItem>
                <GridItem  col={6}>
                  <Select label="recurringInterval" value={recurringInterval} onChange={setRecurringInterval} disabled={!paymentsMode}  required >
                    <Option value="EVERY_30_DAYS">EVERY_30_DAYS</Option>
                    <Option value="ANNUAL">ANNUAL</Option>
                  </Select>
                </GridItem>
              </Grid>
            </Box>
            <Box marginBottom="30px">
              <Grid gap="16px" >
                <GridItem  col={6}>
                  <NumberInput label="oneTimePrice" hint="min. 0" onValueChange={value => setOneTimePrice(value)} value={oneTimePrice} disabled={paymentsMode} required />
                </GridItem>
                <GridItem  col={6}>
                  <Textarea label="usageTerms" onChange={e => setUsageTerms(e.target.value)} value={usageTerms} required />
                </GridItem>
              </Grid>
            </Box>
            <Box marginBottom="30px">
              <Grid gap="16px" >
                <GridItem  col={6}>
                  <NumberInput label="usageCappedAmount" hint="min. 0 characters" step={0.01} onValueChange={value => setUsageCappedAmount(value)} value={usageCappedAmount} required />
                </GridItem>
                <GridItem  col={6}>
                  <Select label="currencyCode" value={currencyCode} onChange={setCurrencyCode}  required >
                    <Option value="USD">USD</Option>
                  </Select>
                </GridItem>
              </Grid>
            </Box>
            <Box marginBottom="30px">
              <Grid gap="16px" >
                <GridItem  col={6}>
                  <NumberInput label="trialDays" hint="min. 0" onValueChange={value => setTrialDays(value)} value={trialDays} required />
                </GridItem>
                <GridItem  col={6}>
                  <ToggleInput label="test" onLabel="True" offLabel="False" checked={test} onChange={e => setTest(e.target.checked)} />
                </GridItem>
              </Grid>
            </Box>
          </Box>
          <Box position="absolute" bottom="2px" padding="10px" marginBottom="20px" width="100%">
            <Flex justifyContent="space-around" alignItems="center" >
              <Button variant='tertiary' onClick={() => handleSave()}>
                save
              </Button>
              <Button variant='tertiary' onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Modal;