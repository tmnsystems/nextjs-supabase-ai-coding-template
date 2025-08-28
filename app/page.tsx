'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material'
import { useAuth } from '@/auth/useAuth'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DashboardIcon from '@mui/icons-material/Dashboard'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Next.js Supabase AI Template
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          A modern full-stack application template with authentication, database, and AI-ready architecture
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sign In
            </Typography>
            <Typography color="text.secondary" paragraph>
              Access your existing account
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/signin')}
              size="large"
            >
              Sign In
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <PersonAddIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Sign Up
            </Typography>
            <Typography color="text.secondary" paragraph>
              Create a new account
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => router.push('/signup')}
              size="large"
            >
              Get Started
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              🔐 Authentication
            </Typography>
            <Typography color="text.secondary">
              Secure user authentication with Supabase Auth including email/password and OAuth providers
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              💾 Real-time Database
            </Typography>
            <Typography color="text.secondary">
              PostgreSQL database with real-time subscriptions and row-level security
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              🚀 Production Ready
            </Typography>
            <Typography color="text.secondary">
              TypeScript, Material-UI, form validation, error handling, and best practices built-in
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}