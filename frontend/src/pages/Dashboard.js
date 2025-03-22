import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Card, CardContent, CardActions, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: '',
    categoryId: ''
  });

  const fetchData = async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAllTasks(),
        categoryService.getAllCategories()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async () => {
    try {
      await taskService.createTask(newTask);
      setOpenDialog(false);
      setNewTask({ title: '', description: '', priority: 'medium', deadline: '', categoryId: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  {task.description}
                </Typography>
                <Chip 
                  label={task.priority}
                  color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'info'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={task.status}
                  color={task.status === 'completed' ? 'success' : 'default'}
                  size="small"
                />
                {task.Category && (
                  <Chip 
                    label={task.Category.name}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => {}}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            value={newTask.categoryId}
            onChange={(e) => setNewTask({ ...newTask, categoryId: e.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            margin="dense"
            label="Priority"
            fullWidth
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Deadline"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}