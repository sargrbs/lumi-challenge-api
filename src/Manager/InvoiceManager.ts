import * as pdfExtractorService from '../Utils/PdfExtractor.js'
import * as invoiceRepository from '../Repository/InvoiceRepository.js'
import { parse, addMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Invoice } from '../Models/InvoiceModel.js'

interface FilterCriteria {
  clientNumber?: string
  startDate?: string
  endDate?: string
}

export const createInvoiceData = async (pdfBuffer: Buffer) => {
  const result = await pdfExtractorService.extractDataFromPdf(pdfBuffer)

  if(!result.success){
    return { message: result.message, code: 400 }
  }

  const extractedData = result.data

  const criteria = {
    clientNumber: extractedData.clientNumber,
    installationNumber: extractedData.installationNumber,
    referenceMonth: extractedData.referenceMonth,
  }

  const checkInvoice = await invoiceRepository.findBy(criteria)

  if (checkInvoice.length > 0) {
    return { message: 'Invoice already imported', data: checkInvoice[0], code: 200 }
  }

  const invoice = invoiceRepository.saveInvoice(extractedData)

  return { message: 'The invoice was imported successfully', data: invoice, code: 201 }
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

export const getByPage = async (
  page: string,
  clientNumber: any,
  referenceMonth: any
) => {
  const pageNumber = parseInt(page)

  const criteria: any = {}

  if (clientNumber != undefined && clientNumber != 'false') {
    criteria.clientNumber = clientNumber
  }
  if (referenceMonth != undefined && referenceMonth !== 'false') {
    criteria.referenceMonth = formatReferenceMonth(referenceMonth)
  }

  return await invoiceRepository.getByPage(criteria, pageNumber)
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

const formatReferenceMonth = (dateString: string) => {
  if (dateString === 'false') return dateString

  const date = parse(dateString, 'yyyy-MM', new Date())
  return format(date, 'MMM/yyyy', { locale: ptBR }).toUpperCase()
}
