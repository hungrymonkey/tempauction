import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

import Header from './component/Header';
import { fetchAllAuctions } from './handlers/get/fetchallauctions.js';
import { render } from "@testing-library/react";


function App() {
  const [auctionList, setAuctionList] = useState([]);
  useEffect(() => {
    fetchAllAuctions().then(
        (value) => setAuctionList(value)
    )
    // code to run on component mount
  }, [])
  var render = function(props) {
    console.log(props.auctions)
    return (
      <div className="App">
        <Header/>
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
