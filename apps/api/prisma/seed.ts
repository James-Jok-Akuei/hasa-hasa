import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates the first platform admin. Ops reviewers are not self-serve — there
 * is deliberately no endpoint that grants isPlatformAdmin, so the only way in
 * is here or a deliberate SQL statement.
 */
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@hasahasa.com";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { isPlatformAdmin: true },
    create: { email: ADMIN_EMAIL, name: "Platform Admin", isPlatformAdmin: true },
  });
  console.log(`Platform admin ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
