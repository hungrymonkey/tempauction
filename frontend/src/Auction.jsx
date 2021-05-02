
import React, { useEffect, useState } from "react";
import Header from './component/Header';
import { useHistory } from 'react-router-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { getAllBids } from './handlers/post/getAllBids';


export function Auction(props) {
  const { match } = props;
  const { auctions, setTabIndex, tabIndex } = props;
  const [ bids, setBids ] = useState([]);
  const history = useHistory();
  useEffect(() => {
    // code to run on component mount
  }, [])
  useEffect(() => {
      if(auctions.length > 0) {
        var found = false;
        for(let i = 0; i < auctions.length; i++){
          if(auctions[i]["data"]["name"] === match.params.id){
            found = true;
            console.log("****** matched")
            setTabIndex(i+1)
            break;
          }
        }
        if(!found) {history.push("/404");}
      }
    },
    [props.auctions],
  );
  useEffect(() => {
    getAllBids(props.match.params.id).then(
      (value) => setBids(value)
    )
  },
  [props.match.params],
);
  var render = function(args) {
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
  
