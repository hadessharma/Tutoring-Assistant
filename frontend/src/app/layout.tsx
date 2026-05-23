import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tutoring Assistant | Academic Mastery",
  description: "Your course-specific Socratic learning guide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col selection:bg-primary-gold/30 selection:text-primary-gold`}>
        {children}
      </body>
    </html>
  );
}
