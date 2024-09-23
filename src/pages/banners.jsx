import {
  Button,
  Container,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  List,
  styled,
  TableContainer,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import instance from 'src/helper/instance';
import { MdDelete } from 'react-icons/md';
import { FaCloudUploadAlt } from 'react-icons/fa';

// ----------------------------------------------------------------------

export default function BlogPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getBanner = async () => {
    try {
      const { data } = await instance.get('/upload/banner');
      setData(data.data);
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No banners found' });
    }
  };

  const deleteBanner = async (id) => {
    try {
      const { data } = await instance.delete(`/upload/banner/${id}`);
      if (data.status) {
        getBanner();
      }
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No banners found' });
    }
  };

  const uploadBanner = async (file) => {
    try {
      const fd = new FormData();
      fd.append('file', file[0]);
      const { data } = await instance.postForm('/upload/banner', fd);
      if (data.status) {
        getBanner();
      }
    } catch (error) {
      setError({ error: error.response?.data?.message || 'No banners found' });
    }
  };

  useEffect(() => {
    getBanner();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: false,
        onclose: () => setError(null),
        onclick: () => setError(null),
      });
    }
  }, [error]);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>
      <Helmet>
        <title> Banners | Cricexchange </title>
      </Helmet>

      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <Typography variant="h4">Banners</Typography>

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<FaCloudUploadAlt />}
          sx={{
            alignSelf: 'flex-end',
          }}
        >
          Upload banner
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => uploadBanner(event.target.files)}
            multiple
          />
        </Button>

        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {data.map((item) => (
            <Grid item xs={2} sm={4} md={4}>
              <ImageListItem key={item.img}>
                <img
                  srcSet={`${import.meta.env.VITE_BASE_URL}/${item.img}`}
                  src={`${import.meta.env.VITE_BASE_URL}/${item.img}`}
                  alt={item.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.name}
                  subtitle={item.date}
                  actionIcon={
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`info about ${item.title}`}
                      onClick={() => deleteBanner(item.id)}
                    >
                      <MdDelete />
                    </IconButton>
                  }
                />
              </ImageListItem>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
