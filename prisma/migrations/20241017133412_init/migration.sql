-- DropEnum
DROP TYPE "crdb_internal_region";

-- CreateTable
CREATE TABLE "Invoice" (
    "id" STRING NOT NULL,
    "clientNumber" STRING NOT NULL,
    "installationNumber" STRING NOT NULL,
    "referenceMonth" STRING NOT NULL,
    "electricityQuantity" INT4 NOT NULL,
    "electricityTotal" FLOAT8 NOT NULL,
    "energySceeeQuantity" INT4 NOT NULL,
    "energySceeeTotal" FLOAT8 NOT NULL,
    "economyGDIQuantity" INT4 NOT NULL,
    "economyGDITotal" FLOAT8 NOT NULL,
    "publicLighting" FLOAT8 NOT NULL,
    "totalCost" FLOAT8 NOT NULL,
    "invoiceDueDate" TIMESTAMP(3) NOT NULL,
    "paymentCode" STRING NOT NULL,
    "totalConsumption" FLOAT8 NOT NULL,
    "totalWithoutGD" FLOAT8 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
