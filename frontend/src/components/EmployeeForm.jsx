import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormLabel,
  Chip,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { employeesAPI, departmentsAPI } from '../services/api';
import { format, parseISO } from 'date-fns';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(/^[0-9+\-\s]+$/, 'Invalid phone number'),
  departmentId: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  hireDate: Yup.date().required('Hire date is required'),
  salary: Yup.number().min(0, 'Salary must be positive'),
  status: Yup.string().required('Status is required'),
  skills: Yup.array().of(Yup.string())
});

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'terminated', label: 'Terminated' }
];

const skillOptions = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Project Management',
  'Team Leadership', 'UI/UX Design', 'DevOps', 'Cloud Computing', 'Data Analysis'
];

function EmployeeForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isViewMode = location.pathname.includes('view');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      position: '',
      hireDate: new Date(),
      salary: '',
      status: 'active',
      skills: [],
      address: '',
      emergencyContact: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const employeeData = {
          ...values,
          hireDate: format(values.hireDate, 'yyyy-MM-dd')
        };

        if (id) {
          await employeesAPI.update(id, employeeData);
        } else {
          await employeesAPI.create(employeeData);
        }
        
        navigate('/employees');
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
        console.error('Error saving employee:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments for the dropdown
        const deptResponse = await departmentsAPI.getAll();
        setDepartments(deptResponse.data.departments || []);

        // If editing, fetch employee data
        if (id) {
          const response = await employeesAPI.getById(id);
          const employee = response.data;
          
          formik.setValues({
            ...employee,
            hireDate: employee.hireDate ? parseISO(employee.hireDate) : new Date(),
            skills: employee.skills || []
          });
        }
      } catch (error) {
        setError('Failed to load data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSkillToggle = (skill) => {
    const currentSkills = [...formik.values.skills];
    const skillIndex = currentSkills.indexOf(skill);
    
    if (skillIndex === -1) {
      currentSkills.push(skill);
    } else {
      currentSkills.splice(skillIndex, 1);
    }
    
    formik.setFieldValue('skills', currentSkills);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h5" component="h1">
            {isViewMode ? 'View Employee' : id ? 'Edit Employee' : 'Add New Employee'}
          </Typography>
          {isViewMode && (
            <Button
              variant="contained"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Edit
            </Button>
          )}
        </Box>

        {error && (
          <Box mb={3}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                disabled={isViewMode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                disabled={isViewMode}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={isViewMode}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="departmentId"
                  name="departmentId"
                  value={formik.values.departmentId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Department"
                  disabled={isViewMode}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.departmentId && formik.errors.departmentId && (
                  <FormHelperText>{formik.errors.departmentId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="position"
                name="position"
                label="Position"
                value={formik.values.position}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.position && Boolean(formik.errors.position)}
                helperText={formik.touched.position && formik.errors.position}
                disabled={isViewMode}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Hire Date"
                  value={formik.values.hireDate}
                  onChange={(date) => formik.setFieldValue('hireDate', date, true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
                      helperText={formik.touched.hireDate && formik.errors.hireDate}
                    />
                  )}
                  disabled={isViewMode}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Status"
                  disabled={isViewMode}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <FormLabel component="legend">Skills</FormLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {skillOptions.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onClick={isViewMode ? undefined : () => handleSkillToggle(skill)}
                    color={formik.values.skills.includes(skill) ? 'primary' : 'default'}
                    variant={formik.values.skills.includes(skill) ? 'filled' : 'outlined'}
                    avatar={formik.values.skills.includes(skill) ? <Avatar>✓</Avatar> : undefined}
                  />
                ))}
              </Box>
            </Grid>

            {!isViewMode && (
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !formik.isValid}
                  >
                    {loading ? <CircularProgress size={24} /> : id ? 'Update' : 'Create'}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default EmployeeForm;
