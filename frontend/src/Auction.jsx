
import React, { useEffect, useState } from "react";
import Header from './component/Header';



export function Auction(props) {
  const { match } = props;
  const { params } = match;
  const { page } = params; 

  useEffect(() => {
    // code to run on component mount
    console.log("*********mounted Auction")
    console.log(props)
  }, [])
  var render = function() {
    console.log(props.auctions)
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
  
