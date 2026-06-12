import { prisma } from "./db";

// Fallback Mock Data for ultimate resilience
const mockProfile = {
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
};

const mockServices = [
  { id: "s1", title: "Website Design", description: "Creating visually stunning, user-friendly designs that align with your brand identity.", iconName: "Palette", order: 1 },
  { id: "s2", title: "Software Design", description: "Designing scalable, robust architecture and intuitive visual systems for applications.", iconName: "Cpu", order: 2 },
  { id: "s3", title: "Software Development", description: "Building robust, backend engines and application logic with high-level performance.", iconName: "Code", order: 3 },
  { id: "s4", title: "App Design", description: "Designing interfaces for mobile screens that offer seamless, responsive user experiences.", iconName: "Smartphone", order: 4 },
  { id: "s5", title: "Website Development", description: "Developing responsive websites with clean, search engine optimized, standard code.", iconName: "Globe", order: 5 },
  { id: "s6", title: "Responsive Design", description: "Ensuring your website fits beautifully on mobile, tablet, and widescreen desktop layouts.", iconName: "Laptop", order: 6 },
];

const mockSkills = [
  { id: "sk1", name: "HTML", percentage: 90, category: "Frontend" },
  { id: "sk2", name: "CSS", percentage: 80, category: "Frontend" },
  { id: "sk3", name: "JS / TS", percentage: 80, category: "Frontend" },
  { id: "sk4", name: "React / Next.js", percentage: 70, category: "Frontend" },
  { id: "sk5", name: "Laravel", percentage: 75, category: "Backend" },
  { id: "sk6", name: "Node.js", percentage: 80, category: "Backend" },
  { id: "sk7", name: "NestJS", percentage: 75, category: "Backend" },
  { id: "sk8", name: "Git", percentage: 80, category: "Tools" },
  { id: "sk9", name: "VPS Deployment", percentage: 70, category: "Tools" },
];

const mockTimeline = [
  {
    id: "t1",
    type: "experience",
    title: "Software Engineer",
    subtitle: "KudosIntech Software Pvt. Ltd, Ahmedabad",
    duration: "August 2024 - Present",
    description: "I specialize in developing robust and scalable web applications using frameworks like Laravel, React.js, Vue.js, and Next.js. My expertise extends to API creation, state management with Redux, version control with Git, and implementing CI/CD pipelines to ensure efficient and seamless development workflows.",
  },
  {
    id: "t2",
    type: "experience",
    title: "Fullstack Developer",
    subtitle: "Sankhyank Tech Solutions, Ahmedabad",
    duration: "Jun 2023 - July 2024",
    description: "I contribute to creating impactful digital solutions through website design and development. My work includes custom websites, dynamic platforms, software design, and admin panel development, utilizing technologies like Laravel, HTML, CSS, JavaScript, PHP, and jQuery.",
  },
  {
    id: "t3",
    type: "experience",
    title: "Broadcast Manager",
    subtitle: "RADIO 2 PI R, Ahmedabad",
    duration: "Nov 2022 - May 2023",
    description: "I manage daily broadcasting schedules and coordinate with developers to enhance software technical aspects. My role involves handling client broadcasting requirements, setting advertisement schedules in fixed time slots, and collaborating with clients and RJs to ensure seamless service and satisfaction.",
  },
  {
    id: "t4",
    type: "education",
    title: "Bachelor of Technology (ME)",
    subtitle: "Rajasthan Technical University, Kota",
    duration: "2016 - 2020",
    description: "Graduate with specialization in Mechanical Engineering, laying a strong logical, analytic, and engineering base for software development.",
  },
];

const mockPortfolio = [
  {
    id: "p1",
    title: "Doorstep Filings",
    category: "SaaS Platform",
    imageUrl: "/assets/img/portfolio/doorstepfilings.png",
    projectUrl: "https://doorstepfilings.com/",
  },
  {
    id: "p2",
    title: "Radio 2 PIR Chappan",
    category: "Streaming Platform",
    imageUrl: "/assets/img/portfolio/radio2pir.jpg",
    projectUrl: "https://live.radio2pir.com/chappan",
  },
  {
    id: "p3",
    title: "Figma UI/UX Design System",
    category: "Figma UI/UX",
    imageUrl: "/assets/img/portfolio/portfolio2_lg.jpg",
    projectUrl: "https://www.figma.com/file/LKQ4FJ4bTnCSgJ4v6CbhQN/KKR-Portfolio-Designs",
  },
  {
    id: "p4",
    title: "Fashion Hub",
    category: "E-Commerce",
    imageUrl: "https://krishanrathore1997.github.io/fashion-hub/assets/images/banner/mobbanner-lehanga.jpg",
    projectUrl: "https://krishanrathore1997.github.io/fashion-hub",
  },
  {
    id: "p5",
    title: "Welding Software",
    category: "Software",
    imageUrl: "/assets/img/portfolio/Welding-software.jpg",
    projectUrl: "https://krishanrathore1997.github.io/Main/config.html",
  },
  {
    id: "p6",
    title: "Sattva Ayurveda",
    category: "Website Design",
    imageUrl: "/assets/img/portfolio/sattava.png",
    projectUrl: "https://sattva-ayurveda.spiderai.in/",
  },
  {
    id: "p7",
    title: "Kesaria Textile Company",
    category: "Fashion",
    imageUrl: "/assets/img/portfolio/kesriya.png",
    projectUrl: "https://kesariatextilecompany.com",
  },
  {
    id: "p8",
    title: "Shrija Design",
    category: "Developments",
    imageUrl: "/assets/img/portfolio/shrija.png",
    projectUrl: "https://shrija-design.spiderai.in",
  },
  {
    id: "p9",
    title: "Admin Panel",
    category: "Software",
    imageUrl: "/assets/img/portfolio/admin.jpg",
    projectUrl: "/assets/img/portfolio/admin.jpg",
  },
];

const mockReviews = [
  {
    id: "r1",
    clientName: "Richard Miles",
    designation: "Chairman",
    reviewText: "\u201cI worked with Krishan on building our corporate landing pages. He delivered modern designs, and his clean approach to coding made the integration extremely easy.\u201d",
    imageUrl: "/assets/img/client/client1.png",
  },
  {
    id: "r2",
    clientName: "Vesta Shufelt",
    designation: "Executive Director",
    reviewText: "\u201cKrishan is a dedicated developer who listens closely to the project needs and builds highly performant products. Our responsive portal is fast, fully functional, and easy to maintain.\u201d",
    imageUrl: "/assets/img/client/client2.png",
  },
  {
    id: "r3",
    clientName: "Joseph Alves",
    designation: "Managing Director",
    reviewText: "\u201cHis capability in Laravel and React is top notch. He created our welding configuration software backend perfectly, allowing us to manage our business operations smoothly.\u201d",
    imageUrl: "/assets/img/client/client3.png",
  },
];

const mockHeroSlides = [
  { id: "hs1", imageUrl: "/assets/hero slider/slide-1.png", title: "Web Design Architecture", order: 1 },
  { id: "hs2", imageUrl: "/assets/hero slider/slide-2.png", title: "SaaS Dashboard System", order: 2 },
  { id: "hs3", imageUrl: "/assets/hero slider/slide-3.png", title: "E-Commerce Application", order: 3 },
  { id: "hs4", imageUrl: "/assets/hero slider/slide-4.png", title: "Business Automation Portal", order: 4 },
  { id: "hs5", imageUrl: "/assets/hero slider/slide-5.png", title: "Cloud Infrastructure Map", order: 5 },
  { id: "hs6", imageUrl: "/assets/hero slider/slide-6.png", title: "Interactive Web Apps", order: 6 },
  { id: "hs7", imageUrl: "/assets/hero slider/slide-7.png", title: "Database Admin Panel", order: 7 },
  { id: "hs8", imageUrl: "/assets/hero slider/slide-8.png", title: "API Integrations Engine", order: 8 },
  { id: "hs9", imageUrl: "/assets/hero slider/slide-9.png", title: "Responsive UI Mockup", order: 9 },
  { id: "hs10", imageUrl: "/assets/hero slider/slide-10.png", title: "Next.js & React Frontend", order: 10 },
  { id: "hs11", imageUrl: "/assets/hero slider/slide-11.png", title: "Laravel & PHP Backend", order: 11 },
];

export async function getPortfolioData() {
  try {
    // Fetch profile (first record)
    const profileDoc = await prisma.profile.findFirst();
    const profile = profileDoc ?? mockProfile;

    // Fetch services (sorted by order)
    const servicesDocs = await prisma.service.findMany({ orderBy: { order: "asc" } });
    const services = servicesDocs.length > 0 ? servicesDocs : mockServices;

    // Fetch skills (sorted by order)
    const skillsDocs = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    const skills = skillsDocs.length > 0 ? skillsDocs : mockSkills;

    // Fetch timeline (sorted by order)
    const timelineDocs = await prisma.timelineItem.findMany({ orderBy: { order: "asc" } });
    const timeline = timelineDocs.length > 0 ? timelineDocs : mockTimeline;

    // Fetch portfolio items
    const portfolioDocs = await prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
    const portfolio = portfolioDocs.length > 0 ? portfolioDocs : mockPortfolio;

    // Fetch reviews
    const reviewsDocs = await prisma.review.findMany({ orderBy: { order: "asc" } });
    const reviews = reviewsDocs.length > 0 ? reviewsDocs : mockReviews;

    // Fetch hero slides
    const heroSlidesDocs = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
    const heroSlides = heroSlidesDocs.length > 0 ? heroSlidesDocs : mockHeroSlides;

    return {
      profile,
      services,
      skills,
      timeline,
      portfolio,
      reviews,
      heroSlides,
    };
  } catch (error) {
    console.error("Database connection or query failed. Using mock fallbacks.", error);
    return {
      profile: mockProfile,
      services: mockServices,
      skills: mockSkills,
      timeline: mockTimeline,
      portfolio: mockPortfolio,
      reviews: mockReviews,
      heroSlides: mockHeroSlides,
    };
  }
}
