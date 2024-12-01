import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import instance from 'src/helper/instance';
import { CiSearch } from 'react-icons/ci';

export default function Price() {
  const [loading, setLoading] = useState(false);
  const [playersList, setPlayersList] = useState([]);
  const [playersCount, setPlayersCount] = useState(0);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
  });
  const [searchInput, setSearchInput] = useState('');
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePageChange = (_event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const toggleUpdateDialog = () => {
    setShowUpdateDialog(!showUpdateDialog);
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  useEffect(() => {
    getAllPlayer();
  }, [controller.page, controller.rowsPerPage, searchInput]);

  const getAllPlayer = async () => {
    try {
      setLoading(true);
      const res = await instance.get(
        `/player?page=${controller.page + 1}&limit=${controller.rowsPerPage}${
          searchInput ? `&search=${searchInput}` : ''
        }`
      );
      setPlayersList(res.data.data);
      setPlayersCount(res.data.metadata.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async (id) => {
    try {
      const { data } = await instance.get(`/player/price/${id}`);
      setSelectedPlayer((prev) => ({ ...prev, price: data.data.curr_price }));
    } catch (error) {
      console.log(error);
    }
  };

  const updatePrice = async () => {
    try {
      const res = await instance.put(`/player/price/${selectedPlayer.id}`, {
        amount: selectedPlayer.price,
      });
      toggleUpdateDialog();
      await getAllPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="xl">
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Update Player Prices
          </Typography>

          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search players"
              inputProps={{ 'aria-label': 'search players' }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Paper>
        </Toolbar>
      </AppBar>

      <Box>
        <Paper>
          <TableContainer style={{ maxHeight: 500 }}>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  height: 300,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
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
                              toggleUpdateDialog();
                              setSelectedPlayer(player);
                              await fetchPrice(player.id);
                            }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Paper>

        {playersList.length > 0 && (
          <TablePagination
            component="div"
            onPageChange={handlePageChange}
            page={controller.page}
            count={playersCount}
            rowsPerPage={controller.rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Box>

      <Dialog
        open={showUpdateDialog}
        onClose={toggleUpdateDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{
          padding: '20px',
        }}
      >
        <Box>
          <DialogTitle id="alert-dialog-title">Update Player Price</DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              margin: 2,
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={
                selectedPlayer?.image_path ||
                'https://cdn-icons-png.flaticon.com/512/1193/1193274.png'
              }
              sx={{ width: 100, height: 100 }}
            />

            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {selectedPlayer?.fullname}
              </Typography>
              <Typography variant="body1">{selectedPlayer?.position.name}</Typography>
              <Typography variant="body1">{selectedPlayer?.country.name}</Typography>
              <Typography variant="body1">
                {selectedPlayer?.gender === 'm'
                  ? 'Male'
                  : selectedPlayer?.gender === 'f'
                  ? 'Female'
                  : 'Others'}
              </Typography>
            </Box>
          </DialogContent>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              margin: 2,
            }}
          >
            <TextField
              defaultValue={selectedPlayer?.price}
              label="Price"
              variant="outlined"
              style={{ margin: '10px', padding: 0 }}
              value={selectedPlayer?.price}
              autoFocus
              focused
              type="number"
              onChange={(e) => setSelectedPlayer({ ...selectedPlayer, price: e.target.value })}
            />

            <Button variant="contained" style={{ margin: '10px' }} onClick={updatePrice}>
              Update
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
}
