import { expect, test, vi } from 'vitest'
import prisma from './libs/__mocks__/prisma.js'
import { Invoice } from '../Models/InvoiceModel.js'
import { createInvoice } from './libs/script.js'

vi.mock('./libs/prisma')

test('create invoice', async () => {
  const newInvoiceInput: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
    clientName: 'JOSE MESALY FONSECA DE CARVALHO',
    clientNumber: '7204076116',
    installationNumber: '3001116735',
    referenceMonth: 'MAR/2024',
    electricityQuantity: 50,
    electricityTotal: 47.92,
    energySceeeQuantity: 504,
    energySceeeTotal: 257.74,
    economyGDIQuantity: 504,
    economyGDITotal: -245.61,
    publicLighting: 49.43,
    totalCost: 109.48,
    invoiceDueDate: new Date('2024-04-02'),
    paymentCode: '83660000001-909480138009-161131014433-608110755504-7',
    totalConsumption: 554,
    totalWithoutGD: 355.09,
  }

  const mockCreatedInvoice: Required<Invoice> = {
    ...newInvoiceInput,
    id: 'mocked-id',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  prisma.invoice.create.mockResolvedValue(mockCreatedInvoice)

  const invoice = await createInvoice(newInvoiceInput)

  const { id, createdAt, updatedAt, ...invoiceWithoutIdAndDates } = invoice

  expect(invoiceWithoutIdAndDates.clientName).toBe(mockCreatedInvoice.clientName)
  expect(invoiceWithoutIdAndDates.clientNumber).toBe(mockCreatedInvoice.clientNumber)
  expect(invoiceWithoutIdAndDates.referenceMonth).toBe(mockCreatedInvoice.referenceMonth)
  expect(invoiceWithoutIdAndDates.electricityTotal).toBe(mockCreatedInvoice.electricityTotal)
  expect(invoiceWithoutIdAndDates.paymentCode).toBe(mockCreatedInvoice.paymentCode)
  expect(invoiceWithoutIdAndDates.totalWithoutGD).toBe(mockCreatedInvoice.totalWithoutGD)
  expect(invoiceWithoutIdAndDates.totalConsumption).toBe(mockCreatedInvoice.totalConsumption)
})