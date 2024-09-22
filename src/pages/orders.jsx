import { Container, TableContainer, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import instance from 'src/helper/instance';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    setError(null);
    try {
      const { data } = await instance.get('/user/order');
      setData(data.data);
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No orders found' });
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <Helmet>
        <title> User | Cricexchange </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4">Orders</Typography>
        <TableContainer sx={{ overflow: 'unset' }}>
          <DataGrid
            rows={data}
            columns={[
              { field: 'id', headerName: 'ID' },
              { field: 'order_id', headerName: 'Order Id', width: 200 },
              { field: 'type', headerName: 'Type' },
              {
                field: 'amount',
                headerName: 'Amount',
                description: 'This column has a value getter and is not sortable.',
                valueGetter: (_value, row) => `₹${row.data.amount || ''}`,
              },
              {
                field: 'quantity',
                headerName: 'Quantity',
                description: 'This column has a value getter and is not sortable.',
                valueGetter: (_value, row) => `${row.data.quantity || ''}`,
              },
              {
                field: 'player_id',
                headerName: 'Player Id',
                description: 'This column has a value getter and is not sortable.',
                valueGetter: (_value, row) => `${row.data.player_id || ''}`,
              },
            ]}
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
