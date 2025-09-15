import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 240;

const menuItems = [
  { label: "Profile", icon: <PeopleIcon />, path: "/app/profile" },
  { label: "Attendance", icon: <AssignmentIcon />, path: "/app/attendance" },
  { label: "Summary", icon: <DashboardIcon />, path: "/app/summary" },
];

type SidebarColors = {
  textColor?: string;
  hoverColor?: string;
  activeBg?: string;
  activeColor?: string;
};

export default function Sidebar({
  colors = {},
}: {
  colors?: SidebarColors;
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="subtitle2" color="textSecondary">
          Welcome,
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: colors.textColor || theme.palette.primary.main }}
        >
          {user ? `${user.firstName} ${user.lastName}` : "Guest"}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => !isDesktop && setOpen(false)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                color: colors.textColor || "inherit",
                "&:hover": {
                  backgroundColor: colors.hoverColor || "#f1f5f9",
                },
                ...(isActive && {
                  backgroundColor: colors.activeBg || "#e3f2fd",
                  color: colors.activeColor || theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: colors.activeBg || "#e3f2fd",
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {!isDesktop && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            backgroundColor: "#fff",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f1f5f9" },
            zIndex: 1300,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop ? true : open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#fff",
            boxShadow: isDesktop ? "2px 0px 12px rgba(0,0,0,0.05)" : "none",
            borderRight: isDesktop ? "none" : undefined,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
