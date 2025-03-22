import { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, IconButton, Typography, Chip, Button, Alert } from '@mui/material';
import { Delete as DeleteIcon, Done as DoneIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { notificationService } from '../services/notificationService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => notificationService.markAsRead(n.id))
      );
      fetchNotifications();
    } catch (error) {
      setError('Failed to mark notifications as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Notifications</Typography>
        <Box>
          <IconButton onClick={fetchNotifications} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          {notifications.some(n => !n.read) && (
            <Button variant="outlined" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                mb: 1,
                borderRadius: 1
              }}
              secondaryAction={
                <Box>
                  {!notification.read && (
                    <IconButton edge="end" onClick={() => handleMarkAsRead(notification.id)} sx={{ mr: 1 }}>
                      <DoneIcon />
                    </IconButton>
                  )}
                  <IconButton edge="end" onClick={() => handleDelete(notification.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={notification.message}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={
                        notification.type === 'task_due' ? 'error' :
                        notification.type === 'task_assigned' ? 'primary' :
                        'default'
                      }
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              No notifications
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
}