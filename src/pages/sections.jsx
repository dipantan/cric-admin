import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  Paper,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import instance from 'src/helper/instance';
import { MdAdd, MdDelete } from 'react-icons/md';
import { IoAdd } from 'react-icons/io5';
import { toast } from 'react-toastify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Sections() {
  const [sections, setSections] = React.useState([]);
  const [suggestedPlayers, setSuggestedPlayers] = React.useState();
  const [value, setValue] = React.useState(0);
  const types = ['Batsman', 'Wicketkeeper', 'Bowler', 'Allrounder'];

  const [showPlayerChoose, setShowPlayerChoose] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getSectionsAll = async () => {
    try {
      const { data } = await instance.get('/player/sections/all');
      setSections(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSections = async () => {
    try {
      const { data } = await instance.get('/player/sections');
      setSuggestedPlayers(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowPlayerChoose(false);
  };

  useEffect(() => {
    getSectionsAll();
    getSections();
  }, []);

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
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const postSection = async (id) => {
    try {
      const {} = await instance.post(`/player/sections`, {
        id,
      });
      getSectionsAll();
      toast.success('Section added successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error while adding section');
      // console.log(er);
    }
  };

  const deleteSection = async (id) => {
    try {
      const {} = await instance.delete(`/player/sections/${id}`);
      getSectionsAll();
      toast.success('Section deleted successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error while deleting section');
      // console.log(er);
    }
  };

  const columns = [
    { field: 'player_id', headerName: 'ID', width: 70 },
    {
      field: 'fullname',
      headerName: 'Full Name',
      width: 130,
    },
    {
      field: 'image_path',
      headerName: 'Image',
      renderCell: (params) => (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={params.row.image_path}
            alt="player"
            style={{
              borderRadius: '50%',
            }}
            width={40}
            height={40}
          />
        </Box>
      ),
    },
    {
      field: 'position_name',
      headerName: 'Position',
      width: 130,
    },
    {
      field: 'country_name',
      headerName: 'Country',
      renderCell: (params) => (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <p>{params.row.country_name}</p>
          <img
            src={params.row.country_image}
            alt="player"
            width={50}
            height={50}
            style={{
              objectFit: 'contain',
            }}
          />
        </Box>
      ),
      width: 130,
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <IconButton aria-label="delete" onClick={() => deleteSection(params.row.player_id)}>
            <MdDelete color="red" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const columnSuggested = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'image_path',
      headerName: 'Image',
      renderCell: (params) => (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={params.row.image_path}
            alt="player"
            style={{
              borderRadius: '50%',
            }}
            width={40}
            height={40}
          />
        </Box>
      ),
    },
    {
      field: 'fullname',
      headerName: 'Full Name',
      width: 150,
      editable: true,
    },
    {
      field: 'country_name',
      headerName: 'Country',
      width: 150,
      editable: true,
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <IconButton aria-label="delete" onClick={() => postSection(params.row.id)}>
            <MdAdd color="green" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title> Sections | Cricexchange </title>
      </Helmet>

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            p: 3,
          }}
        >
          <Button
            variant="contained"
            sx={{
              p: 1,
              alignSelf: 'flex-end',
            }}
            onClick={() => setShowPlayerChoose(true)}
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

        <Tabs value={value} onChange={handleChange}>
          {types.map((type, index) => (
            <Tab key={index} label={type} />
          ))}
        </Tabs>

        {types.map((type, index) => (
          <CustomTabPanel key={index} value={value} index={index}>
            <Box>
              <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={sections.filter((section) => section.position_name === type)}
                  columns={columns}
                  getRowId={(row) => row.player_id}
                  pageSizeOptions={[5, 10]}
                  // checkboxSelection
                  sx={{ border: 0 }}
                />
              </Paper>
            </Box>
          </CustomTabPanel>
        ))}
      </Box>

      <Dialog
        // fullScreen
        open={showPlayerChoose}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {`Add ${types[value]}`}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>

        {suggestedPlayers && (
          <DataGrid
            rows={suggestedPlayers[types[value]]}
            columns={columnSuggested}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            // checkboxSelection
            disableRowSelectionOnClick
          />
        )}

        {/* {suggestedPlayers &&
            suggestedPlayers[types[value]]?.map((player) => (
              <>
                <ListItemButton>
                  <ListItemText primary="Phone ringtone" secondary="Titania" />
                </ListItemButton>
                <Divider />
              </>
            ))} */}
      </Dialog>
    </>
  );
}

export default Sections;
