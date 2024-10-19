import { expect, describe, it, beforeAll } from 'vitest'
import { extractDataFromPdf } from '../Utils/PdfExtractor'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('PDF Extractor', () => {
  const pdfPath = path.join(__dirname, 'data', 'test1.pdf')

  beforeAll(() => {
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Test file not found: ${pdfPath}`)
    }
  })

  it('should correctly extract data from a PDF', async () => {
    const pdfBuffer = fs.readFileSync(pdfPath)

    const extractedData = await extractDataFromPdf(pdfBuffer)

    expect(extractedData.clientName).toBe('JOSE MESALY FONSECA DE CARVALHO')
    expect(extractedData.clientNumber).toBe('7204076116')
    expect(extractedData.installationNumber).toBe('3001116735')
    expect(extractedData.referenceMonth).toBe('MAR/2024')
    expect(extractedData.electricityQuantity).toBe(50)
    expect(extractedData.electricityTotal).toBeCloseTo(47.92, 2)
    expect(extractedData.energySceeeQuantity).toBe(504)
    expect(extractedData.energySceeeTotal).toBeCloseTo(257.74, 2)
    expect(extractedData.economyGDIQuantity).toBe(504)
    expect(extractedData.economyGDITotal).toBeCloseTo(-245.61, 2)
    expect(extractedData.publicLighting).toBeCloseTo(49.43, 2)
    expect(extractedData.totalCost).toBeCloseTo(109.48, 2)

    expect(extractedData.invoiceDueDate.toISOString().split('T')[0]).toBe(
      '2024-02-04'
    )

    expect(extractedData.paymentCode).toBe(
      '83660000001-909480138009-161131014433-608110755504-7'
    )
    expect(extractedData.totalConsumption).toBe(554)
    expect(extractedData.totalWithoutGD).toBeCloseTo(355.09, 2)
  })
})
