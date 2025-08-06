const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Analytics endpoint (placeholder)
app.post('/api/analytics/track', (req, res) => {
  // Log analytics data (in production, you'd save this to database)
  console.log('Analytics event:', req.body);
  res.json({ success: true });
});

// Form submissions endpoints
app.get('/api/form-submissions', (req, res) => {
  // Placeholder - return empty array for now
  res.json([]);
});

app.post('/api/form-submissions', (req, res) => {
  // Placeholder - just return success
  console.log('Form submission:', req.body);
  res.json({ success: true, id: Date.now() });
});

// News articles endpoints
app.get('/api/news-articles', (req, res) => {
  // Placeholder - return empty array for now
  res.json([]);
});

app.get('/api/news-articles/:id', (req, res) => {
  // Placeholder - return mock article
  res.json({
    id: req.params.id,
    title: 'Sample News Article',
    content: 'This is a sample news article.',
    created_at: new Date().toISOString()
  });
});

// Customer cases endpoints
app.get('/api/customer-cases', (req, res) => {
  // Placeholder - return empty array for now
  res.json([]);
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({
      success: true,
      data: {
        user: { id: 1, email: 'admin@example.com', role: 'admin' },
        token: 'mock-jwt-token'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', (req, res) => {
  // Mock user data
  res.json({
    id: 1,
    email: 'admin@example.com',
    role: 'admin'
  });
});

// Catch-all for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;