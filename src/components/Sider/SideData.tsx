import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TheatersIcon from "@mui/icons-material/Theaters";
import MovieCreationIcon from "@mui/icons-material/MovieCreation";
import GroupsIcon from "@mui/icons-material/Groups";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InventoryIcon from "@mui/icons-material/Inventory";

export const SideData = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon color="error" />,
  },
  {
    title: "Users",
    link: "/users",
    icon: <PeopleIcon color="error" />,
  },
  {
    title: "Films",
    link: "/films",
    icon: <TheatersIcon color="error" />,
  },
  {
    title: "Producer",
    link: "/producers",
    icon: <MovieCreationIcon color="error" />,
  },
  {
    title: "Persons",
    link: "/persons",
    icon: <GroupsIcon color="error" />,
  },
  {
    title: "Genres",
    link: "/genres",
    icon: <SubtitlesIcon color="error" />,
  },
  {
    title: "Package",
    link: "/packages",
    icon: <InventoryIcon color="error" />,
  },
  {
    title: "Sales",
    link: "/sales",
    icon: <CurrencyExchangeIcon color="error" />,
  },
  {
    title: "Views",
    link: "/views",
    icon: <RemoveRedEyeIcon color="error" />,
  },
];
