import React from 'react';
import { useState } from 'react'
import PlanCard from '../../components/PlanCard';
import { Box } from '@strapi/design-system/Box';
import './app.min.css';
import { Typography } from '@strapi/design-system/Typography';
import { Button } from '@strapi/design-system/Button';
import Modal from "../../components/Modal";

const App = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box className="container">
      <Box className="header">
        <Typography style={{ fontWeight: 600, fontSize: "2rem", lineHeight: 1.25 }}>PLAN</Typography>
        <Button size="L" onClick={() => setIsOpen((e) => !e)} >+create new plan</Button>
      </Box>
      <Box className={"main"}>
        <PlanCard title="BRONZE PLAN" color="#8c4bff" price="$9"/>
        <PlanCard title="SILVER PLAN" color="#00b6c8" price="$9"/>
        <PlanCard title="GOLD PLAN" color="#f6b73e" price="$9"/>
      </Box>

      {isOpen && <Modal setIsOpen={setIsOpen} />}
    </Box>
  );
};

export default App;