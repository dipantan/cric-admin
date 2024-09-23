import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { ImInfo } from 'react-icons/im';

import Iconify from 'src/components/iconify';
import avatar3 from '../../../public/assets/images/avatars/avatar_3.jpg';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, name, mobile, bank, wallet, date, handleClick }) {
  const [open, setOpen] = useState(null);
  const [openbank, setOpenbank] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenbank = () => {
    setOpenbank(!openbank);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={false}>
        <TableCell padding="checkbox">
          {/* <Checkbox disableRipple checked={selected} onChange={handleClick} /> */}
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatar3} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{mobile}</TableCell>

        <TableCell>{wallet}</TableCell>

        <TableCell>
          {bank ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" noWrap>
                {bank.account_number}
              </Typography>

              <IconButton onClick={handleOpenbank}>
                <ImInfo size={18} />
              </IconButton>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              N/A
            </Typography>
          )}
        </TableCell>

        <Popover
          open={openbank}
          // anchorEl={openbank}
          onClose={handleOpenbank}
          // anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          // PaperProps={{
          //   sx: { width: 140 },
          // }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}
              noWrap
            >
              <h4>Account Holder Name:</h4> {bank?.account_name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}
              noWrap
            >
              <h4>Account Number:</h4> {bank?.account_number}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}
              noWrap
            >
              <h4>Bank Name:</h4> {bank?.bank_name}
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}
              noWrap
            >
              <h4>Bank IFSC:</h4> {bank?.ifsc}
            </Typography>
          </Box>
        </Popover>

        <TableCell>{date}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
