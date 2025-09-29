const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { monitoring, getSystemHealth } = require('./middleware/monitoring');
const logger = require('./utils/logger');
const connectDB = require('./config/database');

dotenv.config();
const app = express();

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Monitoring
app.use(monitoring);

// Routes
app.get('/api/v1/health', async (req, res) => {
  const health = await getSystemHealth();
  res.json(health);
});

app.get('/api/v1/config', (req, res) => {
  res.json({
    version: "1.0.0",
    features: ["auth", "books", "users", "monitoring"]
  });
});

// Import routers
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/books', require('./routes/books'));

// Error handling
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});
