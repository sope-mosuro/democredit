import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './Routes/userRoutes';
import walletRoutes from './Routes/walletRoutes';
import transactionRoutes from './Routes/transactionRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Demo credit API...');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
