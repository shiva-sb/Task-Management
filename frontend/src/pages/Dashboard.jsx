import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  PlayArrow,
  Pending,
  CheckCircle
} from "@mui/icons-material";

// ---------- CHART.JS IMPORTS ----------
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Todo");

  // stats data
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0
  });

  // ------- LOAD DATA -------
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/tasks/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  // ------- CRUD -------
  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post("/api/tasks", { title, status });
      setTasks(prev => [...prev, res.data]);
      setTitle("");
      setStatus("Todo");
      fetchStats();
    } catch (err) {
      console.error("Create task error:", err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      fetchStats();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === id ? res.data : t)));
      fetchStats();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ------- ICONS -------
  const getStatusIcon = (s) => {
    if (s === "Completed") return <CheckCircle color="success" />;
    if (s === "In Progress") return <PlayArrow color="primary" />;
    return <Pending color="action" />;
  };

  // ------- CHART DATA -------
  const chartData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        data: [stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0"],
        borderColor: "#ffffff",
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    cutout: "70%"
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 3 }}>

        {/* HEADER AND LOGOUT */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5">
            👋 Welcome, {user?.username || user?.email}
          </Typography>

          <Typography color="text.secondary">
            Total Tasks: {stats.total}
          </Typography>

          <Button
            sx={{ mt: 2 }}
            color="error"
            variant="outlined"
            onClick={logout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Paper>

        {/* -------- CHART SECTION -------- */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Task Statistics</Typography>

          <Box sx={{ width: 300, mx: "auto", mt: 2 }}>
            <Doughnut data={chartData} options={chartOptions} />
          </Box>
        </Paper>

        {/* -------- ADD TASK -------- */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Add Task</Typography>

          <form onSubmit={createTask}>
            <TextField
              fullWidth
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />

            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              margin="normal"
            >
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </form>
        </Paper>

        {/* -------- TASK LIST -------- */}
        <Typography variant="h5" gutterBottom>
          Your Tasks
        </Typography>

        {tasks.length === 0 && (
          <Typography color="text.secondary">
            No tasks yet — add one above.
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {tasks.map((task) => (
            <Grid key={task.id} item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(task.status)}
                    <Chip label={task.status} />
                  </Box>

                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {task.title}
                  </Typography>
                </CardContent>

                <CardActions>

                  <TextField
                    select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(task.id, e.target.value)
                    }
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="Todo">Todo</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </TextField>

                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </>
  );
};

export default Dashboard;
