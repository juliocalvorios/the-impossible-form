import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Impossible Form | A Satirical Take on Dark UX Patterns",
  description: "A form that doesn't want to be filled out. Experience fleeing buttons, self-unchecking checkboxes, and changing password requirements. A satirical demonstration of dark UX patterns using React Hook Form, Zod, and Framer Motion.",
  keywords: ["dark patterns", "UX", "React", "form", "satire", "web development", "Zod", "React Hook Form", "Framer Motion"],
  authors: [{ name: "Julio Calvo", url: "https://juliocalvo.dev" }],
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "The Impossible Form",
    description: "A form that doesn't want to be filled out. Can you conquer it?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Impossible Form",
    description: "A form that doesn't want to be filled out. Can you conquer it?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
