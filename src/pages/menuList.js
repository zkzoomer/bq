import { FaHome, FaPencilAlt, FaLayerGroup, FaUserAlt } from 'react-icons/fa';

export const MenuList = [
    {
      title: "Home",
      url: "/",
      icon: <FaHome />,
    },
    {
      title: "Create",
      url: "/create",
      icon: <FaPencilAlt />,
    },
    {
      title: "Browse",
      url: "/browse",
      icon: <FaLayerGroup />,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: <FaUserAlt />,
    },
];