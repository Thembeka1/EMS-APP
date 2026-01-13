import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const Dashboard = () => {
  // This would typically come from your API/state management
  const stats = {
    totalEmployees: 0,
    totalDepartments: 0,
    recentHires: []
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Employees
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalEmployees}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Departments
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalDepartments}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Recent Hires */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Hires
            </Typography>
            {stats.recentHires.length > 0 ? (
              <ul>
                {stats.recentHires.map((hire, index) => (
                  <li key={index}>{hire}</li>
                ))}
              </ul>
            ) : (
              <Typography>No recent hires</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
