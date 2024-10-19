import dotenv from 'dotenv'
import express from 'express'
import invoiceRoutes from './Routes/InvoiceRoutes.js'
import { errorHandler } from './Middlewares/ErrorHandler.js'
import cors from 'cors'

dotenv.config()
const app = express()
const reactAppOrigin = process.env.REACT_APP || 'http://localhost:5173'

app.use((req, res, next) => {
  next()
})

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

export default app
