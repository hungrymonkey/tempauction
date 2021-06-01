import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Switch, Redirect, Route, useHistory } from "react-router-dom";
import logo from './aaae-logo-2021.svg';
import './App.css';
import Error from './404';

import { fetchAllAuctions } from './handlers/get/fetchallauctions.js';
import { Auction } from './Auction';

import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import MenuIcon from '@material-ui/icons/Menu';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';


import { ROOT_URL_PATH } from './config';

function Home(props) {
  const history = useHistory();
  useEffect(() => {
    let auctions = props.auctions;
    if(props.auctionid !== undefined || props.auctionid === '') {
      if(auctions.length > 0) {
        for(let i = 0; i < auctions.length; i++){
          if(auctions[i]["data"]["name"] === props.auctionid){
            history.push("/auction/" + props.auctionid);
          }
        }
      }
    }
  },
  [props.auctions])
  
  return (
    <header className="App-header">
      <div className="App-column">
          <img src={logo} className="App-logo" alt="logo" />
          <span className="App-span"></span>
          <p>
            Welcome to the 2021 AAa/e Fundraiser
          </p>
        </div>
    </header>
  );
}

const headerStyles = { //Footer CSS
	width: 'auto',
	height: '60px',
	padding: '0px',
	backgroundColor: 'ghostwhite',
};
function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}
function a11yDummyProps(index) {
	return {
		id: `simple-dummy-tab-${index}`,
		'aria-controls': `simple-dummy-tabpanel-${index}`,
	};
}


function App(props) {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionIndex, setAuctionIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
	const matches = useMediaQuery('(min-width:767)');
  useEffect(() => {
    fetchAllAuctions().then(
        (value) => { 
          setAuctionList(value)
        }
    )
    // code to run on component mount
  }, [])

  const handleIndexChange = (event, index) => setAuctionIndex(index);

  var renderTabs = function() {
    return (
      auctionList.map((a, i) => (
          <Tab key={"tab-"+(i+1)} label={a["data"]["name"]} {...a11yProps(i + 1)} component={RouterLink}  to={"/auction/"+a["data"]["name"]}/>
        ))
    );
  }
  const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	
	const handleClose = () => {
		setAnchorEl(null);
	};
  var renderMenu = function(idx) {
		return (
			<div>
				<IconButton onClick={handleClick} aria-controls="long-menu" aria-haspopup="true">
					<MenuIcon/>
				</IconButton>
				<Menu id="simple-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}>
					{
						auctionList.map((a, i) => (
							<MenuItem selected={ idx === i + 1} component={RouterLink} to={"/auction/"+a["data"]["name"]}>{a["data"]["name"]}</MenuItem>
						))
					}
				</Menu>
			</div>
		);
	}

  var render = function(props) {
    let hasAuctions = auctionList.length > 0;
    let menuList = matches ? renderTabs() : renderMenu(auctionIndex);
    return (
      <div className="App" >
        <Router basename={ROOT_URL_PATH}>
          <div>
            <header style={headerStyles}>
              <AppBar position="static" color="transparent">
               <Tabs value={ matches ? auctionIndex : ''} aria-label="simple tabs example"  onChange={handleIndexChange}> 
                  <Tab key={"tab-0"} label="Home" {...a11yProps(0)} component={RouterLink}  to="/" />
                  {
                    hasAuctions ? 
                      menuList
                    : <Tab key={"tab-dummy"} label="No Auctions Found" {...a11yDummyProps(1)} />
                  }
                </Tabs>
              </AppBar>       
            </header> 
            <Switch>
              <Route exact path='/'>
                <Home auctionid={props.auctionid} auctions={auctionList}/>
              </Route>
              <Route path='/404'><Error/></Route>
              <Route path='/auction/:id' render={(props) => 
                <Auction auctions={auctionList} {...props} setTabIndex={setAuctionIndex} tabIndex={auctionIndex} /> 
              } />
              {/* 
              <Route path="*">
                <Redirect to="/404" />
              </Route>
              */}
            </Switch>
          </div>
        </Router>
       
        
      </div>
    );
  }
  return render({auctions: auctionList, auctionid: props.auctionid})
}


export default App;
