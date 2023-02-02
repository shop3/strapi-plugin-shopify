import React from 'react';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import Info from '@strapi/icons/Information';
import CheckCircle from '@strapi/icons/CheckCircle';
import './stylePlanCard.min.css';

const PlanCard = ( {title, color, price} ) => {
  return (
    <div className="planCard">
      <Typography className="title" variant="alpha" style={{ color: color }}>{title}</Typography>
      <Box className="card">
        <Typography className="price">{price}</Typography>
        <Box className="subSection">
          <Typography style={{ fontSize: "13px"}}>per admin user/month</Typography>
          <Info style={{ color: "#b6b4ff" }} />
        </Box>
        <Typography style={{ fontWeight: 600 }}>SELF-HOSTED</Typography>
        <div className="button">
          <div style={{ display: "block"}}>
            <div style={{ backgroundColor: color, color: "#fff" }}>
              <Typography className="button-typo">Buy now</Typography>
            </div>
          </div>
        </div>
        <Typography className="trial" style={{ color: color }}>Free Enterprise Edition trial</Typography>
      </Box>
      <Box className="footer">
        <Typography className="footer-title" style={{ color: color}}>{title}</Typography>
        <Box className="footer-content">
          <Box className="footer-content-box">
            <CheckCircle />
            <Typography className="footer-content-item">Granular access controls</Typography>
          </Box>
        </Box>
        <Box className="footer-content">
          <Box className="footer-content-box">
            <CheckCircle />
            <Typography className="footer-content-item">Billing & License support</Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default PlanCard;