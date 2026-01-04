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
  Chip,
  Divider
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  PlayArrow,
  Pending,
  CheckCircle
} from "@mui/icons-material";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Todo");

  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/tasks/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await api.post("/api/tasks", { title, status });
      setTasks((prev) => [...prev, res.data]);
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
      await api.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      fetchStats();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      fetchStats();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const getStatusIcon = (s) => {
    if (s === "Completed") return <CheckCircle color="success" />;
    if (s === "In Progress") return <PlayArrow color="primary" />;
    return <Pending color="warning" />;
  };

  const chartData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        data: [stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ["#ff6b6b", "#4dabf7", "#51cf66"],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    plugins: { legend: { position: "bottom" } },
    cutout: "70%"
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        }}
      >
        <Container maxWidth="lg">
          
          {/* HEADER CARD */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backdropFilter: "blur(8px)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Welcome, {user?.username || user?.email}
            </Typography>

            <Typography sx={{ opacity: 0.9 }}>
              Total Tasks: {stats.total}
            </Typography>

            <Button
              sx={{ mt: 2, borderColor: "white", color: "white" }}
              variant="outlined"
              onClick={logout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Paper>

          <Grid container spacing={3}>
            
            {/* CHART CARD */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📊 Task Statistics
                </Typography>
                <Divider />
                <Box sx={{ width: 300, mx: "auto", mt: 2 }}>
                  <Doughnut data={chartData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>

            {/* ADD TASK */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6">Add New Task</Typography>

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
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
                  >
                    Add Task
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>

          {/* TASK LIST */}
          <Typography
            variant="h5"
            mt={4}
            mb={1}
            color="white"
            fontWeight="bold"
          >
             Your Tasks
          </Typography>

          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid key={task.id} item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(task.status)}
                      <Chip
                        label={task.status}
                        color={
                          task.status === "Completed"
                            ? "success"
                            : task.status === "In Progress"
                            ? "primary"
                            : "warning"
                        }
                      />
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
      </Box>
    </>
  );
};

export default Dashboard;
