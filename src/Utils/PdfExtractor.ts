import { PDFExtract, PDFExtractResult } from 'pdf.js-extract';
import { Invoice } from '../Models/InvoiceModel.js';

const pdfExtract = new PDFExtract();

export const extractDataFromPdf = async (pdfBuffer: Buffer): Promise<Invoice> => {
  try {
    const data: PDFExtractResult = await pdfExtract.extractBuffer(pdfBuffer);
    const text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');

    const { clientNumber, installationNumber } = extractClientAndInstallationNumbers(text);
    const referenceMonth = extractReferenceMonth(text);
    const electricityQuantity = extractElectricityQuantity(text);
    const electricityTotal = extractElectricityTotal(text);
    const energySceeeQuantity = extractEnergySceeeQuantity(text);
    const energySceeeTotal = extractEnergySceeeTotal(text);
    const publicLighting = extractPublicLighting(text);
    const economyGDIQuantity = extractEconomyGDIQuantity(text);
    const economyGDITotal = extractEconomyGDITotal(text);
    const totalCost = extractTotalCost(text);
    const { dueDate, paymentCode, clientName } = extractDueDatePaymentCodeClientName(text);
    const totalConsumption  = sumTotalConsumption(electricityQuantity, energySceeeQuantity);
    const totalWithoutGD = sumTotalWithoutGD(electricityTotal, energySceeeTotal, publicLighting);
    const invoiceDueDate = new Date(dueDate);

    const extractedData = {
      clientName,
      clientNumber,
      installationNumber,
      referenceMonth,
      electricityQuantity,
      electricityTotal,
      energySceeeQuantity,
      energySceeeTotal,
      economyGDIQuantity,
      economyGDITotal,
      publicLighting,
      totalCost,
      invoiceDueDate, 
      paymentCode,
      totalConsumption,
      totalWithoutGD
    };

    return extractedData;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};

export function sumTotalConsumption(electricityQuantity: number, energySceeeQuantity: number):  number
{
  return  electricityQuantity + energySceeeQuantity;
}

export function sumTotalWithoutGD(electricityTotal: number, energySceeeTotal: number, publicLighting: number):  number
{
  return electricityTotal + energySceeeTotal + publicLighting;
}


function extractClientAndInstallationNumbers(text: string): { clientNumber: string, installationNumber: string } 
{
  const regex = /Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\s+(\d+)\s+(\d+)/;
  const match = text.match(regex);

  if (match) {
    return {
      clientNumber: match[1],
      installationNumber: match[2]
    };
  }

  return {
    clientNumber: '',
    installationNumber: ''
  };
}

function extractReferenceMonth(text: string): string 
{
  const regex = /Referente a\s+Vencimento\s+Valor a pagar \(R\$\)\s+(\w+\/\d{4})/;
  const match = text.match(regex);
  return match ? match[1] : '';
}

function extractElectricityQuantity(text: string): number 
{
  const match = text.match(/Energia Elétrica\s+kWh\s+([-]?[\d.,]+)\s+/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractElectricityTotal(text: string): number 
{
  const match = text.match(/Energia Elétrica\s+kWh\s+(?:[-]?[\d.,]+\s+){2}([-]?[\d.,]+)/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractEnergySceeeQuantity(text: string): number 
{
  const match = text.match(/Energia SCEE s\/ ICMS\s+kWh\s+([-]?[\d.,]+)\s+/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractEnergySceeeTotal(text: string): number 
{
  const match = text.match(/Energia SCEE s\/ ICMS\s+kWh\s+(?:[-]?[\d.,]+\s+){2}([-]?[\d.,]+)/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractEconomyGDIQuantity(text: string): number 
{
  const match = text.match(/Energia compensada GD I\s+kWh\s+([-]?[\d.,]+)\s+/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractEconomyGDITotal(text: string): number 
{
  const match = text.match(/Energia compensada GD I\s+kWh\s+(?:[-]?[\d.,]+\s+){2}([-]?[\d.,]+)/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractPublicLighting(text: string): number 
{
  const match = text.match(/Contrib Ilum Publica Municipal\s+([-]?[\d.,]+)\s+/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}

function extractTotalCost(text: string): number 
{
  const match = text.match(/TOTAL\s+([-]?[\d.,]+)\s+/);
  return match ? parseFloat(match[1].replace('.', '').replace(',', '.')) : 0;
}


function extractDueDatePaymentCodeClientName(text: string): { dueDate: string, paymentCode: string, clientName: string } 
{

  const dueDateRegex = /(\d{2}\/\d{2}\/\d{4})/;
  const dueDateMatch = text.match(dueDateRegex);
  const dueDate = dueDateMatch ? dueDateMatch[1] : '';

  const paymentCodeRegex = /((\d+)-\d\s+(\d+)-\d\s+(\d+)-\d\s+(\d+)-\d)/;
  const paymentCodeMatch = text.match(paymentCodeRegex);
  const paymentCode = paymentCodeMatch ? paymentCodeMatch[1].replace(/\s+/g, '') : '';

  const clientNameRegex = /((\d+)-\d\s+(\d+)-\d\s+(\d+)-\d\s+(\d+)-\d)\s+ATENÇÃO: DÉBITO AUTOMÁTICO\s+([A-Za-zÀ-ÿ\s]+)/;
  const clientNameMatch = text.match(clientNameRegex);
  const clientName = clientNameMatch ? extractLTDA(clientNameMatch[6]) : extractName(text);

  return {
    dueDate,
    paymentCode,
    clientName
  };
}

function extractLTDA(text: string): string 
{
  const regex = /LTDA\.?\s*.*/i;
  
  return text.replace(regex, 'LTDA').trim();
}

function extractName(text: string): string 
{
  const clientNameRegex = /((\d+)-\d\s+(\d+)-\d\s+(\d+)-\d\s+(\d+)-\d)\s+([A-Za-zÀ-ÿ\s]+)/;
  const clientNameMatch = text.match(clientNameRegex);
  const clientName = clientNameMatch ? clientNameMatch[6] : '';

  return clientName.trim()
}
