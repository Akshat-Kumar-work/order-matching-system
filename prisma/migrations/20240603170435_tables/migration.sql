-- CreateTable
CREATE TABLE "Buy_Orders" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER,
    "price" DOUBLE PRECISION,
    "isPending" BOOLEAN DEFAULT true,

    CONSTRAINT "Buy_Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sell_Orders" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION,
    "quantity" INTEGER,
    "isPending" BOOLEAN DEFAULT true,

    CONSTRAINT "Sell_Orders_pkey" PRIMARY KEY ("id")
);
