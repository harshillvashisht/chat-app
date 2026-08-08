// check.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function backfill() {
  const rows = await prisma.message.findMany({
    where: { clientMessageId: null },
    select: { id: true },
  });
  for (const row of rows) {
    await prisma.message.update({
      where: { id: row.id },
      data: { clientMessageId: crypto.randomUUID() },
    });
  }
}

backfill().then(() => prisma.$disconnect());