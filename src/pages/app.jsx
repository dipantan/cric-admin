import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const router = useNavigate();

  useEffect(() => {
    router('/user');
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Cricexchange </title>
      </Helmet>

      {/* <AppView /> */}
    </>
  );
}
