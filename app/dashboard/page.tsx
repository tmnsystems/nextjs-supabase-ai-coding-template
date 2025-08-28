'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '@/auth/useAuth'
import { ItemService } from '@/services/itemService'
import { ProfileService } from '@/services/profileService'
import { Item, Profile } from '@/types/models'
import { useSnackbar } from 'notistack'

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [items, setItems] = useState<Item[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      loadData()
    }
  }, [user, authLoading, router])

  const loadData = async () => {
    if (!user) return
    
    try {
      const itemService = new ItemService()
      const profileService = new ProfileService()
      
      const [userItems, userProfile] = await Promise.all([
        itemService.getItems(user.id),
        profileService.getProfile(user.id),
      ])
      
      setItems(userItems)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error loading data:', error)
      enqueueSnackbar('Failed to load data', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      enqueueSnackbar('Successfully signed out', { variant: 'success' })
      router.push('/')
    } catch (error) {
      enqueueSnackbar('Failed to sign out', { variant: 'error' })
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => router.push('/profile')}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              <LogoutIcon sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <div>
                <Typography variant="h4" gutterBottom>
                  Welcome, {profile?.display_name || user?.email?.split('@')[0]}!
                </Typography>
                <Chip
                  label={profile?.subscription_status || 'free'}
                  color={profile?.is_paid ? 'success' : 'default'}
                  size="small"
                />
              </div>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/items/new')}
              >
                New Item
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Items
                </Typography>
                <Typography variant="h3">
                  {items.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h3">
                  {items.filter(item => item.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h3">
                  {items.filter(item => item.status === 'in_progress').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Recent Items
            </Typography>
          </Grid>

          {items.slice(0, 6).map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {item.description}
                  </Typography>
                  <Chip
                    label={item.status.replace('_', ' ')}
                    size="small"
                    color={
                      item.status === 'completed' ? 'success' :
                      item.status === 'in_progress' ? 'primary' : 'default'
                    }
                  />
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => router.push(`/items/${item.id}`)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}