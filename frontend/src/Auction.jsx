
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { TextField, InputAdornment, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';

import { validateEmail, validateBidAmount, UTCtoDate, formatLocalDate } from './utils';
import { getAllBids } from './handlers/post/getAllBids';
import { createBid } from './handlers/post/createBid';

import BidTable from './component/BidTable';
import CountDown from './component/CountDown';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  paper2: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  bidPaper: {
    margin: 'auto',
    maxWidth: 800,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  input: {
    minWidth: 300,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function Auction(props) {
  const classes = useStyles();
  const { match } = props;
  const { auctions, setTabIndex, tabIndex } = props;
  const [ bids, setBids ] = useState([]);
  const history = useHistory();

  const [ emailField, setEmailField ] = useState("");
  const [ bidField, setBidField ] = useState("");
  const [ nameField, setNameField ] = useState("");
  const [ endTime, setEndTime ] = useState((new Date()).toISOString());
  const [ createResult, setCreateResult ] = useState({});


  useEffect(() => {
    // code to run on component mount
    setEndTime((new Date()).toISOString())
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
    let n = props.match.params.id;
    setBidField("")
    if(auctions.length > 0) {
      for(let i = 0; i < auctions.length; i++){
        if(auctions[i]["data"]["name"] === n){
          setEndTime(auctions[i]["data"]["auction_end"])
          break;
        }
      }
    }
    getAllBids(n).then(
      (value) => {
        if (typeof value === 'undefined') {
          console.log("*******************: getallbids " + n + " is " + typeof value );
          setBids([])
        } else {       
          setBids(value);
        }
      }
    )
    },
    [props.match.params],
  );
  var handleBidChange = (e) => {
    setCreateResult({});
    setBidField(e.target.value)
  };
  var handleEmailChange = (e) => setEmailField(e.target.value);
  var handleNameChange = (e) => setNameField(e.target.value);

  var handleCreateBid = function(event) {
    let isEmailValid = validateEmail(emailField);
    let isBidNumber = !isNaN(bidField);
    let isNameEmpty = nameField == "";
    let isNameString = typeof nameField === "string";
    if( isEmailValid && isBidNumber && !isNameEmpty && isNameString) {
      let b = Number.parseFloat(bidField) * 100;
      createBid(
        {
          "name" : nameField,
          "bid_amount" : b|0,
          "email" : emailField,
          "auction": props.match.params.id
        }
      ).then(
        (result) => {
          console.log(result);
          setCreateResult(result);
        }
      ).catch((err) => { setCreateResult({"error_message": "Input Error"} )})
    }
    
  }
  
  var render = function(props) {
    let hasBids = props.bids.length > 0;
    let isEmailValid = validateEmail(props.email);
    let isPostiveNumber = validateBidAmount(bidField);
    let endDateObj = UTCtoDate(endTime)
    let auctionFinished = endDateObj.getTime() > Date.now();
    let hasInputError = createResult.hasOwnProperty("error_message");
    return (
    <div className={classes.root}>
      <header className="App-header2">
      <Grid container direction="column" justify="center" alignItems="center" spacing={5} style={{ minHeight: '90vh' }}>
        <Grid item xs={12}>
          <Typography>{ auctionFinished ?  "Auction End Time: " + formatLocalDate(endDateObj) : "Auction is over"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
            <Grid container justify="center" spacing={3}>
              <Grid key={"input-item-0"} item>
                <Paper className={classes.paper} >
                  Product Placeholder
                </Paper>
                
              </Grid>
              <Grid key={"input-paper-1"} item>
                <Paper className={classes.paper} >
                  <form className={classes.form} noValidate>
                    <Grid container direction="column" justify="center" spacing={2}>
                      <Grid key={"input-error-0"} item>{ hasInputError ?  <Typography color="error">{createResult["error_message"]}</Typography> : <div/>}</Grid>
                      <Grid key={"input-email-2"} item>
                        <TextField variant="outlined" required fullWidth placeholder={"email"} error={!isEmailValid} onChange={handleEmailChange}/>
                      </Grid>
                      <Grid key={"input-name-3"} item><TextField variant="outlined" required fullWidth placeholder={"name"} onChange={handleNameChange}/></Grid>
                      <Grid key={"input-bid-4"} item>
                        <TextField variant="outlined" required fullWidth placeholder={"bid amount"} error={!isPostiveNumber} onChange={handleBidChange}
                            InputProps={{startAdornment: (<InputAdornment position="start">$</InputAdornment>)}}
                            value={bidField}
                        />
                      </Grid>
                      <Grid key={"input-submit-5"} item>
                        <Button className={classes.submit} disabled={!auctionFinished} variant="contained" onClick={handleCreateBid}>Bid</Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
          </Grid>
        </Grid>
        <Grid item xs={20}>
            { 
              hasBids ? <Paper className={classes.bidPaper}><BidTable data={bids} /></Paper> : <h2>Create the first Bid</h2>
            }
          
        </Grid>
      </Grid>
      
      </header>
    </div>
    );
  }
  return render({auction: props.auction, bids: bids, email: emailField})
  }
  
