import { expect, describe, it } from 'vitest'
import { sumTotalConsumption, sumTotalWithoutGD } from '../Utils/PdfExtractor'

describe('Invoice Calculations', () => {
  it('should correctly calculate values', () => {
    const invoiceData = {
      electricityQuantity: 50,
      energySceeeQuantity: 504,
      electricityTotal: 47.92,
      energySceeeTotal: 257.74,
      publicLighting: 49.43,
    }

    const totalConsumption = sumTotalConsumption(
      invoiceData.electricityQuantity,
      invoiceData.energySceeeQuantity
    )
    const totalWithoutGD = sumTotalWithoutGD(
      invoiceData.electricityTotal,
      invoiceData.energySceeeTotal,
      invoiceData.publicLighting
    )

    expect(totalConsumption).toBe(554)
    expect(totalWithoutGD).toBeCloseTo(355.09, 2)
  })

  it('should handle zero values correctly', () => {
    const invoiceData = {
      electricityQuantity: 0,
      energySceeeQuantity: 0,
      electricityTotal: 0,
      energySceeeTotal: 0,
      publicLighting: 0,
    }

    const totalConsumption = sumTotalConsumption(
      invoiceData.electricityQuantity,
      invoiceData.energySceeeQuantity
    )
    const totalWithoutGD = sumTotalWithoutGD(
      invoiceData.electricityTotal,
      invoiceData.energySceeeTotal,
      invoiceData.publicLighting
    )

    expect(totalConsumption).toBe(0)
    expect(totalWithoutGD).toBe(0)
  })
})
