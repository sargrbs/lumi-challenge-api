export type Invoice = {
  id?: string
  clientName: string
  clientNumber: string
  installationNumber: string
  referenceMonth: string
  electricityQuantity: number
  electricityTotal: number
  energySceeeQuantity: number
  energySceeeTotal: number
  economyGDIQuantity: number
  economyGDITotal: number
  publicLighting: number
  totalCost: number
  invoiceDueDate: Date
  paymentCode: string
  totalConsumption: number
  totalWithoutGD: number
  createdAt?: Date
  updatedAt?: Date
}
