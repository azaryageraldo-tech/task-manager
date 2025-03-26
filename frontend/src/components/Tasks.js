import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { 
  CircularProgress, 
  Alert,
  Container,
  Typography 
} from '@mui/material';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();
      console.log('Tasks response:', response.data);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load tasks');
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
    <Container>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>
      {tasks.length === 0 ? (
        <Typography>No tasks found</Typography>
      ) : (
        tasks.map(task => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))
      )}
    </Container>
  );
};

export default Tasks;