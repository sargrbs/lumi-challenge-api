import prisma from '../Config/Database.js'
import { Invoice } from '../Models/InvoiceModel.js'

interface PaginationParams {
  page?: number
  perPage?: number
}

interface PaginatedResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

interface FilterCriteria {
  clientNumber?: string
  startDate?: any
  endDate?: any
}

export const saveInvoice = async (
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Invoice> => {
  const invoice = await prisma.invoice.create({
    data: data,
  })

  return invoice
}

export const findAllInvoices = async () => {
  const invoices = await prisma.invoice.findMany()
  return invoices
}

export const findBy = async (criteria: {}) => {
  const invoices = await prisma.invoice.findMany({
    where: criteria,
  })
  return invoices
}

export const findByFilter = async (criteriaData: FilterCriteria) => {
  const where: any = {}

  if (criteriaData.clientNumber && criteriaData.clientNumber.trim() !== '') {
    where.clientNumber = criteriaData.clientNumber.trim()
  }

  if (criteriaData.startDate || criteriaData.endDate) {
    where.invoiceDueDate = {}
    if (criteriaData.startDate) {
      where.invoiceDueDate.gte = new Date(criteriaData.startDate)
    }
    if (criteriaData.endDate) {
      where.invoiceDueDate.lte = new Date(criteriaData.endDate)
    }
  }

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: {
      invoiceDueDate: 'asc',
    },
  })

  return invoices
}

export const getByPage = async (
  criteria: any,
  { page = 1, perPage = 20 }: PaginationParams = {}
): Promise<PaginatedResult<any>> => {
  const skip = (page - 1) * perPage

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: criteria,
      skip,
      take: perPage,
      orderBy: {
        referenceMonth: 'desc',
      },
    }),
    prisma.invoice.count({ where: criteria }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return {
    data: invoices,
    pagination: {
      total,
      page,
      perPage,
      totalPages,
    },
  }
}

export const deleteInvoice = async (id: string) => {
  const deletedInvoice = await prisma.invoice.delete({
    where: {
      id: id,
    },
  })

  return deletedInvoice
}
