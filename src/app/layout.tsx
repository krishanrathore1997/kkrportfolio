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

export const metadata: Metadata = {
  title: "KKR - Personal Portfolio | Krishan Kumar Rathore",
  description: "Krishan Kumar Rathore is a dynamic Full Stack Software Engineer and Developer building modern, high-performance web applications using React, Next.js, Laravel, Node.js, and MongoDB.",
  authors: [{ name: "Krishan Kumar Rathore" }],
  keywords: ["Krishan Kumar Rathore", "KKR Portfolio", "Full Stack Developer", "Software Engineer", "React Developer", "Next.js", "Laravel", "Ahmedabad"],
  icons: {
    icon: [
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/favicon-dark.png",
    apple: "/favicon-dark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </head>
      <body className="min-h-full flex flex-col bg-bg-dark text-text-primary selection:bg-primary selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
