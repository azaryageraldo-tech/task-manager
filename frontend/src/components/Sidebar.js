import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Category as CategoryIcon,
  Notifications as NotificationIcon
} from '@mui/icons-material';

const Sidebar = ({ open, width = 240 }) => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Notifications', icon: <NotificationIcon />, path: '/notifications' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>


          {menuItems.map((item) => (
            // Ganti ini
            <ListItem button>
            
            // Menjadi ini
            <ListItem>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

      </Box>
    </Drawer>
  );
};

export default Sidebar;