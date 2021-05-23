import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Switch, Redirect, Route } from "react-router-dom";
import logo from './aaae-logo-2021.svg';
import './App.css';
import Error from './404';

import { fetchAllAuctions } from './handlers/get/fetchallauctions.js';
import { Auction } from './Auction';

import AppBar from "@material-ui/core/AppBar";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


function Home() {
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


function App() {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionIndex, setAuctionIndex] = useState(0);
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
  var render = function(props) {
    let hasAuctions = auctionList.length > 0;
    return (
      <div className="App" >
        <Router>
          <div>
            <header style={headerStyles}>
              <AppBar position="static" color="transparent">
               <Tabs value={auctionIndex} aria-label="simple tabs example"  onChange={handleIndexChange}> 
                  <Tab key={"tab-0"} label="Home" {...a11yProps(0)} component={RouterLink}  to="/" />
                  {
                    hasAuctions ? 
                      renderTabs()
                    : <Tab key={"tab-dummy"} label="No Auctions Found" {...a11yDummyProps(1)} />
                  }
                </Tabs>
              </AppBar>       
            </header> 
            <Switch>
              <Route exact path='/'>
                <Home/>
              </Route>
              <Route path='/404'><Error/></Route>
              <Route path='/auction/:id' render={(props) => 
                <Auction auctions={auctionList} {...props} setTabIndex={setAuctionIndex} tabIndex={auctionIndex} /> 
              } />
              <Route path="*">
                <Redirect to="/404" />
              </Route>
            </Switch>
          </div>
        </Router>
       
        
      </div>
    );
  }
  return render({auctions: auctionList})
}


export default App;
