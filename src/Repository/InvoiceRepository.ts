import prisma from '../Config/Database.js';
import { Invoice } from '../Models/InvoiceModel.js';

export const saveInvoice = async (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) : Promise<Invoice> => {

    const invoice = await prisma.invoice.create({
        data: data
    });

    return invoice;
}

export const findAllInvoices = async () => {
    const invoices = await prisma.invoice.findMany();
    return invoices;
}

export const findBy = async (criteria: {}) => {
    const invoices = await prisma.invoice.findMany({
        where: criteria
    });
    
    return invoices;
}