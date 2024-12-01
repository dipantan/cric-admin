import { TabPanel } from '@mui/lab';
import { Box, Button, IconButton, Paper, Tab, Tabs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import instance from 'src/helper/instance';
import { MdDelete } from 'react-icons/md';

function Sections() {
  const [sections, setSections] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const types = ['Batsman', 'Wicketkeeper', 'Bowler', 'Allrounder'];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getSections = async () => {
    try {
      const { data } = await instance.get('/player/sections/all');
      setSections(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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
          <IconButton aria-label="delete" onClick={() => console.log(params.row)}>
            <MdDelete color="red" />
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
    </>
  );
}

export default Sections;
