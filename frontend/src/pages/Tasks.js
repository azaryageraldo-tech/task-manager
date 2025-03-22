import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Card, CardContent, CardActions, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Tab, Tabs } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Share as ShareIcon } from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskInput, setTaskInput] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    deadline: '',
    categoryId: ''
  });
  const [shareEmail, setShareEmail] = useState('');

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
      await taskService.createTask(taskInput);
      setOpenDialog(false);
      setTaskInput({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        deadline: '',
        categoryId: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await taskService.updateTask(selectedTask.id, taskInput);
      setOpenDialog(false);
      setSelectedTask(null);
      setTaskInput({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        deadline: '',
        categoryId: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleShareTask = async () => {
    try {
      await taskService.shareTask({
        taskId: selectedTask.id,
        email: shareEmail,
        permission: 'view'
      });
      setOpenShareDialog(false);
      setShareEmail('');
      setSelectedTask(null);
    } catch (error) {
      console.error('Error sharing task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (tabValue === 0) return true; // All tasks
    if (tabValue === 1) return task.status === 'pending';
    if (tabValue === 2) return task.status === 'in_progress';
    return task.status === 'completed';
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Tasks Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Task
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="All" />
        <Tab label="Pending" />
        <Tab label="In Progress" />
        <Tab label="Completed" />
      </Tabs>

      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="textSecondary" sx={{ mb: 1 }}>
                  {task.description}
                </Typography>
                <Box sx={{ mb: 1 }}>
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
                </Box>
                <Typography variant="caption" display="block" color="text.secondary">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => {
                  setSelectedTask(task);
                  setTaskInput({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    deadline: task.deadline,
                    categoryId: task.categoryId
                  });
                  setOpenDialog(true);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => {
                  setSelectedTask(task);
                  setOpenShareDialog(true);
                }}>
                  <ShareIcon />
                </IconButton>
                <IconButton size="small" onClick={() => taskService.deleteTask(task.id).then(fetchData)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Task Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => {
        setOpenDialog(false);
        setSelectedTask(null);
        setTaskInput({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          deadline: '',
          categoryId: ''
        });
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={taskInput.title}
            onChange={(e) => setTaskInput({ ...taskInput, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={taskInput.description}
            onChange={(e) => setTaskInput({ ...taskInput, description: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            value={taskInput.categoryId}
            onChange={(e) => setTaskInput({ ...taskInput, categoryId: e.target.value })}
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
            value={taskInput.priority}
            onChange={(e) => setTaskInput({ ...taskInput, priority: e.target.value })}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            label="Status"
            fullWidth
            value={taskInput.status}
            onChange={(e) => setTaskInput({ ...taskInput, status: e.target.value })}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Deadline"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={taskInput.deadline}
            onChange={(e) => setTaskInput({ ...taskInput, deadline: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setSelectedTask(null);
            setTaskInput({
              title: '',
              description: '',
              priority: 'medium',
              status: 'pending',
              deadline: '',
              categoryId: ''
            });
          }}>Cancel</Button>
          <Button 
            onClick={selectedTask ? handleUpdateTask : handleCreateTask} 
            variant="contained"
          >
            {selectedTask ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Task Dialog */}
      <Dialog open={openShareDialog} onClose={() => {
        setOpenShareDialog(false);
        setSelectedTask(null);
        setShareEmail('');
      }}>
        <DialogTitle>Share Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenShareDialog(false);
            setSelectedTask(null);
            setShareEmail('');
          }}>Cancel</Button>
          <Button onClick={handleShareTask} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}