import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { UTCtoDate, formatLocalDate } from '../utils';

const useStyles = makeStyles((theme) => ({
	root: {
	  width: '100%',
	},
	bidPaper: {
		padding: theme.spacing(2),
		margin: 'auto',
		maxWidth: 800,
	},
	paper: {
	  width: '100%',
	  marginBottom: theme.spacing(2),
	},
	table: {
	  minWidth: 750,
	},
	visuallyHidden: {
	  border: 0,
	  clip: 'rect(0 0 0 0)',
	  height: 1,
	  margin: -1,
	  overflow: 'hidden',
	  padding: 0,
	  position: 'absolute',
	  top: 20,
	  width: 1,
	},
  }));

const columns = [
	{ id: 'ts', label: 'DB Timestamp', minWidth: 120 },
	{ id: 'name', label: 'Bidders Name', minWidth: 150 },
	{ id: 'amount', label: 'Bid Amount', minWidth: 120 },
	{
	  id: 'bidtime',
	  label: 'TimeStamp',
	  minWidth: 160,
	  align: 'right',
	}
  ];

function createData(ts, name, nondenomatedamount, bidts) {
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	  });
	const amount = formatter.format(nondenomatedamount / 100);
	const bidtime = formatLocalDate(UTCtoDate(bidts));
	return { ts, name, amount, bidtime };
}
export default function BidTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  function render(props) {
	const rows = props.data;
	return (
		<div>
		<TableContainer className={classes.container}>
			<Table stickyHeader aria-label="sticky table">
			<TableHead>
				<TableRow>
				{columns.map((column) => (
					<TableCell
					key={column.ts}
					align={"right"}
					style={{ minWidth: column.minWidth }}
					>
					{column.label}
					</TableCell>
				))}
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
				const r = createData(row["ts"], row["name"], row["amount"], row["timestamp"]);
				return (
					<TableRow hover role="checkbox" tabIndex={-1} key={r.ts}>
					{columns.map((column) => {
						const value = r[column.id];
						return (
						<TableCell key={column.id} align={"right"}>
							{value}
						</TableCell>
						);
					})}
					</TableRow>
				);
				})}
			</TableBody>
			</Table>
		</TableContainer>
		<TablePagination
			rowsPerPageOptions={[10, 25, 100]}
			component="div"
			count={rows.length}
			rowsPerPage={rowsPerPage}
			page={page}
			onChangePage={handleChangePage}
			onChangeRowsPerPage={handleChangeRowsPerPage}
		/>
		</div>
	);
	}
	return render(props)
}