
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


const headerStyles = { //Footer CSS
	width: 'auto',
	height: '60px',
	padding: '0px',
	backgroundColor: 'ghostwhite',
};

function TabPanel(props) {
	const { children, value, index, ...other } = props;
  
	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box p={3}>
			<Typography>{children}</Typography>
		  </Box>
		)}
	  </div>
	);
}
TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
  };
function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

  
export default function Header() {
	const [tabIndex, setTabIndex] = React.useState(0);
	var render = function() {
        return (
            <header style={headerStyles}>
				<AppBar position="static">
				<Tabs value={tabIndex} aria-label="simple tabs example">
						<Tab label="Item One" {...a11yProps(0)} />
						<Tab label="Item Two" {...a11yProps(1)} />
					</Tabs>
					<TabPanel value={tabIndex} index={0}>
						Auction 1
					</TabPanel>
					<TabPanel value={tabIndex} index={0}>
						Auction 2
					</TabPanel>
				</AppBar>
               <div>
                </div>        
            </header> 
        );
	}
	return render();

}