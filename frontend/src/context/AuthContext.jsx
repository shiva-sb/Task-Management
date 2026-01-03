import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

// 🔹 Create axios instance with backend base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL   // <-- IMPORTANT
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      }
    }
  }

  const logout = async () => {
  // No API call (JWT logout is client-side)
  localStorage.removeItem('token')
  setToken(null)
  setUser(null)
  delete api.defaults.headers.common['Authorization']
  navigate('/login')
}


  const updateUser = (userData) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}
