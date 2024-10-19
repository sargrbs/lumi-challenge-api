import * as pdfExtractorService from '../Utils/PdfExtractor.js'
import * as invoiceRepository from '../Repository/InvoiceRepository.js'
import {
  parse,
  addMonths,
  format,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  endOfMonth,
} from 'date-fns'

interface PaginationParams {
  page?: number
  perPage?: number
}
interface FilterCriteria {
  clientNumber?: string
  startDate?: string
  endDate?: string
}

export const createInvoiceData = async (pdfBuffer: Buffer) => {
  const extractedData = await pdfExtractorService.extractDataFromPdf(pdfBuffer)
  const criteria = {
    clientNumber: extractedData.clientNumber,
    installationNumber: extractedData.installationNumber,
    referenceMonth: extractedData.referenceMonth,
  }

  const checkInvoice = await invoiceRepository.findBy(criteria)

  if (checkInvoice.length > 0) {
    return checkInvoice[0]
  }

  const invoice = invoiceRepository.saveInvoice(extractedData)

  return invoice
}

export const getAllInvoices = async () => {
  return await invoiceRepository.findAllInvoices()
}

export const getInvoicesByFilter = async (criteria: FilterCriteria) => {
  let startDate = criteria.startDate
    ? startDateAdjust(criteria.startDate + '-01')
    : ''
  let endDate = criteria.endDate ? endDateAdjust(criteria.endDate + '-28') : ''

  const criteriaData = {
    clientNumber: criteria.clientNumber,
    startDate: startDate,
    endDate: endDate,
  }

  return await invoiceRepository.findByFilter(criteriaData)
}

export const getByClient = async (clientNumber: string) => {
  const criteria = {
    clientNumber: clientNumber,
  }
  return await invoiceRepository.getByPage(criteria)
}

export const getByPage = async (
  criteria: string,
  { page, perPage }: PaginationParams = {}
) => {
  return await invoiceRepository.getByPage(criteria, { page, perPage })
}

export const deleteInvoice = async (id: string) => {
  return await invoiceRepository.deleteInvoice(id)
}

function startDateAdjust(date: string): Date {
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
  const adjustedDate = addMonths(parsedDate, 1)
  return adjustedDate
}

function endDateAdjust(date: string): Date {
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date())

  let adjustedDate = addMonths(parsedDate, 1)

  return adjustedDate
}
