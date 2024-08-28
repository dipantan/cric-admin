import { Helmet } from 'react-helmet-async';

import { PlayersView } from 'src/sections/players/view';

// ----------------------------------------------------------------------

export default function PlayersPage() {
  return (
    <>
      <Helmet>
        <title> Players | Minimal UI </title>
      </Helmet>

      <PlayersView />
    </>
  );
}
