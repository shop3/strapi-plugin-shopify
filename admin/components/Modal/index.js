import React, { useState } from "react";
import { Select, Option, Textarea, TextInput, NumberInput, Box, ToggleInput } from '@strapi/design-system';
import plansApi from '../../api/plans';
import styles from "./modal.min.css";

const Modal = ({ setIsOpen, setStatus, setItem, item }) => {

  const [name, setName] = useState(item.name);
  const [recurringPrice, setRecurringPrice] = useState(item.recurringPrice);
  const [recurringInterval, setRecurringInterval] = useState(item.recurringInterval);
  const [usageTerms, setUsageTerms] = useState(item.usageTerms);
  const [usageCappedAmount, setUsageCappedAmount] = useState(item.usageCappedAmount);
  const [currencyCode, setCurrencyCode] = useState(item.currencyCode);
  const [trialDays, setTrialDays] = useState(item.trialDays);
  const [test, setTest] = useState(item.test);

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
      "test" : test
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
      <Box className="darkBG" onClick={() => setIsOpen(false)} />
      <Box className={"centered"}>
        <Box className={"modal"}>
          <Box className={"modalHeader"}>
            {item.id==='' ? (<h5 className={"heading"}>Create Plan</h5>) : (<h5 className={"heading"}>Edit Plan</h5>)}
          </Box>
          <Box className={"modalContent"}>
            <Box className={"modalContentRow"}>
              <Box className={"modalItem"}>
                <TextInput label="Name" onChange={e => setName(e.target.value)} value={name} required />
              </Box>
              <Box className={"modalItem"}>
                <NumberInput label="recurringPrice" hint="min. 0 characters" step={0.01} onValueChange={value => setRecurringPrice(value)} value={recurringPrice} required />
              </Box>
            </Box>
            <Box className={"modalContentRow"}>
              <Box className={"modalItem"}>
                <Select label="recurringInterval" value={recurringInterval} onChange={setRecurringInterval}  required >
                  <Option value="EVERY_30_DAYS">EVERY_30_DAYS</Option>
                  <Option value="ANNUAL">ANNUAL</Option>
                </Select>
              </Box>
              <Box className={"modalItem"}>
                <Textarea label="usageTerms" onChange={e => setUsageTerms(e.target.value)} value={usageTerms} required />
              </Box>
            </Box>
            <Box className={"modalContentRow"}>
              <Box className={"modalItem"}>
                <NumberInput label="usageCappedAmount" hint="min. 0 characters" step={0.01} onValueChange={value => setUsageCappedAmount(value)} value={usageCappedAmount} required />
              </Box>
              <Box className={"modalItem"}>
                <Select label="currencyCode" value={currencyCode} onChange={setCurrencyCode}  required >
                  <Option value="USD">USD</Option>
                </Select>
              </Box>
            </Box>
            <Box className={"modalContentRow"}>
              <Box className={"modalItem"}>
                <NumberInput label="trialDays" hint="min. 0" onValueChange={value => setTrialDays(value)} value={trialDays} required />
              </Box>
              <Box className={"modalItem"}>
                <ToggleInput label="test" onLabel="True" offLabel="False" checked={test} onChange={e => setTest(e.target.checked)} />
              </Box>
            </Box>
          </Box>
          <Box className={"modalActions"}>
            <Box className={"actionsContainer"}>
              <button className={"btn"} onClick={() => handleSave()}>
                save
              </button>
              <button
                className={"btn"}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Modal;