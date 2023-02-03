import React, { useState } from "react";
import { Select, Option, Textarea, TextInput, NumberInput, Box, ToggleInput } from '@strapi/design-system';
import styles from "./modal.min.css";

const Modal = ({ setIsOpen }) => {
  const [recurringPrice, setRecurringPrice] = useState();
  const [recurringInterval, setRecurringInterval] = useState();
  const [usageTerms, setUsageTerms] = useState();
  const [usageCappedAmount, setUsageCappedAmount] = useState();
  const [currencyCode, setCurrencyCode] = useState();
  const [trialDays, setTrialDays] = useState();
  const [test, setTest] = useState();

  return (
    <>
      <Box className="darkBG" onClick={() => setIsOpen(false)} />
      <Box className={"centered"}>
        <Box className={"modal"}>
          <Box className={"modalHeader"}>
            <h5 className={"heading"}>Create Plan</h5>
          </Box>
          <Box className={"modalContent"}>
            <Box className={"modalContentRow"}>
              <Box className={"modalItem"}>
                <TextInput label="Name" required />
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
                <Textarea label="usageTerms" step={0.01} onValueChange={e => setUsageTerms(e.target.value)} value={usageTerms} required />
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
              <button className={"btn"} onClick={() => setIsOpen(false)}>
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