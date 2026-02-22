import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"
import { Toaster } from "react-hot-toast"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Navigation } from "@/components/navbar"
import { StorefrontHeader } from "@/components/storefront-header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MUSCLE ZONE | Premium Supplements",
  description: "Fuel your gains with premium supplements. Protein, creatine, and pre-workouts — local delivery in Bhavnagar.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Toaster position="bottom-right" />
        <Providers>
          <SmoothScrollProvider>
            <StorefrontHeader>
              <AnnouncementBar />
              <Navigation />
            </StorefrontHeader>
            <div className="pt-0"> {/* Base padding handled by internal component offsets or layout transition */}
              {children}
            </div>
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  )
}
