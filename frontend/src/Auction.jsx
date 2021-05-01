
import React, { useEffect, useState } from "react";
import Header from './component/Header';



export function Auction(props) {
  useEffect(() => {
    // code to run on component mount
  }, [])
  var render = function() {
    console.log(props.auctions)
    return (
    <div className="Auction">
      <Header auctions={[]}/>
      <header className="App-header">
      
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
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
  
