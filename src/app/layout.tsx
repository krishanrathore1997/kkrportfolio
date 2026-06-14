import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://krishanrathore.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "KKR - Personal Portfolio | Krishan Kumar Rathore",
    template: "%s | Krishan Kumar Rathore",
  },
  description: "Krishan Kumar Rathore is a dynamic Full Stack Software Engineer and Developer building modern, high-performance web applications using React, Next.js, Laravel, Node.js, and MongoDB.",
  authors: [{ name: "Krishan Kumar Rathore", url: baseUrl }],
  creator: "Krishan Kumar Rathore",
  publisher: "Krishan Kumar Rathore",
  keywords: [
    "Krishan Kumar Rathore",
    "Krishan Rathore",
    "KKR Portfolio",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Laravel Developer",
    "Node.js Developer",
    "Ahmedabad",
    "Freelance Developer India",
    "Build By Krish"
  ],
  icons: {
    icon: [
      { url: "/assets/img/white-logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/assets/img/dark-logo.png", media: "(prefers-color-scheme: dark)" },
      { url: "/assets/img/white-logo.png" }
    ],
    shortcut: "/assets/img/white-logo.png",
    apple: "/assets/img/white-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "KKR - Personal Portfolio | Krishan Kumar Rathore",
    description: "Krishan Kumar Rathore is a dynamic Full Stack Software Engineer and Developer building modern, high-performance web applications using React, Next.js, Laravel, Node.js, and MongoDB.",
    siteName: "Build By Krish Portfolio",
    images: [
      {
        url: "/assets/img/facebook-cover.png",
        width: 1200,
        height: 630,
        alt: "Krishan Kumar Rathore Portfolio - Build By Krish",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KKR - Personal Portfolio | Krishan Kumar Rathore",
    description: "Krishan Kumar Rathore is a dynamic Full Stack Software Engineer and Developer building modern, high-performance web applications.",
    images: ["/assets/img/facebook-cover.png"],
    creator: "@krishanrathore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for Search Engine Optimization
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Krishan Kumar Rathore",
    "url": baseUrl,
    "image": `${baseUrl}/assets/img/krishan-portrait.jpg`,
    "sameAs": [
      "https://www.linkedin.com/in/krishanrathore97",
      "https://github.com/krishanrathore1997"
    ],
    "jobTitle": "Full Stack Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "KudosIntech Software Pvt. Ltd"
    },
    "description": "Krishan Kumar Rathore is a dynamic Full Stack Software Engineer and Developer building modern, high-performance web applications using React, Next.js, Laravel, Node.js, and MongoDB.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "knowsAbout": [
      "Software Engineering",
      "Web Development",
      "React.js",
      "Next.js",
      "Laravel",
      "Node.js",
      "API Development",
      "Database Management"
    ]
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Build By Krish",
    "image": `${baseUrl}/assets/img/white-logo.png`,
    "url": baseUrl,
    "telephone": "+919106035651",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "priceRange": "$$",
    "founder": {
      "@type": "Person",
      "name": "Krishan Kumar Rathore"
    }
  };

  return (
    <html
      lang="en"
      className={`${interSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-dark text-text-primary selection:bg-primary selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

