import React, {useState, useEffect} from 'react';
import PlanCard from '../../components/PlanCard';
import { Box } from '@strapi/design-system/Box';
import './app.min.css';
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
    test: false
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
      test: false
    })
    setIsOpen(true)
  }
  return (
    <Box className="container">
      <Box className="header">
        <Typography style={{ fontWeight: 600, fontSize: "2rem", lineHeight: 1.25 }}>PLAN</Typography>
        <Button size="L" onClick={() => handleCreate()} >+Create new plan</Button>
      </Box>
      <Box className={"main"}>
        {plans.map((plan) => (
          <PlanCard data={plan} setIsOpen={setIsOpen} setItem={setItem}/>
        ))}
      </Box>

      {isOpen && <Modal setIsOpen={setIsOpen} setStatus={setStatus} setItem={setItem} item={item} />}
    </Box>
  );
};

export default App;