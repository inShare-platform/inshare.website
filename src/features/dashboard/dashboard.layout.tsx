import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getDashboardDataRequest } from "./redux/slice/dashboardSlice";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const DashboardLayout = () => {

  const data: any = useSelector((state: any) => state.dashboard?.data) || [];
  const dispatch = useDispatch();

  console.log(data)

  useEffect(() => {
    dispatch(getDashboardDataRequest());
  }, [])


  function createData(
    id: number,
    name: string,
    address: string,
    company: string,
    email: string,
    phone: string,
    website: string
  ) {
    return { id, name, address, company, email, phone, website };
  }

  const tableData = data.map((d: any) => {
    return createData(d.id, d.name, `${d.address.street}, ${d.address.city}`, d.company.name, d.email, d.phone, d.website)
  })

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">Company</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Website</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row:any) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.address}</TableCell>
                <TableCell align="right">{row.company}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.phone}</TableCell>
                <TableCell align="right">{row.website}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default DashboardLayout
