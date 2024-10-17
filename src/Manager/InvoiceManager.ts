import * as pdfExtractorService from '../Utils/PdfExtractor.js';
import * as invoiceRepository from '../Repository/InvoiceRepository.js'

export const createInvoiceData =  async (pdfBuffer: Buffer) => {

    const extractedData = await pdfExtractorService.extractDataFromPdf(pdfBuffer);

    const criteria = {
        clientNumber: extractedData.clientNumber,
        installationNumber: extractedData.installationNumber,
        referenceMonth: extractedData.referenceMonth
    }

    const checkInvoice = await invoiceRepository.findBy(criteria);

    if(checkInvoice.length > 0) {
       return checkInvoice[0];
    }
    
    const invoice = invoiceRepository.saveInvoice(extractedData);

    return invoice;
}

export const getAllInvoices = async () => {
   return await invoiceRepository.findAllInvoices();
}

export const getByClient = async (clientNumber: string) => {
    
    const criteria = {
        clientNumber: clientNumber
    }

    return await invoiceRepository.findBy(criteria);
}