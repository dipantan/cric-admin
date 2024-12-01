import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import instance from 'src/helper/instance';
import usePlayerStore from 'src/store/playerStore';

export default function RecommendedPlayersAddPage() {
  const [loading, setLoading] = useState(false);
  const [playersList, setPlayersList] = useState([]);
  const [playersCount, setPlayersCount] = useState(0);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
  });
  const createRecommendedPlayer = usePlayerStore((state) => state.createRecommendedPlayer);

  const handlePageChange = (_event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  const { error, clearError, message, clearMessage } = usePlayerStore((state) => state);

  useEffect(() => {
    getAllPlayer();
  }, [controller.page, controller.rowsPerPage]);

  useEffect(() => {
    if (error) {
      if (error.includes('Duplicate entry')) {
        toast.error('This player has already been added to the top players.', {
          autoClose: 2000,
          pauseOnHover: false,
          closeOnClick: true,
          onClose: clearError,
          onOpen: () => {
            clearError();
          },
        });
      } else {
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

  const getAllPlayer = async () => {
    try {
      setLoading(true);
      const res = await instance.get(
        `/player?page=${controller.page + 1}&limit=${controller.rowsPerPage}`
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
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            // onClick={toggleTopPlayerDialogClick}
            aria-label="close"
          >
            {/* <IoMdClose /> */}
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add Top Players
          </Typography>

          {/* <Button autoFocus color="inherit" onClick={toggleTopPlayerDialogClick}>
              Close
            </Button> */}
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
                              try {
                                await createRecommendedPlayer(player.id);
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
    </Container>
  );
}
