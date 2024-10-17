import express from 'express';
import invoiceRoutes from './Routes/InvoiceRoutes.js';
import { errorHandler } from './Middlewares/ErrorHandler.js';

const app = express();

app.use(express.json());
app.use('/api/invoices', invoiceRoutes);
app.use(errorHandler);

export default app;