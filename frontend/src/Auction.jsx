
import React, { useEffect, useState } from "react";
import Header from './component/Header';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

export function Auction(props) {
  const { match } = props;
  const { auctions } = props;
  useEffect(() => {
    // code to run on component mount
  }, [])
  var render = function() {
    return (
    <div className="Auction">
      <header className="App-header2">
      
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link2"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Auction Not Found
      </a>
      </header>
    </div>
    );
  }
  return render({auction: props.auction})
  }
  
