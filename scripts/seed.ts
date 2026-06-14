import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import bcrypt from "bcryptjs";

async function seed() {
  const { prisma } = await import("../src/lib/db");
  console.log("Starting database seeding...");

  // 1. Seed Profile
  console.log("Seeding profile...");
  await prisma.profile.deleteMany({});
  await prisma.profile.create({
    data: {
      name: "Krishan Rathore",
      title: "Full Stack Developer",
      subtitle: "BUILD • SCALE • AUTOMATE",
      bioDescription: "I am a full-stack developer with a passion for building user-friendly and visually appealing digital solutions. I work with technologies like HTML, CSS, JavaScript, React, Vue.js, Next.js, PHP, Laravel, Git, and MySQL to create impactful web experiences.",
      phone: "+91 9106035651",
      email: "krishanrathore3497@gmail.com",
      address: "Ahmedabad, Gujrat",
      language: "English, Hindi, Gujrati",
      freelance: "Available",
      cvUrl: "#",
      avatarUrl: "/assets/img/krishan-portrait.jpg",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/krishanrathore97",
        whatsapp: "https://wa.me/919106035651",
      },
    },
  });

  // 2. Seed Services
  console.log("Seeding services...");
  await prisma.service.deleteMany({});
  await prisma.service.createMany({
    data: [
      {
        title: "Graphic Design",
        description: "Delivering creative and impactful visual designs that strengthen brand identity, enhance user engagement, and communicate your message effectively.",
        iconName: "Palette",
        order: 1,
      },
      {
        title: "SaaS Solutions",
        description: "Building scalable Software-as-a-Service platforms with secure architecture, seamless integrations, and exceptional user experiences.",
        iconName: "Cpu",
        order: 2,
      },
      {
        title: "Software Development",
        description: "Developing custom software solutions tailored to business needs, focusing on performance, security, scalability, and reliability.",
        iconName: "Code",
        order: 3,
      },
      {
        title: "Mobile App Development",
        description: "Creating high-performance Android and iOS applications with intuitive interfaces and seamless user experiences.",
        iconName: "Smartphone",
        order: 4,
      },
      {
        title: "Website Development",
        description: "Designing and developing responsive, SEO-friendly websites that deliver outstanding performance across all devices.",
        iconName: "Globe",
        order: 5,
      },
      {
        title: "Software Maintenance & Support",
        description: "Providing ongoing technical support, system monitoring, updates, and maintenance to ensure uninterrupted business operations.",
        iconName: "Laptop",
        order: 6,
      },
    ],
  });

  // 3. Seed Skills
  console.log("Seeding skills...");
  await prisma.skill.deleteMany({});
  await prisma.skill.createMany({
    data: [
      { name: "HTML", percentage: 90, category: "Frontend", order: 1 },
      { name: "CSS", percentage: 80, category: "Frontend", order: 2 },
      { name: "JS / TS", percentage: 80, category: "Frontend", order: 3 },
      { name: "React / Vue JS / Next Js", percentage: 70, category: "Frontend", order: 4 },
      { name: "Laravel", percentage: 75, category: "Backend", order: 5 },
      { name: "Node.js", percentage: 80, category: "Backend", order: 6 },
      { name: "NestJS", percentage: 75, category: "Backend", order: 7 },
      { name: "Git", percentage: 80, category: "Tools", order: 8 },
      { name: "VPS Deployment", percentage: 70, category: "Tools", order: 9 },
    ],
  });

  // 4. Seed Timeline Items
  console.log("Seeding resume timeline...");
  await prisma.timelineItem.deleteMany({});
  await prisma.timelineItem.createMany({
    data: [
      {
        type: "experience",
        title: "Software Engineer",
        subtitle: "KudosIntech Software Pvt. Ltd, Ahmedabad",
        duration: "August 2024 - Present",
        description: "I specialize in developing robust and scalable web applications using frameworks like Laravel, React.js, Vue.js, and Next.js. My expertise extends to API creation, state management with Redux, version control with Git, and implementing CI/CD pipelines to ensure efficient and seamless development workflows.",
        order: 1,
      },
      {
        type: "experience",
        title: "Fullstack Developer",
        subtitle: "Sankhyank Tech Solutions, Ahmedabad",
        duration: "Jun 2023 - July 2024",
        description: "I contribute to creating impactful digital solutions through website design and development. My work includes custom websites, dynamic platforms, software design, and admin panel development, utilizing technologies like Laravel, HTML, CSS, JavaScript, PHP, and jQuery.",
        order: 2,
      },
      {
        type: "experience",
        title: "Broadcast Manager",
        subtitle: "RADIO 2 PI R, Ahmedabad",
        duration: "Nov 2022 - May 2023",
        description: "I manage daily broadcasting schedules and coordinate with developers to enhance software technical aspects. My role involves handling client broadcasting requirements, setting advertisement schedules in fixed time slots, and collaborating with clients and RJs to ensure seamless service and satisfaction.",
        order: 3,
      },
      {
        type: "education",
        title: "Bachelor of Technology (ME)",
        subtitle: "Rajasthan Technical University, Kota",
        duration: "2016 - 2020",
        description: "Graduate with specialization in Mechanical Engineering, laying a strong logical, analytic, and engineering base for software development.",
        order: 4,
      },
    ],
  });

  // 5. Seed Portfolio Items
  console.log("Seeding portfolio...");
  await prisma.portfolioItem.deleteMany({});
  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Doorstep Filings",
        category: "SaaS Platform",
        imageUrl: "/assets/img/portfolio/doorstepfilings.png",
        projectUrl: "https://doorstepfilings.com/",
        order: 1,
      },
      {
        title: "Radio 2 PIR Chappan",
        category: "Streaming Platform",
        imageUrl: "/assets/img/portfolio/radio2pir.jpg",
        projectUrl: "https://live.radio2pir.com/chappan",
        order: 2,
      },
      {
        title: "Figma UI/UX Design System",
        category: "Figma UI/UX",
        imageUrl: "/assets/img/portfolio/portfolio2_lg.jpg",
        projectUrl: "https://www.figma.com/file/LKQ4FJ4bTnCSgJ4v6CbhQN/KKR-Portfolio-Designs",
        order: 3,
      },
      {
        title: "Fashion Hub",
        category: "E-Commerce",
        imageUrl: "https://krishanrathore1997.github.io/fashion-hub/assets/images/banner/mobbanner-lehanga.jpg",
        projectUrl: "https://krishanrathore1997.github.io/fashion-hub",
        order: 4,
      },
      {
        title: "Welding Software",
        category: "Software",
        imageUrl: "/assets/img/portfolio/Welding-software.jpg",
        projectUrl: "https://krishanrathore1997.github.io/Main/config.html",
        order: 5,
      },
      {
        title: "Sattva Ayurveda",
        category: "Website Design",
        imageUrl: "/assets/img/portfolio/sattava.png",
        projectUrl: "https://sattva-ayurveda.spiderai.in/",
        order: 6,
      },
      {
        title: "Kesaria Textile Company",
        category: "Fashion",
        imageUrl: "/assets/img/portfolio/kesriya.png",
        projectUrl: "https://kesariatextilecompany.com",
        order: 7,
      },
      {
        title: "Shrija Design",
        category: "Developments",
        imageUrl: "/assets/img/portfolio/shrija.png",
        projectUrl: "https://shrija-design.spiderai.in",
        order: 8,
      },
      {
        title: "Admin Panel",
        category: "Software",
        imageUrl: "/assets/img/portfolio/admin.jpg",
        projectUrl: "/assets/img/portfolio/admin.jpg",
        order: 9,
      },
    ],
  });

  // 6. Seed Reviews
  console.log("Seeding testimonials...");
  await prisma.review.deleteMany({});
  await prisma.review.createMany({
    data: [
      {
        clientName: "Richard Miles",
        designation: "Chairman",
        reviewText: "“I worked with Krishan on building our corporate landing pages. He delivered modern designs, and his clean approach to coding made the integration extremely easy.”",
        imageUrl: "/assets/img/client/client1.png",
        order: 1,
      },
      {
        clientName: "Vesta Shufelt",
        designation: "Executive Director",
        reviewText: "“Krishan is a dedicated developer who listens closely to the project needs and builds highly performant products. Our responsive portal is fast, fully functional, and easy to maintain.”",
        imageUrl: "/assets/img/client/client2.png",
        order: 2,
      },
      {
        clientName: "Joseph Alves",
        designation: "Managing Director",
        reviewText: "“His capability in Laravel and React is top notch. He created our welding configuration software backend perfectly, allowing us to manage our business operations smoothly.”",
        imageUrl: "/assets/img/client/client3.png",
        order: 3,
      },
    ],
  });

  // 7. Seed Hero Slides
  console.log("Seeding hero slides...");
  await prisma.heroSlide.deleteMany({});
  await prisma.heroSlide.createMany({
    data: [
      { imageUrl: "/assets/hero slider/slide-1.png", title: "Web Design Architecture", order: 1 },
      { imageUrl: "/assets/hero slider/slide-2.png", title: "SaaS Dashboard System", order: 2 },
      { imageUrl: "/assets/hero slider/slide-3.png", title: "E-Commerce Application", order: 3 },
      { imageUrl: "/assets/hero slider/slide-4.png", title: "Business Automation Portal", order: 4 },
      { imageUrl: "/assets/hero slider/slide-5.png", title: "Cloud Infrastructure Map", order: 5 },
      { imageUrl: "/assets/hero slider/slide-6.png", title: "Interactive Web Apps", order: 6 },
      { imageUrl: "/assets/hero slider/slide-7.png", title: "Database Admin Panel", order: 7 },
      { imageUrl: "/assets/hero slider/slide-8.png", title: "API Integrations Engine", order: 8 },
      { imageUrl: "/assets/hero slider/slide-9.png", title: "Responsive UI Mockup", order: 9 },
      { imageUrl: "/assets/hero slider/slide-10.png", title: "Next.js & React Frontend", order: 10 },
      { imageUrl: "/assets/hero slider/slide-11.png", title: "Laravel & PHP Backend", order: 11 },
    ],
  });

  // 7.5 Seed Banners
  console.log("Seeding banners...");
  await prisma.banner.deleteMany({});
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
    ],
  });

  // 8. Seed Admin Credentials
  console.log("Seeding admin credentials...");
  await prisma.admin.deleteMany({});
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Krishan@3497", salt);
  await prisma.admin.create({
    data: {
      username: "admin",
      email: "krishanrathore3497@gmail.com",
      passwordHash: passwordHash,
    },
  });


  console.log("Database seeded successfully!");
  await prisma.$disconnect();
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
