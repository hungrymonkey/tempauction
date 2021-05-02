
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
import { Button, TextField } from '@material-ui/core';

import { getAllBids } from './handlers/post/getAllBids';
import BidTable from './component/BidTable';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
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
    let n = props.match.params.id;
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
  var render = function(args) {
    let hasBids = bids.length > 0;
    return (
    <div className={classes.root}>
      <header className="App-header2">
      <Grid container direction="column" justify="center" alignItems="center" spacing={5} style={{ minHeight: '90vh' }}>
        <Grid item xs={12}>
            <Grid container justify="center" spacing={3}>
              <Grid key={0} item>
                <Paper className={classes.paper} >
                  Product Placeholder
                </Paper>
                
              </Grid>
              <Grid key={1} item>
                
                <Paper className={classes.paper} >
                  <form className={classes.form} noValidate>
                    <Grid container direction="column" justify="center" spacing={2}>
                      <Grid key={0} item><TextField variant="outlined" required fullWidth placeholder={"email"} /></Grid>
                      <Grid key={1} item><TextField variant="outlined" required fullWidth placeholder={"name"} /></Grid>
                      <Grid key={2} item><TextField variant="outlined" required fullWidth placeholder={"bid amount"} /></Grid>
                      <Grid key={3} item><Button className={classes.submit} variant="contained">Bid</Button></Grid>
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
  return render({auction: props.auction})
  }
  
