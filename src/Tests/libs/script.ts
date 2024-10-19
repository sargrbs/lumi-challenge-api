import { Prisma } from '@prisma/client'
import prisma from './prisma.js'


export const createInvoice = async (invoice: Prisma.InvoiceCreateInput) => {
 
  return await prisma.invoice.create({
    data: invoice,
  })
}