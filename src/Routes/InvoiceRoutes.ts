import { Router } from 'express';
import multer from 'multer';
import * as InvoiceController from '../Controllers/InvoiceController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/upload', upload.single('invoice'), InvoiceController.uploadInvoice);
router.get('/', InvoiceController.getAllInvoices);
router.get('/client/:clientNumber', InvoiceController.getInvoiceByClient);

export default router;