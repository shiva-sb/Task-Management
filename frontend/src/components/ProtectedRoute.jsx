import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CircularProgress, Box } from '@mui/material'

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()

  // wait until auth state is resolved
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  // redirect ONLY if absolutely no token
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
