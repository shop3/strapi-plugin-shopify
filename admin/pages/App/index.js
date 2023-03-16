import React, {useState, useEffect} from 'react';
import PlanCard from '../../components/PlanCard';
import { Box, Flex } from '@strapi/design-system';
import { Typography } from '@strapi/design-system/Typography';
import { Button } from '@strapi/design-system/Button';
import Modal from "../../components/Modal";
import plansApi from '../../api/plans';

const App = () => {
  const [plans, setPlans] = useState([])
  const [status, setStatus] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [item, setItem] = useState({
    id: '',
    name: '',
    recurringPrice: '',
    recurringInterval: '',
    usageTerms: '',
    usageCappedAmount: '',
    currencyCode: '',
    trialDays: '',
    test: false,
    oneTimePrice: ''
  })

  useEffect(() => {
    plansApi.getPlans().then(res => {
      setPlans(res.data);
    });
  }, [item]);

  const handleCreate = () => {
    setItem({
      id: '',
      name: '',
      recurringPrice: '',
      recurringInterval: '',
      usageTerms: '',
      usageCappedAmount: '',
      currencyCode: '',
      trialDays: '',
      test: false,
      oneTimePrice: ''
    })
    setIsOpen(true)
  }
  return (
    <Box background="neutral0">
      <Box padding={5} >
        <Flex justifyContent='space-between'>
          <Typography variant="alpha">PLAN</Typography>
          <Button size="L" onClick={() => handleCreate()} >+Create new plan</Button>
        </Flex>
      </Box>
      <Box padding={4} >
        <Flex wrap='wrap' gap={5} >
          {plans.map((plan) => (
            <PlanCard data={plan} setIsOpen={setIsOpen} setItem={setItem}/>
          ))}
        </Flex>
      </Box>

      {isOpen && <Modal setIsOpen={setIsOpen} setStatus={setStatus} setItem={setItem} item={item} />}
    </Box>
  );
};

export default App;