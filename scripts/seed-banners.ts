import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seedBanners() {
  const { prisma } = await import("../src/lib/db");
  const count = await prisma.banner.count();
  if (count === 0) {
    console.log("Seeding banners since table is empty...");
    await prisma.banner.createMany({
      data: [
        {
          title: "Krishan Rathore Business Card",
          category: "Business Card",
          imageUrl: "https://placehold.co/800x450?text=Krishan+Rathore+Business+Card",
          projectUrl: "https://www.linkedin.com/in/krishanrathore97",
          description: "My digital business card. Scan to save contact details or visit my profile directly.",
          order: 1,
        },
        {
          title: "Doorstep Filings Launch",
          category: "Deployed Features",
          imageUrl: "https://placehold.co/800x450?text=Doorstep+Filings+Launch",
          projectUrl: "https://doorstepfilings.com/",
          description: "Successfully built and deployed the full platform features for business registration.",
          order: 2,
        },
        {
          title: "Next.js Portfolio Release v2.0",
          category: "Others",
          imageUrl: "https://placehold.co/800x450?text=Next.js+Portfolio+v2.0",
          projectUrl: "https://github.com/krishanrathore1997/kkrportfolio",
          description: "Upgraded user experience with dynamic settings, custom pages, and a secure admin backend panel.",
          order: 3,
        },
      ]
    });
    console.log("Banners seeded successfully!");
  } else {
    console.log("Banners table already contains data, skipping.");
  }
  await prisma.$disconnect();
}

seedBanners().catch(console.error);
