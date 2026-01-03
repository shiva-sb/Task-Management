const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findAllByUser(req.userId);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Task.getStats(req.userId);
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Create task
router.post('/', [
  auth,
  body('title').notEmpty().trim().escape(),
  body('status').optional().isIn(['Todo', 'In Progress', 'Completed'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, status = 'Todo' } = req.body;
    
    const task = await Task.create({
      title,
      status,
      userId: req.userId
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', [
  auth,
  body('title').optional().trim().escape(),
  body('status').optional().isIn(['Todo', 'In Progress', 'Completed'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const taskId = req.params.id;
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    const task = await Task.update(taskId, req.userId, updates);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error.message);
    
    if (error.message.includes('No rows found')) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const result = await Task.delete(taskId, req.userId);
    
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    
    if (error.message.includes('No rows found')) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;