import { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Di sini bisa ditambahkan logging error ke service seperti Sentry
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We're sorry for the inconvenience. Please try again later.
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Return to Home
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="subtitle2" color="error">
                {this.state.error?.toString()}
              </Typography>
              <pre style={{ marginTop: '10px', color: '#666' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;