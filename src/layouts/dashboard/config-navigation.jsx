import { GiCricketBat } from 'react-icons/gi';
import { TbInvoice } from 'react-icons/tb';
import { TbTransactionRupee } from 'react-icons/tb';
import { GoGitPullRequest } from 'react-icons/go';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlinePriceChange } from 'react-icons/md';
import { IoImageOutline } from 'react-icons/io5';
import { TbSection } from 'react-icons/tb';

// ----------------------------------------------------------------------

const navConfig = [
  {
    title: 'user',
    path: '/user',
    icon: <FaRegUser size={24} />,
  },
  {
    title: 'players',
    path: '/players',
    icon: <GiCricketBat size={24} />,
  },

  {
    title: 'orders',
    path: '/orders',
    icon: <TbInvoice size={24} />,
  },
  {
    title: 'transactions',
    path: '/transactions',
    icon: <TbTransactionRupee size={24} />,
  },
  {
    title: 'Withdrawals',
    path: '/withdrawals',
    icon: <GoGitPullRequest size={24} />,
  },
  {
    title: 'prices',
    path: '/prices',
    icon: <MdOutlinePriceChange size={24} />,
  },
  {
    title: 'banners',
    path: '/banners',
    icon: <IoImageOutline size={24} />,
  },
  {
    title: 'sections',
    path: '/sections',
    icon: <TbSection size={24} />,
  },
];

export default navConfig;
