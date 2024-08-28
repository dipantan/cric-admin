import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

import { AppBar, Box, Button, Dialog, Divider, IconButton, List, ListItemButton, ListItemText, Tab, Tabs, Toolbar } from '@mui/material';
import { IoAdd } from 'react-icons/io5';
import usePlayerStore from 'src/store/playerStore';

// ----------------------------------------------------------------------

export default function PlayersView() {
  const [value, setValue] = React.useState(0);

  const [openTopPlayerDialog, setOpenTopPlayerDialog] = useState(false);
  const [openRecommendedPlayerDialog, setOpenRecommendedPlayerDialog] = useState(false);

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
  ];

  function calculateAge(dob) {
    const dobDate = new Date(dob);
    const diffMs = Date.now() - dobDate.getTime();
    const ageDt = new Date(diffMs);

    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  const toggleTopPlayerDialogClick = () => {
    setOpenTopPlayerDialog(!openTopPlayerDialog);
  };

  const toggleRecommendedPlayerDialogClick = () => {
    setOpenRecommendedPlayerDialog(!openRecommendedPlayerDialog);
  };

  useEffect(() => {
    fetchTopPlayers();
    fetchRecommendedPlayer();
  }, []);

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
            checkboxSelection
          />
        </div>

        <Dialog
          fullScreen
          open={openTopPlayerDialog}
          onClose={toggleTopPlayerDialogClick}
          // TransitionComponent={Transition}
        >
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
                Sound
              </Typography>
              <Button autoFocus color="inherit" onClick={toggleTopPlayerDialogClick}>
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
