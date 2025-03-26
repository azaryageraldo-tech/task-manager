import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { taskService } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug log
      console.log('Fetching tasks...');
      const response = await taskService.getAllTasks();
      console.log('Response:', response);
      
      if (response?.data) {
        console.log('Tasks data:', response.data);
        setTasks(response.data);
      } else {
        console.warn('No tasks data in response');
        setTasks([]);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {tasks.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Alert severity="info">No tasks found. Create your first task!</Alert>
            </Paper>
          </Grid>
        ) : (
          tasks.map(task => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="text.secondary">{task.description}</Typography>
                <Typography>Status: {task.status}</Typography>
                <Typography>Priority: {task.priority}</Typography>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;