// import SvgColor from 'src/components/svg-color';
import { GiCricketBat } from 'react-icons/gi';
import { TbInvoice } from 'react-icons/tb';
import { TbTransactionRupee } from 'react-icons/tb';
import { GoGitPullRequest } from 'react-icons/go';
import { FaRegUser } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { MdOutlinePriceChange } from 'react-icons/md';
import { IoImageOutline } from "react-icons/io5";

// ----------------------------------------------------------------------

// const icon = (name) => (
//   <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
// );

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/',
  //   icon: <BsGraphUp size={24} />,
  // },
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
  }
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
