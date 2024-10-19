import { Router } from 'express'
import multer from 'multer'
import * as InvoiceController from '../Controllers/InvoiceController.js'
import upload from '../Middlewares/MulterConfig.js'

const router = Router()

router.post(
  '/upload',
  upload.single('invoice'),
  InvoiceController.uploadInvoice
)
router.post('/filter', InvoiceController.getInvoicesByFilter)

router.get('/', InvoiceController.getAllInvoices)
router.get(
  '/page/:page/:clientNumber?/:referenceMonth?',
  InvoiceController.getInvoicesPagination
)

router.delete('/delete/:id', InvoiceController.deleteInvoice)

export default router
