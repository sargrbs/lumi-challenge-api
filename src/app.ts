import dotenv from 'dotenv'
import express from 'express'
import invoiceRoutes from './Routes/InvoiceRoutes.js'
import { errorHandler } from './Middlewares/ErrorHandler.js'
import cors from 'cors'

const app = express()

const reactAppOrigin = process.env.REACT_APP_ORIGIN


app.use(
  cors({
    origin: reactAppOrigin,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/invoices', invoiceRoutes)

app.use(errorHandler)

console.log("CORS origin:", process.env.REACT_APP_ORIGIN);
export default app