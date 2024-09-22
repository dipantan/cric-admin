import { Container, TableContainer, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import instance from 'src/helper/instance';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function TransactionsPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchTransaction = async () => {
    setError(null);
    try {
      const { data } = await instance.get('/user/transaction');
      setData(data.data);
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No orders found' });
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      valueGetter: (params) => params.toUpperCase(),
    },
    { field: 'message', headerName: 'Message', width: 180 },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 90,
      valueFormatter: (params) => `₹${params}`,
    },
    {
      field: 'date',
      headerName: 'Date',
      description: 'This column has a value getter and is not sortable.',
      width: 250,
      valueGetter: (value) => `${new Date(value).toLocaleString()}`,
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <Helmet>
        <title> User | Cricexchange </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4">Transactions</Typography>
        <TableContainer sx={{ overflow: 'unset' }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            sx={{ border: 0 }}
            //   getRowId={(row) => row.id}
          />
        </TableContainer>
      </Container>
    </>
  );
}
