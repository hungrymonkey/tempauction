import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const target = document.getElementById('aaae-auction-2021');
if (target) {
  ReactDOM.render(
    <React.StrictMode>
      <App auctionid={target.attributes.auctionid.value}/>
    </React.StrictMode>, target
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
