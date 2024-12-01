import { Box, Button, Container, TableContainer, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import instance from 'src/helper/instance';

// ----------------------------------------------------------------------

export default function WithdrawalsPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchWithdrawal = async () => {
    setError(null);
    try {
      const { data } = await instance.get('/user/withdrawal');
      setData(data.data);
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No orders found' });
    }
  };

  useEffect(() => {
    fetchWithdrawal();
  }, []);

  const paginationModel = { page: 0, pageSize: 5 };

  const updateStatus = async (status, id) => {
    try {
      const { data } = await instance.put(`/user/withdrawal`, {
        id,
        status,
      });
      await fetchWithdrawal();
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No orders found' });
    }
  };

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
            columns={[
              { field: 'id', headerName: 'ID', width: 70 },
              {
                field: 'user_id',
                headerName: 'User ID',
                width: 130,
                // valueGetter: (params) => params.toUpperCase(),
              },
              { field: 'status', headerName: 'Status', width: 180 },
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
              {
                field: 'action',
                headerName: 'Action',
                width: 250,
                // align: 'center',
                display: 'flex',
                renderCell: (params) => {
                  return (
                    <Box sx={{ display: 'flex', gap: 1, alignSelf: 'center' }}>
                      <Button
                        variant="contained"
                        disabled={
                          params.row.status === 'approved' || params.row.status === 'rejected'
                        }
                        onClick={() => updateStatus('approved', params.row.id)}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="contained"
                        disabled={
                          params.row.status === 'approved' || params.row.status === 'rejected'
                        }
                        color="error"
                        onClick={() => updateStatus('rejected', params.row.id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  );
                },
              },
            ]}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            rowSelection={false}
            sx={{ border: 0 }}
            //   getRowId={(row) => row.id}
          />
        </TableContainer>
      </Container>
    </>
  );
}
