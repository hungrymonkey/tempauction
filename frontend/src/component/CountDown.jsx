import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import Grid from '@material-ui/core/Grid';


const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;


const timerProps = {
	isPlaying: true,
	size: 90,
	strokeWidth: 5
};

const renderTime = (dimension, time) => {
	return (
	  <div className="time-wrapper">
		<div className="time">{time}</div>
		<div>{dimension}</div>
	  </div>
	);
  };

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

export default function CountDown(props) {
	
	const [ endTime, setEndTime ] = useState(0)
	//const [ now, setNow ] = useState(0)
	
	
	useEffect(() => {
		console.log("************* setting now " + props.endTime)
			setEndTime(props.endTime);
		}, [props.endTime]
	)
	var render = function(props) {
		const stratTime =  Date.now()/1000; // use UNIX timestamp in seconds
		const remainingTime = endTime - stratTime;
		console.log( "************* " + remainingTime )
		const days = Math.ceil(remainingTime / daySeconds);
		const daysDuration = days * daySeconds;
		return (
		<Grid container justify="center" spacing={3}>
			<Grid key={"clock-days"} item>
		  <CountdownCircleTimer
			{...timerProps}
			colors={[["#7E2E84"]]}
			duration={daysDuration}
			initialRemainingTime={remainingTime}
		  >
			{({ elapsedTime }) =>
			  renderTime("days", getTimeDays(daysDuration - elapsedTime))
			}
		  </CountdownCircleTimer>
		  </Grid>
		  <Grid key={"clock-hours"} item>
		  <CountdownCircleTimer
			{...timerProps}
			colors={[["#D14081"]]}
			duration={daySeconds}
			initialRemainingTime={remainingTime % daySeconds}
			onComplete={(totalElapsedTime) => [
			  remainingTime - totalElapsedTime > hourSeconds
			]}
		  >
			{({ elapsedTime }) =>
			  renderTime("hours", getTimeHours(daySeconds - elapsedTime))
			}
		  </CountdownCircleTimer>
		  </Grid>
		  <Grid key={"clock-minutes"} item>
		  <CountdownCircleTimer
			{...timerProps}
			colors={[["#EF798A"]]}
			duration={hourSeconds}
			initialRemainingTime={remainingTime % hourSeconds}
			onComplete={(totalElapsedTime) => [
			  remainingTime - totalElapsedTime > minuteSeconds
			]}
		  >
			{({ elapsedTime }) =>
			  renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))
			}
		  </CountdownCircleTimer>
		  </Grid>
		  <Grid key={"clock-seconds"} item>
		  <CountdownCircleTimer
			{...timerProps}
			colors={[["#218380"]]}
			duration={minuteSeconds}
			initialRemainingTime={remainingTime % minuteSeconds}
			onComplete={(totalElapsedTime) => [
			  remainingTime - totalElapsedTime > 0
			]}
		  >
			{({ elapsedTime }) =>
			  renderTime("seconds", getTimeSeconds(elapsedTime))
			}
		  </CountdownCircleTimer>
		  </Grid>
		</Grid>
	  );
	}
	return render({endTime: endTime, ...props});
}