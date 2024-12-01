import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

import { Box, Button, IconButton, Tab, Tabs } from '@mui/material';
import { IoAdd, IoRemove } from 'react-icons/io5';
import usePlayerStore from 'src/store/playerStore';
import instance from 'src/helper/instance';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ca from 'date-fns/locale/ca/index.js';

// ----------------------------------------------------------------------

export default function PlayersView() {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [playersList, setPlayersList] = useState([]);
  const [playersCount, setPlayersCount] = useState(0);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
  });
  const [selectedRows, setSelectedRows] = useState();
  const router = useNavigate();

  const { error, clearError, message, clearMessage } = usePlayerStore((state) => state);

  const topPlayers = usePlayerStore((state) => state.topPlayers);
  const fetchTopPlayers = usePlayerStore((state) => state.fetchTopPlayers);

  const recommendedPlayers = usePlayerStore((state) => state.recommendedPlayers);
  const fetchRecommendedPlayer = usePlayerStore((state) => state.fetchRecommendedPlayer);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</Box>
        )}
      </div>
    );
  }

  const column = [
    { field: 'id', headerName: 'ID', width: 160 },
    {
      field: 'image_path',
      headerName: 'Image',
      width: 160,
      display: 'flex',
      renderCell: (params) => (
        <img src={params.value} style={{ width: 40, height: 40, borderRadius: '50%' }} />
      ),
    },
    {
      field: 'fullname',
      headerName: 'Name',
      valueGetter: (value, row) => `${row.fullname || ''}`,
      width: 160,
    },
    {
      field: 'position',
      headerName: 'Position',
      valueGetter: (value, row) => `${row?.position?.name || ''}`,
      width: 160,
    },
    {
      field: 'age',
      headerName: 'Age',
      valueGetter: (value, row) => `${calculateAge(row.dateofbirth) || ''}`,
      width: 160,
    },
    {
      field: 'country',
      headerName: 'Country',
      description: 'This column has a value getter and is not sortable.',
      width: 160,
      valueGetter: (value, row) => `${JSON.parse(row.country)?.name || ''}`,
    },
    {
      field: 'action',
      headerName: 'Action',
      description: 'This column has a value getter and is not sortable.',
      width: 160,
      renderCell: (params) => (
        <IconButton
          onClick={async () => {
            if (value == 0) {
              // delete top player
              try {
                const res = await instance.delete(`/player/delete-top-players/${params.row.id}`);
                toast.success(res.data.message, {
                  autoClose: 2000,
                  pauseOnHover: false,
                  closeOnClick: true,
                });
                await fetchTopPlayers();
              } catch (error) {
                toast.error(error.response.data.message, {
                  autoClose: 2000,
                  pauseOnHover: false,
                  closeOnClick: true,
                });
              }
            } else {
              // delete recommended player
              try {
                const res = await instance.delete(
                  `/player/delete-recommended-players/${params.row.id}`
                );
                toast.success(res.data.message, {
                  autoClose: 2000,
                  pauseOnHover: false,
                  closeOnClick: true,
                });
                await fetchRecommendedPlayer();
              } catch (error) {
                toast.error(error.response.data.message, {
                  autoClose: 2000,
                  pauseOnHover: false,
                  closeOnClick: true,
                });
              }
            }

            // createTopPlayers(params.row);
            // toggleTopPlayerDialogClick();
          }}
        >
          <MdDelete color="red" />
        </IconButton>
      ),
    },
  ];

  function calculateAge(dob) {
    const dobDate = new Date(dob);
    const diffMs = Date.now() - dobDate.getTime();
    const ageDt = new Date(diffMs);

    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  useEffect(() => {
    fetchTopPlayers();
    fetchRecommendedPlayer();
  }, []);

  useEffect(() => {
    if (controller.page > 0) {
      getAllPlayer();
    }
  }, [controller]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
        onClose: clearError,
        onOpen: () => {
          clearError();
        },
      });
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      toast.success(message, {
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
        onClose: clearMessage,
        onOpen: () => {
          clearMessage();
        },
      });
    }
  }, [message]);

  const getAllPlayer = async (page) => {
    try {
      setLoading(true);
      const res = await instance.get(
        `/player?page=${controller.page || page}&limit=${controller.rowsPerPage}`
      );
      setPlayersList(res.data.data);
      setPlayersCount(res.data.metadata.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Players
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          centered
        >
          <Tab label="Top Players" {...a11yProps(0)} />
          <Tab label="Recommended Players" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* top players */}
      <CustomTabPanel value={value} index={0}>
        <Box
          sx={{
            alignItems: 'flex-end',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          {selectedRows?.length > 0 && (
            <Button
              variant="contained"
              sx={{
                alignSelf: 'flex-end',
                p: 1,
              }}
              // onClick={toggleRecommendedPlayerDialogClick}
            >
              <IconButton
                sx={{
                  fontSize: 16,
                  color: 'white',
                }}
              >
                <IoRemove
                  color="#fff"
                  size={20}
                  style={{
                    marginRight: 5,
                  }}
                />
                Remove
              </IconButton>
            </Button>
          )}

          <Button
            variant="contained"
            sx={{
              alignSelf: 'flex-end',
              p: 1,
            }}
            onClick={() => router('/players/top-players-add')}
          >
            <IconButton
              sx={{
                fontSize: 16,
                color: 'white',
              }}
            >
              <IoAdd
                color="#fff"
                size={20}
                style={{
                  marginRight: 5,
                }}
              />
              Add Player
            </IconButton>
          </Button>
        </Box>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={topPlayers}
            columns={column}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </CustomTabPanel>

      {/* recommended players */}
      <CustomTabPanel value={value} index={1}>
        <Button
          variant="contained"
          sx={{
            alignSelf: 'flex-end',
            p: 1,
          }}
          onClick={() => router('/players/recommended-players-add')}
        >
          <IconButton
            sx={{
              fontSize: 16,
              color: 'white',
            }}
          >
            <IoAdd
              color="#fff"
              size={20}
              style={{
                marginRight: 5,
              }}
            />
            Add Player
          </IconButton>
        </Button>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={recommendedPlayers}
            columns={column}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </div>
      </CustomTabPanel>
    </Container>
  );
}
