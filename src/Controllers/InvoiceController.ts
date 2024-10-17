import { Request, Response, NextFunction } from 'express';
import { Invoice } from '../Models/InvoiceModel.js';
import * as invoiceManager from '../Manager/InvoiceManager.js';

export const uploadInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    
    const pdfBuffer = req.file.buffer;
    
    const invoice = await invoiceManager.createInvoiceData(pdfBuffer);

    res.json({message: 'The invoice was imported successfully', invoice});
  } catch (error) {
    next(error);
  }
};

export const getAllInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoices: Invoice[] = await invoiceManager.getAllInvoices();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceByClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { clientNumber } = req.params;
  
    const invoices: Invoice[] = await invoiceManager.getByClient(clientNumber);
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};