import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

import Header from './component/Header';
import { Auction } from './Auction';

import { fetchAllAuctions } from './handlers/get/fetchallauctions.js';

function App() {
  const [auctionList, setAuctionList] = useState([]);
  const [auctionIndex, setAuctionIndex] = useState(0);
  useEffect(() => {
    fetchAllAuctions().then(
        (value) => setAuctionList(value)
    )
    // code to run on component mount
  }, [])
  var render = function(props) {
    console.log(auctionList)
    return (
      <div className="App">
        <Router >
            <Switch>
              <Route path="/auction/:id" child={<Auction auction={auctionList}/>}/>
            </Switch>
        </Router>
        <Header auctions={auctionList}/>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  return render({auctions: auctionList})
}

export default App;
