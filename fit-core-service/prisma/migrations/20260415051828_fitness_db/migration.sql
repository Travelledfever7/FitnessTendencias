-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "training" JSONB NOT NULL,
    "nutrition" JSONB NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "id" INTEGER NOT NULL,
    "idEntrenador" INTEGER NOT NULL,
    "clients" JSONB NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);
