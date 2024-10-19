import { Request, Response, NextFunction } from 'express'
import { Invoice } from '../Models/InvoiceModel.js'
import * as invoiceManager from '../Manager/InvoiceManager.js'

export const uploadInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' })
      return
    }

    const pdfBuffer = req.file.buffer

    const invoice = await invoiceManager.createInvoiceData(pdfBuffer)

    res
      .status(201)
      .json({ message: 'The invoice was imported successfully', invoice })
  } catch (error) {
    next(error)
  }
}

export const getAllInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invoices = await invoiceManager.getAllInvoices()
    res.json(invoices)
  } catch (error) {
    next(error)
  }
}

export const getInvoicesByFilter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientNumber = req.body.clientNumber as string
    const startDate = req.body.startDate as string
    const endDate = req.body.endDate as string

    const criteria = {
      clientNumber: clientNumber,
      startDate: startDate,
      endDate: endDate,
    }
    const invoices = await invoiceManager.getInvoicesByFilter(criteria)
    res.json(invoices)
  } catch (error) {
    next(error)
  }
}

export const getInvoiceByClient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clientNumber } = req.params

    const invoices = await invoiceManager.getByClient(clientNumber)
    res.json(invoices)
  } catch (error) {
    next(error)
  }
}

export const getInvoicesPagination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const perPage = parseInt(req.query.perPage as string) || 20
    const clientNumber = req.query.clientNumber as string
    const referenceMonth = req.query.referenceMonth as string

    const criteria: any = {}
    if (clientNumber) criteria.clientNumber = clientNumber
    if (referenceMonth) criteria.referenceMonth = referenceMonth

    const invoices = await invoiceManager.getByPage(criteria, { page, perPage })
    res.json(invoices)
  } catch (error) {
    next(error)
  }
}

export const deleteInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    await invoiceManager.deleteInvoice(id)
    res.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    next(error)
  }
}
