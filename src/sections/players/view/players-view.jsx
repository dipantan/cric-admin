import React, { forwardRef, useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DataGrid, useGridApiContext, useGridApiRef } from '@mui/x-data-grid';

import {
  AppBar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Slide,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Toolbar,
} from '@mui/material';
import { IoAdd, IoRemove } from 'react-icons/io5';
import usePlayerStore from 'src/store/playerStore';
import instance from 'src/helper/instance';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

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
  const apiRef = useGridApiRef();
  const [selectedRows, setSelectedRows] = useState();

  const handlePageChange = (event, newPage) => {
    console.log(newPage, controller);

    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      // page: 1,
    });
  };

  const [openTopPlayerDialog, setOpenTopPlayerDialog] = useState(false);
  const [openRecommendedPlayerDialog, setOpenRecommendedPlayerDialog] = useState(false);

  const { error, clearError, message, clearMessage } = usePlayerStore((state) => state);

  const createTopPlayers = usePlayerStore((state) => state.createTopPlayers);
  const topPlayers = usePlayerStore((state) => state.topPlayers);
  const fetchTopPlayers = usePlayerStore((state) => state.fetchTopPlayers);

  const createRecommendedPlayer = usePlayerStore((state) => state.createRecommendedPlayer);
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
          onClick={() => {
            console.log(params.row);

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

  const toggleTopPlayerDialogClick = async () => {
    setOpenTopPlayerDialog((prevState) => {
      if (!prevState) {
        // Only fetch if the dialog is being opened
        getAllPlayer(1);
      }
      return !prevState;
    });
  };

  const toggleRecommendedPlayerDialogClick = async () => {
    setOpenRecommendedPlayerDialog((prevState) => {
      if (!prevState) {
        // Only fetch if the dialog is being opened
        getAllPlayer(1);
      }
      return !prevState;
    });
  };

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

  useEffect(() => {
    console.log('selectedRows', selectedRows);
  }, [selectedRows]);

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

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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
            onClick={toggleTopPlayerDialogClick}
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
            // checkboxSelection
            // rowSelectionModel={selectedRows}
            // onRowSelectionModelChange={(params) => {
            //   setSelectedRows(params);
            // }}
          />
        </div>

        <Dialog
          fullScreen
          open={openTopPlayerDialog}
          onClose={toggleTopPlayerDialogClick}
          maxWidth="lg"
          fullWidth
          TransitionComponent={Transition}
        >
          {/* <DialogTitle>Data Table</DialogTitle> */}
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleTopPlayerDialogClick}
                aria-label="close"
              >
                {/* <IoMdClose /> */}
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Player List
              </Typography>
              
              <Button autoFocus color="inherit" onClick={toggleTopPlayerDialogClick}>
                Close
              </Button>
            </Toolbar>
          </AppBar>

          <DialogContent>
            <Paper>
              <TableContainer style={{ maxHeight: 500 }}>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    maxHeight: 300,
                    height: 300,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Batting style</TableCell>
                      <TableCell>Bowling style</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {playersList.length > 0 &&
                      playersList.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell
                            component="th"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              gap: 2,
                            }}
                          >
                            <img
                              src={player.image_path}
                              style={{ width: 40, height: 40, borderRadius: '50%' }}
                            />
                            {player.fullname}
                          </TableCell>
                          <TableCell>{player.position.name}</TableCell>
                          <TableCell
                            component="th"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              gap: 2,
                            }}
                          >
                            <img src={player.country.image_path} style={{ width: 40 }} />
                            {player.country.name}
                          </TableCell>
                          <TableCell>
                            {player.gender == 'm'
                              ? 'Male'
                              : player.gender == 'f'
                              ? 'Female'
                              : 'Others'}
                          </TableCell>
                          <TableCell>{player.battingstyle || 'N/A'}</TableCell>
                          <TableCell>{player.bowlingstyle || 'N/A'}</TableCell>
                          <TableCell>
                            <Button
                              sx={{ p: 1 }}
                              variant="contained"
                              onClick={async () => {
                                try {
                                  const res = await createTopPlayers(
                                    player.id,
                                    player.position.name.toLowerCase()
                                  );
                                  fetchTopPlayers();
                                  toggleTopPlayerDialogClick();
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <TablePagination
              component="div"
              onPageChange={handlePageChange}
              page={controller.page}
              count={playersCount}
              rowsPerPage={controller.rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </DialogContent>
        </Dialog>
      </CustomTabPanel>

      {/* recommended players */}
      <CustomTabPanel value={value} index={1}>
        <Button
          variant="contained"
          sx={{
            alignSelf: 'flex-end',
            p: 1,
          }}
          onClick={toggleRecommendedPlayerDialogClick}
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
            checkboxSelection
          />
        </div>

        <Dialog
          fullScreen
          open={openRecommendedPlayerDialog}
          onClose={toggleRecommendedPlayerDialogClick}
          // TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleRecommendedPlayerDialogClick}
                aria-label="close"
              >
                {/* <IoMdClose /> */}
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Sound
              </Typography>
              <Button autoFocus color="inherit" onClick={toggleRecommendedPlayerDialogClick}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItemButton>
              <ListItemText primary="Phone ringtone" secondary="Titania" />
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemText primary="Default notification ringtone" secondary="Tethys" />
            </ListItemButton>
          </List>
        </Dialog>
      </CustomTabPanel>
    </Container>
  );
}
