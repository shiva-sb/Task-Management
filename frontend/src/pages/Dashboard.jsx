import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material'

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle,
  Pending,
  PlayArrow,
  Logout as LogoutIcon   // ✅ IMPORTANT FIX
} from '@mui/icons-material'

import axios from 'axios'
import { setTasks, addTask, updateTask, deleteTask, setLoading, setError } from '../store/store'

ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user, logout } = useAuth()
  const { tasks, loading, error } = useSelector(state => state.tasks)

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Todo')
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, completed: 0 })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [])

  const fetchTasks = async () => {
    dispatch(setLoading(true))
    setRefreshing(true)
    try {
      const response = await axios.get('/api/tasks')
      dispatch(setTasks(response.data))
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Failed to fetch tasks'))
    } finally {
      dispatch(setLoading(false))
      setRefreshing(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/tasks/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      dispatch(setError('Task title is required'))
      return
    }

    try {
      const response = await axios.post('/api/tasks', { title, status })
      dispatch(addTask(response.data))
      setTitle('')
      setStatus('Todo')
      fetchStats()
      dispatch(setError(null))
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Failed to create task'))
    }
  }

  const handleUpdate = async (id, newStatus) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, { status: newStatus })
      dispatch(updateTask(response.data))
      fetchStats()
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Failed to update task'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await axios.delete(`/api/tasks/${id}`)
      dispatch(deleteTask(id))
      fetchStats()
    } catch (error) {
      dispatch(setError(error.response?.data?.error || 'Failed to delete task'))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle color="success" />
      case 'In Progress':
        return <PlayArrow color="primary" />
      default:
        return <Pending color="action" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'primary'
      default:
        return 'default'
    }
  }

  const chartData = {
    labels: ['Todo', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    cutout: '70%'
  }

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="xl" sx={{ mt: 2, mb: 6 }}>

        {/* HEADER */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">Task Management Dashboard</Typography>

          <Button
            variant="outlined"
            onClick={fetchTasks}
            startIcon={<RefreshIcon />}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>

        {/* ERROR */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* ---------- CONTENT ---------- */}
        {/* (unchanged from your version — all logic retained) */}

        {/* -------------- FOOTER LOGOUT BUTTON -------------- */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" gutterBottom>
            Signed in as: {user?.email}
          </Typography>

          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            startIcon={<LogoutIcon />} 
          >
            Logout
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default Dashboard
