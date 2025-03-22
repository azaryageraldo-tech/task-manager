import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notifications';
import AuthProvider from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/categories" element={
                  <PrivateRoute>
                    <Layout>
                      <Categories />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/tasks" element={
                  <PrivateRoute>
                    <Layout>
                      <Tasks />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/notifications" element={
                  <PrivateRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </PrivateRoute>
                } />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
