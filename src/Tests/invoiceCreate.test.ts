import { saveInvoice } from '../Repository/InvoiceRepository.js'
import { expect, test, vi } from 'vitest'
import prisma from './libs/__mocks__/prisma.js'
import { Invoice } from '../Models/InvoiceModel.js'
vi.mock('./libs/prisma')

test('create invoice', async () => {
  const newInvoice: Invoice = {
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
  prisma.invoice.create.mockResolvedValue({ ...newInvoice })

  const invoice = await saveInvoice(newInvoice)
  const { id, createdAt, updatedAt, ...invoiceWithoutIdAndDates } = invoice

  expect(invoiceWithoutIdAndDates).toEqual(newInvoice)
})
