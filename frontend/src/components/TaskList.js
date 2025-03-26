import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { taskService } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      const response = await taskService.getAllTasks();
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      console.log('Tasks received:', response.data);
      setTasks(Array.isArray(response.data) ? response.data : []);
      
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
      
      // Handle unauthorized error
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRefresh = () => {
    fetchTasks();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">My Tasks</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        tasks.length === 0 ? (
          <Alert severity="info">No tasks found. Create your first task!</Alert>
        ) : (
          <List sx={{ width: '100%' }}>
            {tasks.map(task => (
              <ListItem 
                key={task.id}
                disablePadding
                sx={{ mb: 2 }}
              >
                <Card sx={{ width: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{task?.title || 'Untitled'}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {task?.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip 
                        label={task?.status || 'pending'}
                        color={task?.status === 'completed' ? 'success' : 'default'}
                        size="small"
                      />
                      <Chip 
                        label={task?.priority || 'medium'}
                        color={
                          task?.priority === 'high' ? 'error' : 
                          task?.priority === 'medium' ? 'warning' : 
                          'info'
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )
      )}
    </Box>
  );
};

export default TaskList;