import React from 'react';
import { Box, Button, Typography } from '@strapi/design-system';
import Info from '@strapi/icons/Information';
import CheckCircle from '@strapi/icons/CheckCircle';
import plansApi from '../../api/plans';
import './stylePlanCard.min.css';

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
    <div className="planCard">
      <Typography className="title" variant="alpha" style={{ color: "#8c4bff" }}>{data.name}</Typography>
      <Box className="card">
        <Typography className="price">{data.recurringPrice+data.currencyCode}</Typography>
        <Box className="subSection">
          <Typography style={{ fontSize: "13px"}}>{data.recurringInterval}</Typography>
          <Info style={{ color: "#b6b4ff" }} />
        </Box>
        <div className="button">
          <div style={{ display: "block"}}>
            <div style={{ backgroundColor: "#8c4bff", color: "#fff" }}>
              <Typography className="button-typo">Buy now</Typography>
            </div>
          </div>
        </div>
        <Typography className="trial" style={{ color: "#8c4bff" }}>Free Enterprise Edition trial: {data.trialDays}</Typography>
      </Box>
      <Box className="footer">
        <Typography className="footer-title" style={{ color: "#8c4bff"}}>usageCappedAmount: {data.usageCappedAmount}</Typography>
        <Box className="footer-content">
          <Box className="footer-content-box">
            <CheckCircle />
            <Typography className="footer-content-item">{data.usageTerms}</Typography>
          </Box>
        </Box>
      </Box>
      <Box className="Button-area">
        <Button onClick={() => handleEdit()}>Edit</Button>
        <Button onClick={() => handleDelete()}>Delete</Button>
      </Box>
    </div>
  );
};

export default PlanCard;